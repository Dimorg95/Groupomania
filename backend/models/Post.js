const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdDate: { type: Date, required: true }, //enelvement required true
  likes: { type: Number, required: true, default: 0 },
  usersLiked: [String],
});
module.exports = mongoose.model('Post', postSchema);
