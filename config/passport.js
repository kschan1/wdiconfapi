// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// expose this function to our app using module.exports
module.exports = function(passport,pg,config) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        
        var sql_query = "SELECT * FROM Users WHERE id='" + id + "'";
        var client = new pg.Client(config);
        client.connect(function (err) {
            client.query(sql_query, function (err, result) {
                done(null, result.rows[0]);
                client.end();
            });
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists

        // SQL query string
        var sql_query = "SELECT * FROM Users WHERE email='" + email + "'";

        // Retrieve data from Postgres and sent response to client
        var client = new pg.Client(config);
        client.connect(function (err) {
            client.query(sql_query, function (err, result) {
                // if there are any errors, return the error before anything else
                if (err)
                    done(err, false);
                // if no user is found, return the message
                if (result.rows.length === 0) {
                    done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                else {
                    // if the user is found but the password is wrong
                    if (result.rows[0].password_digest !== password) {
                        done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    }
                    else {
                        // all is well, return successful user
                        done(null, result.rows[0]);
                    }
                }
              client.end();
            });
        });

    }));

    // Passport stuff
    var JwtStrategy = require('passport-jwt').Strategy;
    var ExtractJwt = require('passport-jwt').ExtractJwt;

    var  opts = {};
    opts.secretOrKey = 'secret';
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
      
        console.log("HIHIH");

      // SQL query string
      var query = "SELECT * FROM Users WHERE id='" + jwt_payload.id + "'";

      // Retrieve data from Postgres and sent response to client
      var client = new pg.Client(config);
      client.connect(function (err) {
        client.query(query, function (err, result) {
          if(!err) {
            if (result.rows.length > 0) {
              return done(null, result.rows[0]);
            }
            else {
              return done(null, false);
            }
          }
          client.end();
        });
      });

    }));

};