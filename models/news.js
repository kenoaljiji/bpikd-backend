import mongoose from 'mongoose';
const { Schema } = mongoose;

const newsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  publishTime: { type: String, required: true },
  scheduledPublishTime: Date,
  externalSource: String,
  visibility: { type: String, required: true },
  category: { type: String, required: true },
  featured: { type: String },
});

const News = mongoose.model('News', newsSchema);

export default News;
