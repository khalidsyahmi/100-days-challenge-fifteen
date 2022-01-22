const express = require("express");

const router = express.Router(); // call router

//import modules from other files
const db = require("../data/database");

router.get("/", function (req, res) {
  res.redirect("/posts"); // still redirect to post-lists if there is nothing available
});

router.get("/posts", async function (req, res) {
  //improve readability with backtcicks
  const query = `
  SELECT posts.*, authors.name AS author_name FROM posts
  INNER JOIN authors ON posts.author_id = authors.id
  `;
  const [post] = await db.query(query);
  res.render("posts-list", { postKey: post });
});

router.get("/new-post", async function (req, res) {
  const [authors] = await db.query("SELECT * FROM authors"); // destructutring array
  res.render("create-post", { authorKey: authors }); // pass data to template
});

//dynamic link
router.get("/posts/:id", async function (req, res) {
  //fetch specific post
  const query = `
  SELECT posts.*, authors.name AS author_name, authors.email AS author_email
  FROM posts 
  INNER JOIN authors ON posts.author_id = authors.id
  WHERE posts.id = ?
  `;

  const [posts] = await db.query(query, [req.params.id]); // 2 item = array and metadata

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }
  //spread into new obj copies
  const copyPosts = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  //don't forget to change the parameter
  res.render("post-detail", { postsKey: copyPosts }); //single post //array=[0] metadata=[1]
});

//handling post requests
router.post("/posts", async function (req, res) {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    "INSERT INTO posts (title, summary, body, author_id) VALUES (?)",
    [data]
  );
  res.redirect("/posts");
});

module.exports = router;

//please keep your eyes sharp !!!
