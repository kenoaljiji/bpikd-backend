// Importing modules using ES6/ES7 syntax
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/routes.js'; // Make sure your routes file exports the routes using ES6 export syntax

dotenv.config();

// Connecting to the database

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

connectDB();

const app = express();

// CORS middleware setup to allow requests from localhost:3000
app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://localhost:8000'
    /* 'https://bpikd-backend-test.up.railway.app' */
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Express middleware for parsing requests
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb' }));
app.use(express.json());
app.use(cors());

// Using routes
app.use('/', routes);

const PORT = process.env.PORT;

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
