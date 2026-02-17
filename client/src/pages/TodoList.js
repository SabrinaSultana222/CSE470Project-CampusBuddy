import { useEffect, useState } from "react";

const TodoList = () => {
  const [storageKey, setStorageKey] = useState(null);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  // 🔐 Resolve user-specific storage key
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || user?._id || "guest";
    setStorageKey(`CAMPUS_BUDDY_TODOS_${userId}`);
  }, []);

  // 📥 Load todos
  useEffect(() => {
    if (!storageKey) return;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setLoaded(true);
  }, [storageKey]);

  // 💾 Save todos
  useEffect(() => {
    if (!storageKey || !loaded) return;
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [todos, storageKey, loaded]);

  const addTodo = () => {
    if (!text.trim()) return;

    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: text.trim(),
        completed: false,
      },
    ]);
    setText("");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <section className="dashboard-content-card feature-page">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 6 }}>📝 To-Do List</h2>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Organize your daily academic tasks efficiently.
        </p>
      </div>

      {/* Add task */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <input
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task…"
        />
        <button
          className="btn-primary"
          onClick={addTodo}
          disabled={!text.trim()}
          style={{
            opacity: !text.trim() ? 0.6 : 1,
            cursor: !text.trim() ? "not-allowed" : "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          fontSize: 14,
          color: "#374151",
        }}
      >
        <span>
          Total: <b>{todos.length}</b>
        </span>
        <span>
          Completed: <b>{completedCount}</b>
        </span>
      </div>

      {/* Empty state */}
      {todos.length === 0 && (
        <div
          className="feature-empty"
          style={{
            padding: 20,
            border: "1px dashed #d1d5db",
            borderRadius: 8,
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          No tasks yet. Start by adding one 👆
        </div>
      )}

      {/* Task list */}
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="feature-card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 14,
            marginBottom: 10,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <div
            onClick={() => toggleTodo(todo.id)}
            style={{
              cursor: "pointer",
              fontSize: 15,
              textDecoration: todo.completed
                ? "line-through"
                : "none",
              color: todo.completed ? "#9ca3af" : "#111827",
            }}
          >
            {todo.completed ? "✅" : "⬜"} {todo.title}
          </div>

          <button
            className="btn-danger"
            onClick={() => deleteTodo(todo.id)}
            style={{ padding: "6px 10px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </section>
  );
};

export default TodoList;
