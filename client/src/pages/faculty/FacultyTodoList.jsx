import React, { useState, useEffect } from "react";

const FacultyTodoList = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("facultyTodos")) || [];
  });

  useEffect(() => {
    localStorage.setItem("facultyTodos", JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    if (!task.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), title: task, completed: false },
    ]);
    setTask("");
  };

  const toggleTask = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <section className="dashboard-content-card" style={{ maxWidth: 900 }}>
      <h2>📝 Faculty To-Do List</h2>
      <p style={{ color: "#6b7280", marginBottom: 20 }}>
        Organize academic and administrative responsibilities.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          className="form-control"
          placeholder="Add task (e.g. Prepare lecture slides)"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button
          onClick={addTask}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + Add
        </button>
      </div>

      <div style={{ marginBottom: 14, fontSize: 14 }}>
        Total tasks: <b>{todos.length}</b> | Completed:{" "}
        <b>{completedCount}</b>
      </div>

      {todos.length === 0 ? (
        <div className="empty-widgets-box">No tasks added yet.</div>
      ) : (
        todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              marginBottom: 8,
              background: todo.completed ? "#ecfeff" : "#ffffff",
            }}
          >
            <span
              onClick={() => toggleTask(todo.id)}
              style={{
                cursor: "pointer",
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.completed ? "✅" : "⬜"} {todo.title}
            </span>

            <button
              onClick={() => deleteTask(todo.id)}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </section>
  );
};

export default FacultyTodoList;
