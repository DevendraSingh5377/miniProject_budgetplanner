// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');

const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const transactionRoutes = require('./routes/transactionRoutes');


const homeRoutes = require('./routes/homeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');



const app = express();

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts);


// Middleware


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(flash());




// Connect to local MongoDB directly
mongoose.connect("mongodb://127.0.0.1:27017/budgetplanner2")
  .then(() => console.log('✅ Local MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/', homeRoutes);

app.use('/', authRoutes);

app.use('/', budgetRoutes);

app.use('/', dashboardRoutes);

app.use('/', transactionRoutes);

app.use('/', expenseRoutes);

app.use('/', incomeRoutes);

// Start server
app.listen(3000, () => 
  console.log(`🚀 Server running on port : 3000`)
);
