import { useState, useEffect, useRef } from "react";
import "./Assignments.css";
import { getToken, getUser, authFetch } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';

const STORAGE_KEY = 'campusbuddy.assignments.v1';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    dueDate: "",
    course: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [previews, setPreviews] = useState({});
  const [didLoad, setDidLoad] = useState(false);
  const createdUrlsRef = useRef(new Set());

  const user = getUser();
  const token = getToken();
  const { showToast } = useToast();
  const toast = { showToast };

  // Load persisted assignments from backend (if authenticated) or localStorage
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (token && user) {
          setLoading(true);
          const res = await authFetch(`/api/assignments`);
          if (!mounted) return;
          setAssignments(res || []);
          if (mounted) setDidLoad(true);
        } else {
          // Load from localStorage only if not already loaded from server
          if (!didLoad) {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setAssignments(JSON.parse(raw));
            if (mounted) setDidLoad(true);
          }
        }
      } catch (err) {
        console.warn('Failed to load assignments', err);
        // Set didLoad even on error to prevent infinite loops
        if (mounted) setDidLoad(true);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist when assignments change (only in localStorage for unauthenticated users)
  useEffect(() => {
    if (!token && didLoad) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
      } catch (err) {
        console.warn('Failed to write assignments to localStorage', err);
      }
    }
  }, [assignments, token, didLoad]);

  const handleAdd = async () => {
    // basic client-side validation
    const newErrors = {};
    if (!newAssignment.title || !newAssignment.title.trim()) newErrors.title = 'Please provide a title';
    if (!newAssignment.dueDate) newErrors.dueDate = 'Please select a due date';
    if (!newAssignment.course || !newAssignment.course.trim()) newErrors.course = 'Please provide a course name';
    if (Object.keys(newErrors).length) return setErrors(newErrors);
    
    console.log('🔍 DEBUG - Token:', token ? 'EXISTS' : 'MISSING');
    console.log('🔍 DEBUG - User:', user ? user.name : 'MISSING');
    console.log('🔍 DEBUG - Assignment data:', newAssignment);
    
    if (token && user) {
      try {
        setLoading(true);
        console.log('📤 Sending assignment to server...');
        const body = { ...newAssignment };
        const result = await authFetch('/api/assignments/add', { method: 'POST', body });
        console.log('✅ Server response:', result);
        const fresh = await authFetch(`/api/assignments`);
        setAssignments(fresh || []);
        setNewAssignment({ title: "", dueDate: "", course: "" });
        setErrors({});
        toast.showToast('Assignment added', 'success');
      } catch (err) {
        console.error('❌ Error adding assignment:', err);
        console.warn('Failed to add assignment to server', err);
        if (err && err.errors) {
          const apiErrors = {};
          err.errors.forEach(e => { apiErrors[e.param] = e.msg; });
          setErrors({ title: apiErrors.title || '', dueDate: apiErrors.dueDate || '', course: apiErrors.course || '' });
        } else {
          toast.showToast(err && err.error ? err.error : 'Failed to add assignment', 'error');
        }
      } finally { setLoading(false); }
    } else {
      console.log('⚠️ Not logged in - saving to localStorage');
      setAssignments(prev => [...prev, { ...newAssignment }]);
      setNewAssignment({ title: "", dueDate: "", course: "" });
    }
  };

  const handleDelete = async (index) => {
    if (token && user) {
      try {
        const item = assignments[index];
        if (!item || !item._id) return;
        await authFetch(`/api/assignments/delete/${item._id}`, { method: 'DELETE' });
          const fresh = await authFetch(`/api/assignments`);
        setAssignments(fresh || []);
      } catch (err) {
        console.warn('Failed to delete assignment', err);
      }
    } else {
      setAssignments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (id, e) => {
    const file = e.target.files[0];
    setSelectedFiles((s) => ({ ...s, [id]: file }));
    // cleanup previous image url if any
    setPreviews((p) => {
      const prev = p[id];
      if (prev && prev.type === 'image' && prev.url) {
        try { URL.revokeObjectURL(prev.url); } catch (err) { /* ignore */ }
      }
      return p;
    });
    // create preview
      if (file) {
      if (file.type && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        createdUrlsRef.current.add(url);
        setPreviews((p) => ({ ...p, [id]: { type: 'image', url } }));
      } else if (file.type && (file.type.startsWith('text/') || file.name.endsWith('.py') || file.name.endsWith('.ipynb') || file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = String(reader.result).slice(0, 500);
          setPreviews((p) => ({ ...p, [id]: { type: 'text', text } }));
        };
        reader.readAsText(file);
      } else {
        setPreviews((p) => ({ ...p, [id]: { type: 'file', name: file.name } }));
      }
    } else {
      setPreviews((p) => ({ ...p, [id]: null }));
    }
  };

  // Revoke any created object URLs when the component unmounts
  useEffect(() => {
    const urls = createdUrlsRef.current;
    return () => {
      urls.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch (err) { /* ignore */ }
      });
      urls.clear();
    };
  }, []);

  const handleResubmit = async (id) => {
    const item = assignments.find((x) => x._id === id);
    if (!item || !item._id) return;
    const file = selectedFiles[id];
    if (!file) return toast.showToast('Please select a file to upload', 'error');
    if (!token) return toast.showToast('Please login to upload', 'info');
    const fd = new FormData();
    fd.append('file', file);
    // upload with progress using XMLHttpRequest
    const uploadUrl = `/api/assignments/resubmit/${item._id}`;
    try {
      setUploading((u) => ({ ...u, [id]: true }));
      setUploadProgress((u) => ({ ...u, [id]: 0 }));
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress((u) => ({ ...u, [id]: percent }));
          }
        };
        xhr.onload = () => {
          try {
            const ct = xhr.getResponseHeader('content-type') || '';
            const res = ct.includes('application/json') ? JSON.parse(xhr.responseText) : { ok: xhr.status >= 200 && xhr.status < 300 };
            if (xhr.status >= 200 && xhr.status < 300) resolve(res);
            else reject(res);
          } catch (err) { reject(err); }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(fd);
      });
      const fresh = await authFetch(`/api/assignments`);
      setAssignments(fresh || []);
      setSelectedFiles((s) => ({ ...s, [id]: null }));
      // revoke any objectURL used for preview
      setPreviews((p) => {
        const prev = p[id];
        if (prev && prev.type === 'image' && prev.url) {
          try { URL.revokeObjectURL(prev.url); } catch (err) { /* ignore */ }
        }
        return { ...p, [id]: null };
      });
      toast.showToast('File uploaded', 'success');
    } catch (err) {
      console.error('Upload failed', err);
      if (err && err.error) toast.showToast(err.error, 'error');
      else toast.showToast('Upload failed', 'error');
    } finally { setUploading((u) => ({ ...u, [id]: false })); setUploadProgress((u) => ({ ...u, [id]: 0 })); }
  };

  return (
    <div className="assignments-page">
      <div className="assignments-header">
        <h1>Assignments</h1>
        <p className="auth-sub">Add and manage your assignments — resubmit files for graded work.</p>
      </div>

      <div className="assignments-form-card">
        <div className="assignments-form-title">Add Assignment</div>
        <div className="assignments-input-group">
          <Input
            type="text"
            name="title"
            placeholder="Assignment Title"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            error={errors.title}
          />

          <Input
            type="date"
            name="dueDate"
            placeholder="Due Date"
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            error={errors.dueDate}
          />

          <Input
            type="text"
            name="course"
            placeholder="Course Name"
            value={newAssignment.course}
            onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            error={errors.course}
          />

          <Button className="assignments-add-btn" onClick={handleAdd} isLoading={loading}>+ Add</Button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="assignments-list-card">
        <h2 className="assignments-list-title">Your Assignments</h2>
        {loading ? (
          <div className="assignments-loading">Loading...</div>
        ) : assignments.length === 0 ? (
          <div className="assignments-empty">
            <div className="assignments-empty-icon">📚</div>
            <p>No assignments yet. Add one to get started!</p>
          </div>
        ) : (
          <ul className="assignments-list">
            {assignments.map((a, index) => (
              <li key={a._id || index} className="assignment-item">
                <div className="assignment-header">
                  <h3 className="assignment-title">{a.title}</h3>
                  {a.course && <span className="assignment-course">{a.course}</span>}
                </div>

                <div className="assignment-details">
                  <span className="assignment-detail-icon">📅</span>
                  <span className="assignment-deadline">{new Date(a.dueDate).toLocaleDateString()}</span>
                </div>

                {/* Attachment list */}
                <div className="assignment-attachments">
                  {a.attachments && a.attachments.length > 0 && (
                    <div className="attachments-list">
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>
                        📎 Submissions ({a.attachments.length})
                      </div>
                      {a.attachments.map((att, i) => (
                        <div key={i} className="attachment-item">
                          <a href={att.url} target="_blank" rel="noreferrer" title="Download">
                            {att.originalName || att.filename}
                          </a>
                          <span className="attachment-meta">{new Date(att.uploadedAt).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File input + resubmit button */}
                  <div className="attachment-upload">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.ipynb,.py,.txt,.md,.png,.jpg,.jpeg" 
                      onChange={(e) => handleFileChange(a._id, e)}
                      title="Select file to upload"
                    />
                    <Button 
                      onClick={() => handleResubmit(a._id)} 
                      disabled={uploading[a._id]}
                      style={{ 
                        backgroundColor: uploading[a._id] ? '#9ca3af' : '#10b981',
                        cursor: uploading[a._id] ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {uploading[a._id] ? `⏳ ${uploadProgress[a._id] || 0}%` : '📤 Resubmit'}
                    </Button>

                    {/* Preview area (image, text snippet or filename) */}
                    {previews[a._id] && (
                      <div className="assignment-preview">
                        {previews[a._id].type === 'image' && (
                          <img className="preview-image" src={previews[a._id].url} alt="Preview" />
                        )}
                        {previews[a._id].type === 'text' && (
                          <pre className="preview-text">{previews[a._id].text}...</pre>
                        )}
                        {previews[a._id].type === 'file' && (
                          <div className="preview-file">📄 {previews[a._id].name}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="assignment-actions">
                  <button 
                    className="assignment-delete-btn" 
                    onClick={() => handleDelete(index)}
                    title="Delete this assignment"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Assignments;