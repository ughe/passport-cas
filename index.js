var url = require('url'),
    util = require('util'),
    https = require('https'),
    passport = require('passport')

function Strategy(options, verify) {
    if (!verify || (typeof verify != 'function')) {
        throw new Error('PU CAS authentication strategy requires a verify function');
    }
    this.casURL = options.casURL;
    this.serviceURL = options.serviceURL; //optional - if not set, authenticate will use current URL
    passport.Strategy.call(this);
    this.name = 'pucas';
    this._verify = verify;
}
util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function (req, options) {
    if(!this.serviceURL) {
        this.serviceURL = req.protocol + '://' + req.get('host') + req.originalUrl; //use the current url
    }

    var self = this;

    function verified(err, user, info) {
        if (err) { return self.error(err); }
        if (!user) { return self.fail(info); }
        //console.log("calling verified success");
        self.success(user, info);
    };

    //redirect to cas for the first time
    if (!req.query.ticket) {
        var redirectURL = url.parse(this.casURL+'/login');
        redirectURL.query = {
            service: this.serviceURL,
        };
        return this.redirect(url.format(redirectURL));
    }

    //got ticket! validate it.
    var validateURL = url.parse(this.casURL+'/validate');
    validateURL.query = {
        ticket: req.query.ticket,
        service: this.serviceURL.split('?')[0],
    }
    https.get(url.format(validateURL), function(res) {
        var body = '';
        res.on('data', function(d) {
            body += d;
        });
        res.on('end', function() {
            var lines = body.split('\n');
            if(lines[0].indexOf('yes') !== 0) {
                verified(new Error('Authentication failed'));
            } else {
                var username = lines[1].trim();
                if(self._passReqToCallback) { 
                    self._verify(req, username, verified);
                } else {
                    self._verify(username, verified);
                }
            }
        });
    }).on('error', function(e) {;
        self.error(new Error(e));
    });
};

Strategy.prototype.logout = function(req, res) {
    var redirectURL = url.parse(this.casURL+'/logout');
    redirectURL.query = {
        service: req.protocol + '://' + req.get('host'),
    };
    req.logout();
    return url.format(redirectURL);
}

exports.Strategy = Strategy;
