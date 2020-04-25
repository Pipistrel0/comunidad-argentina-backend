const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const UsersService = require('../../../services/users');
const boom = require('@hapi/boom');
const { config } = require('../../../config/index');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async function (tokenPayload, cb) {
      const usersService = new UsersService();
      try {
        const user = await usersService.getOneByEmail(tokenPayload.email);

        if (!user) {
          return cb(boom.unauthorized());
        }

        delete user.password;
        cb(null, { ...user, scopes: tokenPayload.scopes });
      } catch (err) {
        cb(err);
      }
    }
  )
);

