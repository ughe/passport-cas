# passport-pucas

Forked from Indiana University CAS authentication strategies for Passport and adapted for Princeton's CAS system.

## Install

```
yarn add https://github.com/ughe/passport-pucas
```

#### Configure Strategy

```
var passport = require('passport');
var cas = require('passport-pucas');

var cas_strategy = new cas.Strategy(
    {casURL: "https://fed.princeton.edu/cas"},
    function(username, done) {
        console.log('TODO - find '+username+' in the db or such..');
        return done(null, {username: username, email: 'user@email.com'});
    }
);
passport.use(cas_strategy);
```

#### Authenticate Requests

```
    //access this to login via IU CAS
    app.use('/protected', passport.authenticate('pucas', { failureRedirect: '/cas/fail' }), function(req, res, next) {
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

#### Logout Strategy

```
    var logout_url = cas_strategy.logout(req, res);
    res.redirect(logout_url);
```

## Testing

Clone this repo then cd and run:

```
yarn start
```

Go to: [http://localhost:12345](http://localhost:12345)


## License

[The MIT License](http://opensource.org/licenses/MIT)
