import express from 'express';
import userRoutes from './admin.js';
import postRoutes from './postRoutes.js';
import footerRoutes from './footerRoutes.js';

/* const wordsRoutes = require("./words"); */

const app = express();

app.use('/', userRoutes);
app.use('/post', postRoutes);

// Serve static files from the public/uploads directory
app.use('/uploads', express.static('public/uploads'));

app.use('/footer', footerRoutes);
/* app.use("/words", wordsRoutes); */

export default app;
