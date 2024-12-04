import express from "express";
import cors from "cors";
import * as db from "./db/db.js";
import 'dotenv/config';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/* Blog Posts */

app.get('/blog-posts', async (request, response) => {
  console.log("hit /blog-posts");
  const result = await db.query('SELECT * FROM blog_post WHERE deleted=false ORDER BY created_date desc');
  response.status(200).json(result.rows);
});

app.post('/blog-posts/new', async (request, response) => {
  console.log("hit /blog-posts/new");
  let text = request.body.text;
  console.log("saving: " + text);
  const result = await db.query('INSERT INTO blog_post (text) VALUES ($1)', [text]);
  response.status(200).json(result.rows);
});

app.post('/blog-posts/delete', async (request, response) => {
  console.log("hit /blog-posts/delete");
  let id = request.query.id;
  console.log("deleting blog post id=: " + id);
  const result = await db.query('UPDATE blog_post SET deleted=true WHERE blog_post_id=$1', [id]);
  response.status(200).json(result.rows);
});

/* Youtube Links */

app.get('/youtube-links', async (request, response) => {
  console.log("hit /youtube-links");
  const result = await db.query('SELECT * FROM youtube_link ORDER BY created_date desc');
  response.status(200).json(result.rows);
});


/* SoundCloud Links */

app.get('/soundcloud-links', async (request, response) => {
  console.log("hit /soundcloud-links");
  const result = await db.query('SELECT * FROM soundcloud_link ORDER BY created_date desc');
  response.status(200).json(result.rows);
});


/* Admin */

app.get('/admin/authorize', async(request, response) => {
  console.log("hit /admin/authorize");
  const authorized = request.query.input == process.env.ADMIN_PASSWORD;
  response.status(200).send(authorized);
});