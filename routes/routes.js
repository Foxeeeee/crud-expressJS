const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv")
const db = require("../lib/connection");
const router = express.Router();

dotenv.config()

router.use(bodyParser.json());

router.get("/book", (req, res) => {
  db.query("SELECT * FROM book_store", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({message: "No books available in the database"})
    }
    res.json(result);
  });
});

router.get("/book/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM book_store WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(result[0]);
  });
});

router.post("/book", (req, res) => {
  const { book, author, description } = req.body;

  if (!book || !author || !description) {
    return res.status(400).json({
      message: "All columns must be filled in",
    });
  }

  db.query(
    "INSERT INTO book_store (book, author, description) VALUES (?, ?, ?)",
    [book, author, description],
    (err, result) => {
      if (err) {
        console.error("Error adding book:", err);
        return res.status(500).json({ error: "Failed to add book" });
      }
      console.log("Book added successfully. ID:", result.insertId);
      res.status(201).json({
        message: "Book added successfully",
        id: result.insertId,
        book: book,
        author: author,
        description: description
      });
    }
  );
});

router.put("/book/:id", (req, res) => {
  const id = req.params.id;
  const { book, author, description } = req.body;

  db.query(
    "UPDATE book_store SET book = ?, author = ?, description = ? WHERE id = ?",
    [book, author, description, id],
    (err, result) => {
      if (err) {
        console.log("Error update book");
        return res.status(500).json({ error: "Failed to update book" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      console.log("Book updated successfully");
      res.status(200).json({
        message: "Book updated succesfully",
        book: book,
        author: author,
        description: description
      });
    }
  );
});

router.delete("/book/:id", (req, res) => {
  const id = req.params.id

  db.query(
    "DELETE FROM book_store WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log("Error", err)
        return res.status(500).json({error: "Error"})
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      console.log("Book have been deleted")
      res.status(200).json({
        message: "Book have been deleted"
      })
    }
  )
})

module.exports = router;