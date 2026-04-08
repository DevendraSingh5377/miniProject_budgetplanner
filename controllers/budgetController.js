const Budget = require('../models/Budget');

// POST: Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;
    const budget = new Budget({ 
      user: req.session.user._id, 
      category, 
      amount 
    });
    await budget.save();
    res.redirect('/budgets');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while creating budget');
  }
};

// GET: List all budgets for logged-in user
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.session.user._id });
    res.render('budgets', { budgets });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while fetching budgets');
  }
};
