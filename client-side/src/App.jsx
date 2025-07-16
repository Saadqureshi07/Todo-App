import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const fetchTodos = () => {
    axios.get(API).then((res) => setTodos(res.data));
  };

  const addTodo = () => {
    if (title === "") return;
    axios.post(API, { title }).then(() => {
      setTitle("");
      fetchTodos();
    });
  };

  const deleteTodo = (id) => {
    axios.delete(`${API}/${id}`).then(fetchTodos);
  };

  const toggleTodo = (todo) => {
    axios.put(`${API}/${todo.id}`, { completed: !todo.completed }).then(fetchTodos);
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEdit = () => {
    if (editingTitle === "") return;
    axios.put(`${API}/${editingId}`, { title: editingTitle }).then(() => {
      setEditingId(null);
      setEditingTitle("");
      fetchTodos();
    });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-4">ToDo App ✅</h1>

        <div className="flex gap-2 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add new task"
            className="flex-1 border rounded px-3 py-2"
          />
          <button onClick={addTodo} className="bg-blue-600 text-white px-4 rounded">
            Add
          </button>
        </div>

        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2 mb-2"
          >
            {editingId === todo.id ? (
              <>
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1 border px-2 py-1 rounded mr-2"
                />
                <button onClick={saveEdit} className="text-green-600 font-semibold">
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleTodo(todo)}
                  className={`flex-1 cursor-pointer ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.title}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(todo)} className="text-yellow-600">✏️</button>
                  <button onClick={() => deleteTodo(todo.id)} className="text-red-600">❌</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}