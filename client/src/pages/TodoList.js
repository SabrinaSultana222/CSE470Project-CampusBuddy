import { useEffect, useState } from "react";

const TodoList = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);


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
    <div className="feature-page" style={{ maxWidth: 700 }}>
      <h2>To-Do List</h2>

      {/* Add task */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task..."
          style={{ flex: 1 }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Summary */}
      <p>
        Total tasks: <b>{todos.length}</b> | Completed:{" "}
        <b>{completedCount}</b>
      </p>

      {/* Task list */}
      {todos.length === 0 && <p>No tasks added yet.</p>}

      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            marginBottom: 8,
            backgroundColor: todo.completed ? "#ecfeff" : "#ffffff",
          }}
        >
          <span
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
          </span>

          <button
            onClick={() => deleteTodo(todo.id)}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
