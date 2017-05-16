var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  author: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Campground', campgroundSchema);