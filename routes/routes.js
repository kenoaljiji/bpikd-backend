import express from 'express';
import userRoutes from './admin.js';
import postRoutes from './postRoutes.js';

/* const wordsRoutes = require("./words"); */

const app = express();

app.use('/', userRoutes);
app.use('/post', postRoutes);
/* app.use("/words", wordsRoutes); */

export default app;
