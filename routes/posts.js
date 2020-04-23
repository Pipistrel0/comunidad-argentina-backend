const router = require('express').Router();
const PostService = require('../services/posts');
const postService = new PostService();

router.route('/').get(async (req, res, next) => {
  try {
    const posts = await postService.getAll();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

router.route('/:id').get(async (req, res, next) => {
  try {
    const post = await postService.getOne(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

router.route('/nuevo').post(async function (req, res, next) {
  try {
    await postService.createOne(req.body);
    res.status(200).json('New post added');
  } catch (err) {
    next(err);
  }
});

router.route('/update/:id').put(async (req, res, next) => {
  try {
   await postService.updateOne(req.params.id, req.body);
    res.status(200).json('Post updated');
  } catch (err) {
    next(err);
  }
});

router.route('/delete/:id').delete(async (req, res, next) => {
  try {
    await postService.deleteOne(req.params.id);
    res.status(200).json('Post delted');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
