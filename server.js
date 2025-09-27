// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('./models/User');

const app = express();
app.use(express.json());

const MONGO = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('Mongo connected'))
  .catch(err=>console.error('Mongo error', err));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // profile contains google info
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email,
        photo: profile.photos && profile.photos[0] && profile.photos[0].value,
        coins: 100, // initial coins example
        wallet: { balance: 0, transactions: [] },
      });
      await user.save();
    } else {
      // update any changed fields
      user.displayName = profile.displayName;
      user.email = email;
      user.photo = profile.photos && profile.photos[0] && profile.photos[0].value;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

app.use(passport.initialize());

// start Google OAuth flow
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);

// callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/?auth=failure` }),
  (req, res) => {
    // user is in req.user
    const payload = { id: req.user._id, email: req.user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    // For demo: redirect to client with token in query (change to cookie for production)
    res.redirect(`${CLIENT_URL}/auth/success?token=${token}`);
  }
);

// API to get current user (protected)
app.get('/api/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// Serve client build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'client','build','index.html'));
  });
}

app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
