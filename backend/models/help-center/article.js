const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  useful: { type: Boolean, default: false },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
});

articleSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Article', articleSchema);