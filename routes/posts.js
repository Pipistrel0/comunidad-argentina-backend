const router = require('express').Router();
const passport = require('passport');
const PostService = require('../services/posts');
const postService = new PostService();

const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

// JWT STRATEGY
require('../utils/auth/strategies/jwt');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['posts:getall']),
  async (req, res, next) => {
    try {
      const posts = await postService.getAll();
      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['posts:get']),
  async (req, res, next) => {
    try {
      const post = await postService.getOne(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/nuevo',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['posts:create']),
  async function (req, res, next) {
    try {
      await postService.createOne(req.body);
      res.status(200).json('New post added');
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['posts:update']),
  async (req, res, next) => {
    try {
      await postService.updateOne(req.params.id, req.body);
      res.status(200).json('Post updated');
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['posts:delete']),
  async (req, res, next) => {
    try {
      await postService.deleteOne(req.params.id);
      res.status(200).json('Post delted');
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
