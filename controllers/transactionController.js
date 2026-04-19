const Transaction = require('../models/Transaction');

// Helper: Convert YYYY-MM-DD → LOCAL DATE (no timezone shift)
function parseLocalDate(dateString) {
  if (!dateString) return new Date();

  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // LOCAL date (IMPORTANT)
}

// POST: Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;
    const transactionAmount = Number(amount);

    const transactions = await Transaction.find({ user: req.session.user._id });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const remainingBudget = totalIncome - totalExpense;

    if (type === 'expense' && transactionAmount > remainingBudget) {
      req.flash('error', `Cannot add expense of ₹${transactionAmount}. Remaining budget is only ₹${remainingBudget}.`);
      return res.redirect('/dashboard');
    }

    // ✅ FIXED DATE HANDLING
    const transactionDate = parseLocalDate(date);

    const transaction = new Transaction({
      user: req.session.user._id,
      description,
      amount: transactionAmount,
      type,
      category: category || 'Uncategorized',
      date: transactionDate
    });

    await transaction.save();

    req.flash('success', `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully.`);
    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Error adding transaction. Please try again.');
    res.redirect('/dashboard');
  }
};

// DELETE
exports.deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;

    await Transaction.findOneAndDelete({
      _id: transactionId,
      user: req.session.user._id
    });

    req.flash('success', 'Transaction deleted successfully.');
    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting transaction.');
    res.redirect('/dashboard');
  }
};