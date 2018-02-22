module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('pages/index');
    });


    // app.get('/login', function(req, res) {
    //     res.render('pages/login', { message: req.flash('loginMessage') });
    // });
    //
    // // process the login form
    // app.post('/login', passport.authenticate('local-login', {
    //         successRedirect : '/profile', // redirect to the secure profile section
    //         failureRedirect : '/login', // redirect back to the signup page if there is an error
    //         failureFlash : true // allow flash messages
    //     }),
    //     function(req, res) {
    //         console.log("hello");
    //
    //         if (req.body.remember) {
    //             req.session.cookie.maxAge = 1000 * 60 * 3;
    //         } else {
    //             req.session.cookie.expires = false;
    //         }
    //         res.redirect('/');
    //     });

    app.get('/logout', function(req, res) {
        res.render('pages/login', { message: req.flash('signupMessage') });
    });


    app.post('/logout', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // app.get('/profile', isLoggedIn, function(req, res) {
    //     res.render('pages/profile', {
    //         user : req.user // get the user out of session and pass to template
    //     });
    // });
    // app.get('/logout', function(req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });
};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}