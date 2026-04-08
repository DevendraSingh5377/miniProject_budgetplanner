const Transaction = require('../models/Transaction');

// GET: Show Add Expense Page
exports.getAddExpense = (req, res) => {
  res.render('addExpense', { 
    layout: 'layout',
    title: 'Add Expense',
    user: req.session.user,
    error: req.flash('error')
  });
};

// POST: Handle Add Expense Form
exports.postAddExpense = async (req, res) => {
  try {
    const { description, amount } = req.body;
    const expenseAmount = Number(amount);

    // Calculate remaining budget before adding expense
    const transactions = await Transaction.find({ user: req.session.user._id });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const remainingBudget = totalIncome - totalExpense;

    // ✅ Block if remaining budget is zero OR expense exceeds remaining budget
    if (remainingBudget <= 0 || expenseAmount > remainingBudget) {
      req.flash('error', `Cannot add expense of ${expenseAmount}. Remaining budget is only ${remainingBudget}.`);
      return res.redirect('/expenses/add');
    }

    const expense = new Transaction({
      user: req.session.user._id,
      description,
      amount: expenseAmount,
      type: 'expense'
    });

    await expense.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error adding expense. Please try again.');
    res.redirect('/expenses/add');
  }
};

// POST: Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    await Transaction.findOneAndDelete({ _id: expenseId, user: req.session.user._id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting expense');
  }
};
