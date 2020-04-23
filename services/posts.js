const Post = require('../models/posts');


class PostService{
  async getAll(){
    const posts = await Post.find();
    return posts || [];
  }
  async getOne(id){
    const post = await Post.findById(id);
    return post;
  }
  async createOne(data){
     const {
      tags,
      title,
      contacts,
      state,
      summary,
      content,
      ipAddress,
    } = data;
    const newPost = await new Post({
      tags,
      title,
      contacts,
      state,
      summary,
      content,
      ipAddress,
    });
    await newPost.save();
    return newPost;
  }

  async updateOne(id, data){
    const post = await Post.findById(id);
    post.tags = data.tags;
    post.title = data.title;
    post.contacts = data.contacts;
    post.state = data.state;
    post.summary = data.summary;
    post.content = data.content;
    post.ipAddress = data.ipAddress;
    await post.save();
  }

  async deleteOne(id){
    await Post.findByIdAndDelete(id);
  }
}


module.exports = PostService;