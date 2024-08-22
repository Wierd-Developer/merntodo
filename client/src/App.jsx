import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState({ id: null, title: '' });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(API_URL);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(API_URL, { title: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditTodo = (id, title) => {
    setEditingTodo({ id, title });
  };

  const handleSaveTodo = async () => {
    if (!editingTodo.title.trim()) return;

    try {
      const response = await axios.put(`${API_URL}/${editingTodo.id}`, { title: editingTodo.title });
      setTodos(todos.map(todo => todo._id === editingTodo.id ? response.data : todo));
      setEditingTodo({ id: null, title: '' });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="App">
        <h1>Todo List</h1>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New todo..."
        />
        <button className="addtodobtn" onClick={handleAddTodo}>Add Todo</button>
        <div className="show-list">
          <ul>
            {todos.map(todo => (
              <li key={todo._id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {editingTodo.id === todo._id ? (
                  <input
                  style={{border:"2px solid red"}}
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  />
                ) : (
                  todo.title
                )}
                {editingTodo.id === todo._id ? (
                  <button className='saveBtn' onClick={handleSaveTodo}>Save</button>
                ) : (
                  <button className="editBtn" onClick={() => handleEditTodo(todo._id, todo.title)}>Edit</button>
                )}
                <span
                  style={{ marginTop: "6px", cursor: "pointer" }}
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  <svg height="22px" width="25px" fill="#e35959" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488.936 488.936" stroke="#e35959">
                    <g>
                      <path d="M381.16,111.948H107.376c-6.468,0-12.667,2.819-17.171,7.457c-4.504,4.649-6.934,11.014-6.738,17.477l9.323,307.69 
                      c0.39,12.92,10.972,23.312,23.903,23.312h20.136v-21.012c0-24.121,19.368-44.049,43.488-44.049h127.896 
                      c24.131,0,43.893,19.928,43.893,44.049v21.012h19.73c12.933,0,23.52-10.346,23.913-23.268l9.314-307.7 
                      c0.195-6.462-2.234-12.863-6.738-17.513C393.821,114.767,387.634,111.948,381.16,111.948z"></path>
                      <path d="M309.166,435.355H181.271c-6.163,0-11.915,4.383-11.915,11.516v30.969c0,6.672,5.342,11.096,11.915,11.096h127.895 
                      c6.323,0,11.366-4.773,11.366-11.096v-30.969C320.532,440.561,315.489,435.355,309.166,435.355z"></path>
                      <path d="M427.696,27.106C427.696,12.138,415.563,0,400.591,0H88.344C73.372,0,61.239,12.138,61.239,27.106v30.946 
                      c0,14.973,12.133,27.106,27.105,27.106H400.59c14.973,0,27.105-12.133,27.105-27.106L427.696,27.106L427.696,27.106z"></path>
                    </g>
                  </svg>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
