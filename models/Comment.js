const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true },
  picture: String, 
  video: String,
  user: { type: Schema.ObjectId, ref: 'User'},
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;