const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  text: { type: String, required: true },
  picture: String, 
  video: String,
  user: { type: Schema.ObjectId, ref: 'User' },
  comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
  likes: [{ type: Schema.ObjectId, ref: 'User' }]
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;