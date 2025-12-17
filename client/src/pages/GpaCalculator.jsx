import { useState, useEffect } from "react";
import "./GpaCalculator.css";
import { getToken, getUser, authFetch } from '../utils/api';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';

const GpaCalculator = () => {
  const [courses, setCourses] = useState([
    { name: "", credit: "", grade: "" },
  ]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = getToken();
  const user = getUser();
  const { showToast } = useToast();
  const toast = { showToast };
  const DRAFT_KEY = 'campusbuddy.gpa.draft';
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (token && user) {
        try {
          setLoading(true);
          const res = await authFetch('/api/gpa/courses');
          if (!mounted) return;
          if (res && res.courses) {
            const mapped = res.courses.map(c => ({ name: c.name, credit: c.credits, grade: c.grade }));
            setCourses(mapped.length ? mapped : [{ name: "", credit: "", grade: "" }]);
          }
        } catch (err) {
          console.warn('Failed to load courses', err);
        } finally { setLoading(false); }
      } else {
        // load draft from localStorage if present
        try {
          const raw = localStorage.getItem(DRAFT_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) setCourses(parsed);
          }
        } catch (err) {
          console.warn('Failed to load draft', err);
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, []); // Run once on mount

  // Persist drafts to localStorage (debounced)
  useEffect(() => {
    setDraftSaved(false);
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(courses));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 1500);
      } catch (err) {
        console.warn('Failed to save draft', err);
      }
    }, 400);
    return () => clearTimeout(id);
  }, [courses]);

  const gradeToPoint = (grade) => {
    const scale = {
      A: 4.0,
      A_minus: 3.7,
      B_plus: 3.3,
      B: 3.0,
      B_minus: 2.7,
      C_plus: 2.3,
      C: 2.0,
      C_minus: 1.7,
      D: 1.0,
      F: 0.0,
    };
    return scale[grade] || 0;
  };



  const handleUpdate = (index, key, value) => {
    const updated = [...courses];
    updated[index][key] = value;
    setCourses(updated);
    const e = [...errors];
    if (!e[index]) e[index] = {};
    e[index][key] = '';
    setErrors(e);
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((c) => {
      const credit = parseFloat(c.credit);
      const gradePoint = gradeToPoint(c.grade);

      if (!isNaN(credit) && credit > 0 && gradePoint >= 0) {
        totalCredits += credit;
        totalPoints += credit * gradePoint;
      }
    });

    if (totalCredits === 0) return 0;

    return (totalPoints / totalCredits).toFixed(2);
  };

  const saveCourseToServer = async (c) => {
    if (!token) return;
    const gp = gradeToPoint(c.grade);
    try {
      return await authFetch('/api/gpa/course', { method: 'POST', body: { name: c.name, credits: Number(c.credit), grade: c.grade, gradePoint: gp } });
    } catch (err) {
      throw err;
    }
  };

  const handleAddCourse = async () => {
    setCourses(prev => [...prev, { name: "", credit: "", grade: "" }]);
    setErrors(prev => [...prev, {}]);
    if (toast && toast.showToast) toast.showToast('Course added', 'info');
  };

  const handleSaveAll = async () => {
    if (!token) {
      if (toast && toast.showToast) toast.showToast('Please login to save courses', 'warning');
      return;
    }
    
    console.log('💾 Attempting to save all courses...');
    console.log('🔑 Token exists:', !!token);
    console.log('👤 User:', user);
    
    setLoading(true);
    try {
      // Client-side validation first
      const clientErrors = courses.map((c) => ({ name: '', credit: '', grade: '' }));
      let hasError = false;
      courses.forEach((c, i) => {
        if (!c.name || !c.name.trim()) { clientErrors[i].name = 'Course name is required'; hasError = true; }
        if (!c.credit || Number(c.credit) <= 0) { clientErrors[i].credit = 'Credits must be greater than 0'; hasError = true; }
        if (!c.grade) { clientErrors[i].grade = 'Select a grade'; hasError = true; }
      });
      
      if (hasError) {
        console.warn('⚠️ Client validation failed');
        setErrors(clientErrors);
        setLoading(false);
        return;
      }
      
      // Prepare courses with grade points
      const coursesToSave = courses.map(c => ({
        name: c.name,
        credits: Number(c.credit),
        grade: c.grade,
        gradePoint: gradeToPoint(c.grade)
      }));
      
      console.log('📤 Sending courses to server:', coursesToSave);
      
      // Save all courses at once
      const response = await authFetch('/api/gpa/courses/save-all', { 
        method: 'POST', 
        body: { courses: coursesToSave } 
      });
      
      console.log('✅ Server response:', response);
      
      if (response.success) {
        if (toast && toast.showToast) toast.showToast('Courses saved successfully', 'success');
        // Optionally reload courses from server to sync
        const reloaded = await authFetch('/api/gpa/courses');
        if (reloaded && reloaded.courses) {
          const mapped = reloaded.courses.map(c => ({ name: c.name, credit: c.credits, grade: c.grade }));
          setCourses(mapped.length ? mapped : [{ name: "", credit: "", grade: "" }]);
        }
      }
    } catch (err) {
      console.error('❌ Error saving courses:', err);
      if (toast && toast.showToast) toast.showToast('Failed to save courses: ' + (err.message || 'Unknown error'), 'error');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="gpa-calculator-page">
      <div className="gpa-header">
        <div className="gpa-header-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1>📊 GPA Calculator</h1>
            <p>Calculate your cumulative GPA instantly</p>
          </div>
        </div>
      </div>

      <div className="gpa-content">
        <div className="courses-card">
          <h2 className="courses-title">Add Your Courses</h2>
          <div className="courses-list">
            {courses.map((c, index) => (
              <div key={index} className="course-input-group">
                <input
                  type="text"
                  placeholder="Course Name (e.g., Calculus I)"
                  value={c.name}
                  onChange={(e) => handleUpdate(index, "name", e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                  className="course-name-input"
                />
                {errors[index] && errors[index].name && <div className="field-error">{errors[index].name}</div>}

                <input
                  type="number"
                  placeholder="Credits"
                  step="0.5"
                  min="0"
                  value={c.credit}
                  onChange={(e) => handleUpdate(index, "credit", e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                  className="course-credit-input"
                />
                {errors[index] && errors[index].credit && <div className="field-error">{errors[index].credit}</div>}

                <select
                  value={c.grade}
                  onChange={(e) => handleUpdate(index, "grade", e.target.value)}
                  className="course-grade-select"
                >
                  <option value="">Select Grade</option>
                  <option value="A">A (4.0)</option>
                  <option value="A_minus">A- (3.7)</option>
                  <option value="B_plus">B+ (3.3)</option>
                  <option value="B">B (3.0)</option>
                  <option value="B_minus">B- (2.7)</option>
                  <option value="C_plus">C+ (2.3)</option>
                  <option value="C">C (2.0)</option>
                  <option value="C_minus">C- (1.7)</option>
                  <option value="D">D (1.0)</option>
                  <option value="F">F (0.0)</option>
                </select>
                {errors[index] && errors[index].grade && <div className="field-error">{errors[index].grade}</div>}
              </div>
            ))}
          </div>

            <div className="courses-actions">
            <Button onClick={handleAddCourse} className="add-course-btn">+ Add Course</Button>
            {!token && <div style={{ marginTop: 8, color: 'var(--color-text-secondary)', fontSize: 13 }}>Login to save courses</div>}
            {draftSaved && <div style={{ marginTop: 8, color: 'var(--color-primary-dark)', fontSize: 13 }}>Draft saved</div>}
          </div>
        </div>

        <div className="gpa-result-card">
          <h2 className="result-title">Your GPA</h2>
          <div className="gpa-display">
            <div className="gpa-value">{calculateGPA()}</div>
            <div className="gpa-scale">/4.0</div>
          </div>
          {courses.length > 0 && (
            <div className="gpa-info">
              <p>Based on {courses.filter(c => c.grade).length} course(s)</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom-right Save button */}
      <div className="gpa-footer-actions" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 10 }}>
        <Button onClick={handleSaveAll} className="save-courses-btn" isLoading={loading} disabled={loading}>Save</Button>
      </div>
    </div>
  );
};

export default GpaCalculator;