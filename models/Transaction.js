const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'] 
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Salary', 
      'Food & Dining', 
      'Utilities', 
      'Shopping', 
      'Health', 
      'Education', 
      'Transport', 
      'Entertainment',
      'Uncategorized'
    ],
    default: 'Uncategorized'
  },
  // 👇 THE CRITICAL FIX: Telling Mongoose that 'date' is a valid field!
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Transaction', transactionSchema);