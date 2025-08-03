const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let userData = {}; // For demo, store in memory

app.post('/api/save', (req, res) => {
  userData = req.body;
  console.log('Received data:', userData);
  res.json({ message: 'Data saved successfully' });
});

app.get('/api/portfolio', (req, res) => {
  res.json(userData);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
