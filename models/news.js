import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: String,
    visibility: String,
    publishTime: Date,
    scheduledPublishTime: Date,
    externalSource: String,
    isPublished: Boolean,
    featured: String, // Assuming this is a URL to an image or similar
    // Add any other fields you need
  },
  { timestamps: true }
); // Enable automatic createdAt and updatedAt fields

const News = mongoose.model('News', newsSchema);

export default News;
