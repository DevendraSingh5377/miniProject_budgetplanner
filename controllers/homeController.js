// GET Home Page
exports.getHome = (req, res) => {
  res.render('home', { 
    layout: 'layout', 
    title: 'Home Page' 
  });
};
