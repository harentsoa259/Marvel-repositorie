const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let characters = [
  { id: 1, name: 'Spider-Man', realName: 'Peter Parker', universe: 'Earth-616' },
  { id: 2, name: 'Iron Man', realName: 'Tony Stark', universe: 'Earth-616' },
  { id: 3, name: 'Captain America', realName: 'Steve Rogers', universe: 'Earth-616' },
  { id: 4, name: 'Black Widow', realName: 'Natasha Romanoff', universe: 'Earth-616' },
  { id: 5, name: 'Black Panther', realName: 'T Challa', universe: 'Earth-616' },
  { id: 6, name: 'Doctor Strange', realName: 'Stephen Strange', universe: 'Earth-616' },
  { id: 7, name: 'Scarlet Witch', realName: 'Wanda Maximoff', universe: 'Earth-616' },
  { id: 8, name: 'Hulk', realName: 'Bruce Banner', universe: 'Earth-616' }
];

function getNextId() {
  if (characters.length === 0) return 1;
  return Math.max(...characters.map(c => c.id)) + 1;
}

app.get('/characters', (req, res) => {
  res.json(characters);
});

app.post('/characters', (req, res) => {
  const newCharacter = { id: getNextId(), ...req.body };
  characters.push(newCharacter);
  res.json(newCharacter);
});

app.put('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = characters.findIndex(c => c.id === id);
  if (index !== -1) {
    characters[index] = { ...characters[index], ...req.body };
    res.json(characters[index]);
  } else {
    res.status(404).send('Not found');
  }
});

app.delete('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  characters = characters.filter(c => c.id !== id);
  characters = characters.map((char, index) => ({
    ...char,
    id: index + 1
  }));
  res.json(characters);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));