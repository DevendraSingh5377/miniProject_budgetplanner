const User = require('../models/User'); // adjust path as needed

// GET Signup Page
exports.getSignup = (req, res) => {
  res.render("signup", { 
    layout: "layout", 
    title: "Signup Page", 
    error: null, 
    user: req.session.user || null 
  });
};

// POST Signup
exports.postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('signup', { 
        layout: 'layout',
        title: 'Signup Page', 
        error: 'Email already registered. Please login instead.',
        user: null
      });
    }

    const user = new User({ name, email, password });
    await user.save();

    req.session.user = user; // auto-login after signup
    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.status(500).render('signup', { 
      layout: 'layout',
      title: 'Signup Page', 
      error: 'Something went wrong. Please try again.',
      user: null
    });
  }
};

// GET Login Page
exports.getLogin = (req, res) => {
  res.render("login", { 
    layout: "layout", 
    title: "Login Page", 
    error: null, 
    user: req.session.user || null 
  });
};

// POST Login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).render('login', { 
        layout: 'layout',
        title: 'Login Page', 
        error: 'Email is not registered',
        user: null
      });
    }

    const isMatch = await userExist.comparePassword(password);
    if (!isMatch) {
      return res.status(400).render('login', { 
        layout: 'layout',
        title: 'Login Page', 
        error: 'Invalid password',
        user: null
      });
    }

    req.session.user = userExist;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).render('login', { 
      layout: 'layout',
      title: 'Login Page', 
      error: 'Server error, please try again.',
      user: null
    });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/login');
  });
};
