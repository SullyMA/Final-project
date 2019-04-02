module.exports = function(app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
app.post('/activities', function(req, res) {
     db.collection('activities').save({
        city: req.body.city,
        departure: req.body.departure,
        arrival: req.body.arrival,
        budget: req.body.budget
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/destination')
        })
    })
// api being fetched is work in progress****

// let Url = "https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyDgBZAdYVo1gCLfgZIg15VQf3ey9N3fdtg&query=attractions+near+"+req.body.city
// fetch(Url)
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(JSON.stringify(myJson));
//   });

//api key
////////AIzaSyDgBZAdYVo1gCLfgZIg15VQf3ey9N3fdtg


  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/destination', function(req, res) {
    res.render('destination.ejs');
  });
  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
  db.collection('activities').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('profile.ejs', {
      user: req.user,
      trave: result
    })
  })
});


  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // cart routes ===============================================================


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  return next();

  res.redirect('/');
}
