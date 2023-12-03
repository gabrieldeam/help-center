const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  name: { type: String, required: true },
  topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
});

module.exports = mongoose.model('Section', sectionSchema);
