const router = require('express').Router();
const Post = require('../models/posts');

router.route('/').get(async (req, res, next) => {
  const posts = await Post.find();
  try {
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

router.route('/nuevo').post(async function (req, res, next) {
  try {
    const {
      tags,
      title,
      contacts,
      state,
      summary,
      content,
      ipAddress,
    } = req.body;
    const newPost = new Post({
      tags,
      title,
      contacts,
      state,
      summary,
      content,
      ipAddress,
    });
    await newPost.save();
    res.status(200).json('New post added');
  } catch (err) {
    next(err);
  }
});

router.route('/:id').get(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

router.route('/update/:id').put(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    post.tags = req.body.tags;
    post.title = req.body.title;
    post.contacts = req.body.contacts;
    post.state = req.body.state;
    post.summary = req.body.summary;
    post.content = req.body.content;
    post.ipAddress = req.body.ipAddress;

    await post.save();
    res.status(200).json('Post updated');
  } catch (err) {
    next(err);
  }
});

router.route('/:id').delete(async (req, res, next) => {
  try {
    const postDeleted = await Post.findByIdAndDelete(req.params.id);
    if(postDeleted){
      res.status(200).json('Post delted')
    }
  } catch (err) {
    next(err);
  }
  
});

module.exports = router;
