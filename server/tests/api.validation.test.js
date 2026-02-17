const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const col of collections) {
    await col.deleteMany({});
  }
});

describe('API validation', () => {
  test('POST /api/auth/register - invalid payload returns 400 and errors', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    const keys = res.body.errors.map(e => e.param);
    expect(keys).toEqual(expect.arrayContaining(['name', 'email', 'password']));
  });

  test('POST /api/auth/register - valid payload succeeds', async () => {
    const payload = { name: 'Test', email: 'test@example.com', password: 'password123' };
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(payload.email);
  });

  test('POST /api/auth/login - invalid email returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'bad', password: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('PUT /api/profile/password - newPassword too short returns 400', async () => {
    // register and login first
    const reg = await request(app).post('/api/auth/register').send({ name: 'P', email: 'p@example.com', password: 'password' });
    const token = reg.body.token;
    const res = await request(app).put('/api/profile/password').set('Authorization', `Bearer ${token}`).send({ currentPassword: 'password', newPassword: '123' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.some(e => e.param === 'newPassword')).toBe(true);
  });

  test('POST /api/assignments/add - missing fields returns 400 errors', async () => {
    const reg = await request(app).post('/api/auth/register').send({ name: 'A', email: 'a@example.com', password: 'password' });
    const token = reg.body.token;
    const res = await request(app).post('/api/assignments/add').set('Authorization', `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    const keys = res.body.errors.map(e => e.param);
    expect(keys).toEqual(expect.arrayContaining(['title', 'dueDate', 'course']));
  });

  test('POST /api/gpa/course - invalid fields returns 400', async () => {
    const reg = await request(app).post('/api/auth/register').send({ name: 'G', email: 'g@example.com', password: 'password' });
    const token = reg.body.token;
    const res = await request(app).post('/api/gpa/course').set('Authorization', `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    const keys = res.body.errors.map(e => e.param);
    expect(keys).toEqual(expect.arrayContaining(['name', 'credits', 'gradePoint']));
  });

  test('Valid assignment creation succeeds', async () => {
    const reg = await request(app).post('/api/auth/register').send({ name: 'B', email: 'b@example.com', password: 'password' });
    const token = reg.body.token;
    const body = { title: 'HW1', dueDate: '2025-12-31', course: 'CSE101' };
    const res = await request(app).post('/api/assignments/add').set('Authorization', `Bearer ${token}`).send(body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.assignment.title).toBe(body.title);
  });

  test('Valid gpa course creation succeeds', async () => {
    const reg = await request(app).post('/api/auth/register').send({ name: 'H', email: 'h@example.com', password: 'password' });
    const token = reg.body.token;
    const body = { name: 'Calculus', credits: 3, grade: 'A', gradePoint: 4.0 };
    const res = await request(app).post('/api/gpa/course').set('Authorization', `Bearer ${token}`).send(body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.course.name).toBe(body.name);
  });

  test('Assignment resubmit (upload) succeeds with allowed file type', async () => {
    const reg = await request(app).post('/api/auth/register').send({ name: 'U', email: 'u@example.com', password: 'password' });
    const token = reg.body.token;
    const body = { title: 'HW2', dueDate: '2025-12-31', course: 'CSE102' };
    const addRes = await request(app).post('/api/assignments/add').set('Authorization', `Bearer ${token}`).send(body);
    expect(addRes.status).toBe(200);
    const assignmentId = addRes.body.assignment._id;

    const fileBuf = Buffer.from('print("hello")');
    const uploadRes = await request(app)
      .post(`/api/assignments/resubmit/${assignmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', fileBuf, 'test.py');

    expect(uploadRes.status).toBe(200);
    expect(uploadRes.body).toHaveProperty('attachment');
    expect(uploadRes.body.attachment).toHaveProperty('url');

    // Upload an image as well (client allows image previews)
    const img = await request(app)
      .post(`/api/assignments/resubmit/${assignmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from([0x89,0x50,0x4e,0x47]), 'preview.png');
    expect(img.status).toBe(200);
    expect(img.body.success).toBe(true);

    // Fetch assignment and assert attachments include both files
    const get = await request(app).get('/api/assignments').set('Authorization', `Bearer ${token}`);
    expect(get.status).toBe(200);
    const a = get.body.find(x => x._id === assignmentId);
    expect(a).toBeDefined();
    expect(a.attachments).toBeDefined();
    expect(a.attachments.length).toBeGreaterThanOrEqual(2);

    // Delete assignment and ensure uploaded files are removed from disk
    // capture filenames
    const filenames = a.attachments.map(att => att.filename).filter(Boolean);
    const del = await request(app).delete(`/api/assignments/delete/${assignmentId}`).set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);
    // ensure files no longer exist
    filenames.forEach(fn => {
      const p = require('path').join(__dirname, '..', 'uploads', fn);
      expect(require('fs').existsSync(p)).toBe(false);
    });
  });

  test('POST /api/gpa/calculate validates and returns stats', async () => {
    const reg = await request(app).post('/api/auth/register').send({ name: 'Calc', email: 'calc@example.com', password: 'password' });
    const token = reg.body.token;
    // invalid payload
    const bad = await request(app).post('/api/gpa/calculate').set('Authorization', `Bearer ${token}`).send({ courses: [] });
    expect(bad.status).toBe(400);

    const res = await request(app).post('/api/gpa/calculate').set('Authorization', `Bearer ${token}`).send({ courses: [{ name: 'C1', credits: 3, gradePoint: 4 }] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('stats');
    expect(res.body.stats.gpa).toBe(4);
  });
});
