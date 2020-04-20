const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  tags: [{
    type: String,
    trim: true,
    enum: ["Caridad", "Ayuda"]
  }],
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  contacts: [Schema.Types.Mixed],
  state: {
    type: String,
    required: true,
    trim: true,
    enum: ["Emergencia", "Esperando ayuda", "Caridad"]
  },
  summary: {
    type: String,
    maxlength: 400,
  },
  content: {
    type: String,
    maxlength: 600
  },
  ipAddress: {
    type: String,
    required: true,
    maxlength: 15
  }
},
  {
    timestamps: true
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

