// backend/app.js
const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Sample route
app.get('/', (req, res) => {
  res.send('Secure E-Commerce API is running');
});

// Protected route example
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.id}` });
});

// JWT middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
