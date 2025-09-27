// models/User.js
const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  transactions: [
    {
      amount: Number,
      type: String,
      createdAt: { type: Date, default: Date.now },
      note: String
    }
  ]
});

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: String,
  email: String,
  photo: String,
  coins: { type: Number, default: 0 },
  wallet: { type: WalletSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
