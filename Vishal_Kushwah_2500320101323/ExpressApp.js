const express = require('express');
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Initial in-memory data
let books = [
  {
    id: 101,
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    genre: "Autobiography",
    publishedYear: 1999,
    available: true
  },
  {
    id: 102,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    publishedYear: 1988,
    available: true
  },
  {
    id: 103,
    title: "Harry Potter",
    author: "J.K. Rowling",
    genre: "Fantasy",
    publishedYear: 1997,
    available: false
  }
];

// Helper function to validate book input fields
function validateBookPayload(body) {
  const { title, author, genre, publishedYear, available } = body;

  if (
    typeof title !== 'string' || title.trim() === '' ||
    typeof author !== 'string' || author.trim() === '' ||
    typeof genre !== 'string' || genre.trim() === '' ||
    typeof publishedYear !== 'number' || !Number.isInteger(publishedYear) ||
    typeof available !== 'boolean'
  ) {
    return false;
  }
  return true;
}

// 1. GET all records
app.get('/api/books', (req, res) => {
  res.status(200).json(books);
});

// 6. Filter records by author (Declared BEFORE /api/books/:id)
app.get('/api/books/filter', (req, res) => {
  const { author } = req.query;

  if (!author || author.trim() === '') {
    return res.status(400).json({ error: "Query parameter 'author' is required." });
  }

  const searchTerm = author.trim().toLowerCase();
  const filteredBooks = books.filter(book =>
    book.author.toLowerCase().includes(searchTerm)
  );

  res.status(200).json(filteredBooks);
});

// 3. GET record by ID
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ error: `Book with ID ${req.params.id} not found.` });
  }

  res.status(200).json(book);
});

// 2. POST a new record
app.post('/api/books', (req, res) => {
  if (!validateBookPayload(req.body)) {
    return res.status(400).json({
      error: "Invalid input. Ensure title, author, genre (strings), publishedYear (number), and available (boolean) are provided."
    });
  }

  const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 101;

  const newBook = {
    id: newId,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    genre: req.body.genre.trim(),
    publishedYear: req.body.publishedYear,
    available: req.body.available
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// 4. PUT / update a record
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: `Book with ID ${req.params.id} not found.` });
  }

  if (!validateBookPayload(req.body)) {
    return res.status(400).json({
      error: "Invalid input. Ensure title, author, genre (strings), publishedYear (number), and available (boolean) are provided."
    });
  }

  const updatedBook = {
    id: id,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    genre: req.body.genre.trim(),
    publishedYear: req.body.publishedYear,
    available: req.body.available
  };

  books[bookIndex] = updatedBook;
  res.status(200).json(updatedBook);
});

// 5. DELETE a record
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: `Book with ID ${req.params.id} not found.` });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];
  res.status(200).json({
    message: "Book deleted successfully.",
    book: deletedBook
  });
});

module.exports = app;