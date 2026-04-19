const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// GET Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.session.user._id });
    const transactions = await Transaction.find({ user: req.session.user._id });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const remainingBudget = totalIncome - totalExpense;

    res.render('dashboard', { 
      layout: 'layout',
      title: 'Dashboard',
      user: req.session.user,
      budgets,
      transactions,
      totalIncome,
      totalExpense,
      remainingBudget,
      error: req.flash('error') || null,
      success: req.flash('success') || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('dashboard', { 
      layout: 'layout',
      title: 'Dashboard',
      user: req.session.user,
      budgets: [],
      transactions: [],
      totalIncome: 0,
      totalExpense: 0,
      remainingBudget: 0,
      error: 'Server error while loading dashboard',
      success: null
    });
  }
};

// GET Breakdown Page
exports.getBreakdown = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.session.user._id });
    
    res.render('breakdown', { 
      layout: 'layout',
      title: 'Financial Breakdown',
      user: req.session.user,
      transactions,
      error: req.flash('error') || null,
      success: req.flash('success') || null
    });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};