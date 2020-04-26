const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');
const {config} = require('../../../config/index');
// const UsersServices = require('../../../services/users');
// const usersServices = new UsersServices();

passport.use(new GoogleStrategy({
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: "http://localhost:3000/users/auth/google-oauth/callback",
  passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
  // usersServices.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
  console.log(profile);
}
));