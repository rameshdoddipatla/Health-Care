require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/healthhub';

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// ---------- Signup ----------
app.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        message: 'You already have an account. Redirecting you to login...',
        redirect: '/login.html',
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, phone, password: hashed });

    res.status(201).json({ message: 'Account created.', redirect: '/welcomelogin.html', name });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Error saving data.' });
  }
});

// ---------- Login ----------
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // No account with this email -> send them to register
    if (!user) {
      return res.status(404).json({
        message: 'No account found for this email. Redirecting you to sign up...',
        redirect: '/signup.html',
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    res.json({ message: 'Login successful.', redirect: '/welcomelogin.html', name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ---------- Contact form ----------
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    await Contact.create({ name, email, message });
    res.status(201).json({ message: 'Message sent.', redirect: '/contactsuccess.html' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ message: 'Error saving message.' });
  }
});

// ---------- Connect to MongoDB, then start the server ----------
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
