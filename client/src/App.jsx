import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [characters, setCharacters] = useState([]);
  const [form, setForm] = useState({ name: '', realName: '', universe: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/characters')
      .then(res => res.json())
      .then(data => setCharacters(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:5000/characters/${editingId}`
      : 'http://localhost:5000/characters';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(() => {
        fetch('http://localhost:5000/characters')
          .then(res => res.json())
          .then(data => setCharacters(data));
        setForm({ name: '', realName: '', universe: '' });
        setEditingId(null);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/characters/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(updatedCharacters => {
        setCharacters(updatedCharacters);
      })
      .catch(error => console.error('Error:', error));
  };
  
  const handleEdit = (character) => {
    setForm({
      name: character.name,
      realName: character.realName,
      universe: character.universe
    });
    setEditingId(character.id);
  };

  return (
    <div className="app">
      <h1 className="app-title">Gestion des Personnages Marvel</h1>
      
      <form onSubmit={handleSubmit} className="character-form">
        <div className="form-row">
          <div className="form-group">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nom du personnage"
              required
            />
          </div>
          <div className="form-group">
            <input
              name="realName"
              value={form.realName}
              onChange={handleChange}
              placeholder="Vrai nom"
              required
            />
          </div>
          <div className="form-group">
            <input
              name="universe"
              value={form.universe}
              onChange={handleChange}
              placeholder="Univers"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn">
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn btn-cancel"
                onClick={() => {
                  setForm({ name: '', realName: '', universe: '' });
                  setEditingId(null);
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="table-container">
        <table className="characters-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Personnage</th>
              <th>Vrai Nom</th>
              <th>Univers</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {characters.map(character => (
              <tr key={character.id} className="table-row">
                <td>{character.id}</td>
                <td>{character.name}</td>
                <td>{character.realName}</td>
                <td>{character.universe}</td>
                <td className="actions">
                  <button 
                    onClick={() => handleEdit(character)}
                    className="btn-action"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(character.id)}
                    className="btn-action btn-delete"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;