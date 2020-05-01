const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');
const {config} = require('../../../config/index');
const UsersServices = require('../../../services/users');
const usersServices = new UsersServices();

passport.use(new GoogleStrategy({
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: "http://localhost:3000/users/auth/google-oauth/callback",
  passReqToCallback: true
},
async function(request, accessToken, refreshToken, profile, done) {
  try {
    const userOauth = await usersServices.findOrCreateOne(profile);
    request.token = config.publicApiKeys; 
    return done(null, userOauth);
  } catch (err) {
    return done(err, false);
  }
}
));