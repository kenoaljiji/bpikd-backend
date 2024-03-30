import mongoose from 'mongoose';

const newsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  publishTime: { type: String, required: true },
  scheduledPublishTime: Date,
  externalSource: String,
  media: [mediaSchema], // Optional: if you decide to include media in news posts
  visibility: { type: String, required: true },
  category: { type: String, required: true },
});

const News = mongoose.model('News', newsSchema);

export default News;
