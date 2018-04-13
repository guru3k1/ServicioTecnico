module.exports = function (app) {

  var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

  app.get('/', function (req, res, next) {
    res.render('pages/index', {
      user: req.user,
      url: req.url,
    });
  });

  app.get('/auth/account', ensureLoggedIn('/login'), function (req, res, next) {
    console.log(req.accessToken);
    //res.json(req.accessToken);
    //res.header('access_token', req.accessToken.id);
    res.redirect('http://localhost:4200/tasks');
  });

  app.get('/local', function (req, res, next) {
    res.render('pages/local', {
      user: req.user,
      url: req.url,
    });
  });

  app.get('/signup', function (req, res, next) {
    res.render('pages/signup', {
      user: req.user,
      url: req.url,
    });
  });

  app.get('/logout', function(req, res, next) {
    var User = app.models.Gmsuser; 

    if (!req.accessToken) return res.sendStatus(401);
    User.logout(req.accessToken.id, function(err) {
      if (err) return next(err);

      res.status(200).json({status:true});
    });
  });

  app.post('/signup', function (req, res, next) {
    var User = app.models.Gmsuser;

    var newUser = {};
    newUser.email = req.body.email.toLowerCase();
    newUser.username = req.body.username.trim();
    newUser.password = req.body.password;

    User.create(newUser, function (err, user) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      } else {
        // Passport exposes a login() function on req (also aliased as logIn())
        // that can be used to establish a login session. This function is
        // primarily used when users sign up, during which req.login() can
        // be invoked to log in the newly registered user.
        req.login(user, function (err) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          return res.redirect('/auth/account');
        });
      }
    });
  });

  app.get('/login', function (req, res, next) {
    res.render('pages/login', {
      user: req.user,
      url: req.url,
    });
  });

  app.get('/auth/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
  });

};