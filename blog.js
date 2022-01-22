const express = require("express");

const router = express.Router(); // call router

//import modules from other files
const db = require("../data/database");

router.get("/", function (req, res) {
  res.redirect("/posts"); // still redirect to post-lists if there is nothing available
});

router.get("/posts", function (req, res) {
  res.render("posts-list");
});

router.get("/new-post", async function (req, res) {
  const [authors] = await db.query("SELECT * FROM authors"); // destructutring array
  res.render("create-post", { authorKey: authors }); // pass data to template
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
    "INSERT INTO posts (title, body, summary, author_id) VALUES (?)",
    [data]
  );

  res.redirect("/posts");
});

module.exports = router;

//please keep your eyes sharp !!!
