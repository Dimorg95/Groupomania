const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  userMail: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdDate: { type: Date, required: true },
  likes: { type: String, required: true, default: 0 },
  usersLiked: [String],
});
module.exports = mongoose.model('Post', postSchema);
