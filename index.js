import express from "express";
import cors from "cors";
import * as db from "./db/db.js";
import 'dotenv/config';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

/* Blog Posts */

app.get('/blog-posts', async (request, response) => {
  console.log("hit /blog-posts");
  const result = await db.query('SELECT * FROM blog_post ORDER BY created_date desc');
  response.status(200).json(result.rows);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


/* Admin */

app.get('/admin/authorize', async(request, response) => {
  console.log("hit /admin/authorize");
  const authorized = request.query.input == process.env.ADMIN_PASSWORD;
  response.status(200).send(authorized);
});