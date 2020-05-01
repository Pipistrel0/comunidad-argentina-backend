const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserService = require('../services/users');
const userService = new UserService();
const ApiKeyService = require('../services/apiKey');
const apiKeyService = new ApiKeyService();
const boom = require('@hapi/boom');
const { config } = require('../config/index');

const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

// BASIC STRATEGY
require('../utils/auth/strategies/basic');
// JWT STRATEGY
require('../utils/auth/strategies/jwt');
// GOOGLE OAUTH STRATEGY
require('../utils/auth/strategies/google');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['users:getall']),
  async (req, res, next) => {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['users:get']),
  async (req, res, next) => {
    try {
      const user = await userService.getOne(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/auth/google-oauth',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

router.get(
  '/auth/google-oauth/callback',
  passport.authenticate('google', { session: false }),
  async (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
    }
    try {
      const apiKey = await apiKeyService.getApiKey({token: req.token});
      if (!apiKey) {
        next(boom.unauthorized());
      }

      const { _id: id, firstName, lastName, email } = req.user;

      const payload = {
        sub: id,
        firstName,
        lastName,
        email,
        scopes: apiKey.scopes,
      };
      const token = jwt.sign(payload, config.authJwtSecret, {
        expiresIn: '15m',
      });

      res.cookie('token', token, {
        httpOnly: !config.dev,
        secure: !config.dev,
      });

      return res.status(200).json({
        message: 'user created',
        data: req.user,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/sing-in', async (req, res, next) => {
  const { apiKeyToken } = req.body;
  if (!apiKeyToken) {
    next(boom.unauthorized());
  }
  passport.authenticate('basic', async (err, user) => {
    try {
      if (err || !user) {
        next(err);
      }
      req.login(user, { session: false }, async (err) => {
        if (err) {
          next(err);
        }
        const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });
        if (!apiKey) {
          next(boom.unauthorized());
        }
        const { _id: id, name, email } = user;
        const payload = {
          sub: id,
          email,
          scopes: apiKey.scopes,
        };
        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '15m',
        });
        return res.status(200).json({ token, user: { id, name, email } });
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

router.post('/sing-up', async function (req, res, next) {
  try {
    const { email } = req.body;
    const userExist = await userService.getOneByEmail(email);
    if (userExist) {
      return res.json({
        message: 'user already exists',
      });
    }
    const userCreatedId = await userService.createOne(req.body);
    res.status(200).json({
      message: 'user created',
      data: userCreatedId,
    });
  } catch (err) {
    next(err);
  }
});

router.put(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['users:update']),
  async (req, res, next) => {
    try {
      await userService.updateOne(req.params.id, req.body);
      res.status(200).json('User Updated');
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['users:delete']),
  async (req, res, next) => {
    try {
      await userService.deleteOne(req.params.id);
      res.status(200).json('User deleted');
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
