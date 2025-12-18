import { useEffect, useState } from "react";

const TodoList = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!text.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        title: text,
        completed: false,
      },
    ]);

    setText("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <section className="dashboard-content-card feature-page">
      {/* Header */}
      <div className="feature-header">
        <h2 className="feature-title">To-Do List</h2>
      </div>

      {/* Add task */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task..."
        />
        <button
          className="btn-primary"
          style={{ width: "auto" }}
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      {/* Summary */}
      <p style={{ marginBottom: 16, color: "#374151" }}>
        Total tasks: <b>{todos.length}</b> | Completed:{" "}
        <b>{completedCount}</b>
      </p>

      {/* Empty state */}
      {todos.length === 0 && (
        <div className="feature-empty">
          No tasks added yet.
        </div>
      )}

      {/* Task list */}
      {todos.map((todo) => (
        <div key={todo.id} className="feature-card">
          <div
            onClick={() => toggleTodo(todo.id)}
            style={{
              cursor: "pointer",
              textDecoration: todo.completed
                ? "line-through"
                : "none",
              color: todo.completed ? "#6b7280" : "#111827",
            }}
          >
            {todo.completed ? "✅" : "⬜"} {todo.title}
          </div>

          <button
            className="btn-danger"
            style={{ marginTop: 8 }}
            onClick={() => deleteTodo(todo.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </section>
  );
};

export default TodoList;
