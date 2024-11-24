import express from "express";
import cors from "cors";
import * as db from "./db/index.js";

export const app = express();
const port = 5000;

app.use(cors());

app.get('/blog-posts', async (request, response) => {
  const result = await db.query('SELECT * FROM blog_post');
  response.status(200).json(result.rows);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});