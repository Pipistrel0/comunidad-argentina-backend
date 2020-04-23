const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserService = require('../services/users');
const userService = new UserService();
const ApiKeyService = require('../services/apiKey');
const apiKeyService = new ApiKeyService();
const {config} = require('../config/index');


// BASIC STRATEGY
require('../utils/auth/strategies/basic');

router.route('/').get(async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.route('/:id').get(async (req, res, next) => {
  try {
    const user = await userService.getOne(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.route('/sing-in').post(async (req, res, next) => {
  const { apiKeyToken } = req.body;
  if (!apiKeyToken) {
    next(new Error('unauthorized'));
  }
  passport.authenticate('basic', async (err, user) => {
    try {
      if (err || !user) {
        next(err);
      }
      req.login(user, {session: false}, async (err) =>{
        if(err){
          next(err)
        }
        const apiKey = await apiKeyService.getApiKey({token: apiKeyToken});
        if(!apiKey){
          next(new Error('unauthorized'));
        }
        const {_id: id, name, email} = user;
        const payload = {
          sub: id,
          email,
          scopes: apiKey.scopes
        }
        // console.log(config);
        const token = jwt.sign(payload, config.authJwtSecret,{expiresIn: '15m'});
        return res.status(200).json({token, user: {id, name, email}});
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

router.route('/sing-up').post(async function (req, res, next) {
  try {
    await userService.createOne(req.body);
    res.status(200).json('User added');
  } catch (err) {
    next(err);
  }
});

router.route('/update/:id').put(async (req, res, next) => {
  try {
    await userService.updateOne(req.params.id, req.body);
    res.status(200).json('User Updated');
  } catch (err) {
    next(err);
  }
});

router.route('/delete/:id').delete(async (req, res, next) => {
  try {
    await userService.deleteOne(req.params.id);
    res.status(200).json('User deleted');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
