import express from 'express';
import userRoutes from './admin.js';
/* const wordsRoutes = require("./words"); */

const app = express();

app.use('/', userRoutes);
/* app.use("/words", wordsRoutes); */

export default app;
