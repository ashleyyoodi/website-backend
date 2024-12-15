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
  const result = await db.query('SELECT * FROM blog_post WHERE deleted=false ORDER BY submitted_date desc, created_date desc');
  response.status(200).json(result.rows);
});

app.post('/blog-posts/new', async (request, response) => {
  console.log("hit /blog-posts/new");
  let text = request.body.text;
  let isDraft = request.body.isDraft;

  let isSubmitting = request.body.isSubmitting;
  let submitted_date = isSubmitting ? Date.now() : null;

  console.log("saving: " + text);
  const result = await db.query('INSERT INTO blog_post (text, draft, submitted_date) VALUES ($1, $2, (to_timestamp($3/1000.0) AT TIME ZONE \'US/Pacific\'))', [text, isDraft, submitted_date]);
  response.status(200).json(result.rows);
});

app.post('/blog-posts/edit', async (request, response) => {
  console.log("hit /blog-posts/edit");
  let id = request.query.id;
  let text = request.body.text;
  let isDraft = request.body.isDraft;
  let isSubmitting = request.body.isSubmitting;

  let result = null;
  console.log("updating blog post id=" + id);
  if (isSubmitting) {
    result = await db.query('UPDATE blog_post SET text=$1, draft=$2, submitted_date=NOW() AT TIME ZONE \'US/Pacific\', updated_date=NOW() AT TIME ZONE \'US/Pacific\' WHERE blog_post_id=$3', [text, isDraft, id]);
  } else {
    let lastSubmittedDate = request.body.lastSubmittedDate;
    let submitted_date = lastSubmittedDate ? new Date(lastSubmittedDate) : null;
    result = await db.query('UPDATE blog_post SET text=$1, draft=$2, submitted_date=$3, updated_date=NOW() AT TIME ZONE \'US/Pacific\' WHERE blog_post_id=$4', [text, isDraft, submitted_date, id]);
  }
  response.status(200).json(result.rows);
});

app.post('/blog-posts/delete', async (request, response) => {
  console.log("hit /blog-posts/delete");
  let id = request.query.id;
  console.log("deleting blog post id=" + id);
  const result = await db.query('UPDATE blog_post SET deleted=true WHERE blog_post_id=$1', [id]);
  response.status(200).json(result.rows);
});

/* Youtube Links */

app.get('/youtube-links', async (request, response) => {
  console.log("hit /youtube-links");
  const result = await db.query('SELECT * FROM youtube_link ORDER BY created_date desc');
  response.status(200).json(result.rows);
});

app.post('/youtube-links/new', async (request, response) => {
  console.log("hit /youtube-links/new");
  let link = request.body.link;
  let comment = request.body.comment;
  console.log("saving: " + text);
  const result = await db.query('INSERT INTO youtube_link (link, comment) VALUES ($1, $2)', [link, comment]);
  response.status(200).json(result.rows);
});


/* SoundCloud Links */

app.get('/soundcloud-links', async (request, response) => {
  console.log("hit /soundcloud-links");
  const result = await db.query('SELECT * FROM soundcloud_link ORDER BY created_date desc');
  response.status(200).json(result.rows);
});

app.post('/soundcloud-links/new', async (request, response) => {
  console.log("hit /soundcloud-links/new");
  let link = request.body.link;
  let comment = request.body.comment;
  console.log("saving: " + text);
  const result = await db.query('INSERT INTO soundcloud_link (link, comment) VALUES ($1, $2)', [link, comment]);
  response.status(200).json(result.rows);
});


/* Admin */

app.get('/admin/authorize', async(request, response) => {
  console.log("hit /admin/authorize");
  const authorized = request.query.input == process.env.ADMIN_PASSWORD;
  response.status(200).send(authorized);
});