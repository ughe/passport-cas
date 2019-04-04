# passport-cas

Forked from Indiana University CAS authentication strategies for Passport and adapted for any CAS system.

## Install

```
yarn
```

#### Configure Strategy

```
const options = {
    casURL: "https://cas.iu.edu/cas",
//  serviceURL: '',
}

const verify = function(username, done) {
    console.log('TODO - find '+username+' in the db or such..');
    return done(null, {username: username, email: 'user@email.com'});
}

var cas_strategy = new cas.Strategy(options, verify);
passport.use(cas_strategy);
```

#### Authenticate Requests

```
    //access this to login via IU CAS
    app.use('/protected', passport.authenticate('cas', { failureRedirect: '/cas/fail' }), function(req, res, next) {
        //user object can be accessed via req.user
        //render your protected content
    });
```

Instead of authenticating everytime you access /protected, you can do something like

```
    function ensureAuth(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
    app.use('/protected', ensureAuth, function(req, res) {
        res.json({user: req.user});
    });
```

And make /login to the actual authentication. This requires you to use session so that your user object will be persisted. Please see 
/test/app.js for more details.

## License

[The MIT License](http://opensource.org/licenses/MIT)
