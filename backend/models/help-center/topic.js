const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imagePath: { type: String },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

module.exports = mongoose.model('Topic', topicSchema);