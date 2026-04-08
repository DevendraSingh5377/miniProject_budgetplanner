const Transaction = require('../models/Transaction');

// GET: Show Add Income Page
exports.getAddIncome = (req, res) => {
  res.render('addIncome', { 
    layout: 'layout',
    title: 'Add Income',
    user: req.session.user,
    error: null
  });
};

// POST: Handle Add Income Form
exports.postAddIncome = async (req, res) => {
  try {
    const { description, amount } = req.body;

    const income = new Transaction({
      user: req.session.user._id,
      description,
      amount,
      type: 'income'
    });

    await income.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).render('addIncome', { 
      layout: 'layout',
      title: 'Add Income',
      user: req.session.user,
      error: 'Error adding income. Please try again.'
    });
  }
};

// POST: Delete Income
exports.deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    await Transaction.findOneAndDelete({ _id: incomeId, user: req.session.user._id, type: 'income' });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting income');
  }
};
