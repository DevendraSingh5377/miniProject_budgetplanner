const Transaction = require('../models/Transaction');

// POST: Add Transaction (income or expense)
exports.addTransaction = async (req, res) => {
  try {
    // 👇 CRITICAL FIX: 'category' is now being extracted from the form request
    const { description, amount, type, category } = req.body;
    const transactionAmount = Number(amount);

    // Calculate remaining budget
    const transactions = await Transaction.find({ user: req.session.user._id });
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const remainingBudget = totalIncome - totalExpense;

    // Validation: block if expense exceeds remaining budget
    if (type === 'expense' && transactionAmount > remainingBudget) {
      req.flash('error', `Cannot add expense of ₹${transactionAmount}. Remaining budget is only ₹${remainingBudget}.`);
      return res.redirect('/dashboard');
    }

    // 👇 CRITICAL FIX: 'category' is passed into the new database entry
    const transaction = new Transaction({
      user: req.session.user._id,
      description,
      amount: transactionAmount,
      type,
      category: category || 'Uncategorized' // Safe fallback
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

// POST: Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    await Transaction.findOneAndDelete({ _id: transactionId, user: req.session.user._id });
    req.flash('success', 'Transaction deleted successfully.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting transaction.');
    res.redirect('/dashboard');
  }
};