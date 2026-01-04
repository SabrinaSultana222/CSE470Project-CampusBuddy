import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from '../components/SearchBar';

const ClassSchedule = () => {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    filters: {},
    sortBy: ''
  });

  const [course, setCourse] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  const handleSearch = ({ searchTerm, filters, sortBy }) => {
    setSearchParams({ searchTerm, filters, sortBy });
  };

  // Auth check
  useEffect(() => {
    fetch("http://localhost:5001/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => setUser(data));
  }, [navigate]);

  // Storage Key (per user)
  const STORAGE_KEY = user
    ? `CAMPUS_BUDDY_CLASSES_${user.id || user._id}`
    : null;

  // Load classes
  useEffect(() => {
    if (!STORAGE_KEY) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setClasses(JSON.parse(saved));
    }
  }, [STORAGE_KEY]);

  // Save classes
  useEffect(() => {
    if (!STORAGE_KEY) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }, [classes, STORAGE_KEY]);

  // Filter classes based on search and filters
  useEffect(() => {
    let result = [...classes];
    
    // Apply search filter
    if (searchParams.searchTerm) {
      const search = searchParams.searchTerm.toLowerCase();
      result = result.filter(c => 
        c.course.toLowerCase().includes(search)
      );
    }
    
    // Apply day filter
    if (searchParams.filters.day) {
      result = result.filter(c => c.day === searchParams.filters.day);
    }
    
    // Apply time filter
    if (searchParams.filters.time) {
      result = result.filter(c => c.time === searchParams.filters.time);
    }
    
    setFilteredClasses(result);
  }, [classes, searchParams]);

  const addClass = () => {
    if (!course || !day || !time) return;

    setClasses((prev) => [
      ...prev,
      {
        id: Date.now(),
        course,
        day,
        time,
      },
    ]);

    setCourse("");
    setDay("");
    setTime("");
  };

  const deleteClass = (id) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  if (!user) return <p style={{ padding: 24 }}>Loading...</p>;

  // Search filters configuration
  const searchFilters = [
    {
      name: 'day',
      label: 'Day',
      type: 'select',
      options: [
        { value: '', label: 'All Days' },
        { value: 'Sunday', label: 'Sunday' },
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' }
      ]
    },
    {
      name: 'time',
      label: 'Time',
      type: 'select',
      options: [
        { value: '', label: 'All Times' },
        { value: '08:00', label: '8:00 AM' },
        { value: '09:00', label: '9:00 AM' },
        { value: '10:00', label: '10:00 AM' },
        { value: '11:00', label: '11:00 AM' },
        { value: '12:00', label: '12:00 PM' },
        { value: '13:00', label: '1:00 PM' },
        { value: '14:00', label: '2:00 PM' },
        { value: '15:00', label: '3:00 PM' },
        { value: '16:00', label: '4:00 PM' },
        { value: '17:00', label: '5:00 PM' }
      ]
    }
  ];

  return (
    <section className="dashboard-content-card feature-page">
      <div className="feature-header">
        <h2 className="feature-title">Class Schedule</h2>
      </div>

      {/* Search and Filter */}
      <div style={{ marginBottom: '20px' }}>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by course name..."
          filters={searchFilters}
          showSort={false}
        />
      </div>

      {/* Add class */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          className="form-control"
          placeholder="Course name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <select
          className="form-select"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          <option value="">Select day</option>
          <option>Sunday</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
        </select>

        <input
          className="form-control"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button className="btn-primary" onClick={addClass}>
          Add
        </button>
      </div>

      {/* Empty state */}
      {classes.length === 0 ? (
        <div className="feature-empty">
          No classes added yet.
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="feature-empty">
          🔍 No classes match your search criteria.
        </div>
      ) : null}

      {/* Class cards */}
      <section>
        {filteredClasses.map((c) => (
          <div key={c.id} className="feature-card">
            <div>
              <h4 style={{ margin: 0 }}>{c.course}</h4>
              <p style={{ margin: "4px 0", color: "#6b7280" }}>
                {c.day} · {c.time}
              </p>
            </div>

            <button
              className="btn-danger"
              onClick={() => deleteClass(c.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </section>
    </section>
  );
};

export default ClassSchedule;
