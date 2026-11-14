const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the book list available in the shop using Promise / Async-Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve) => resolve(books));
    const allBooks = await getBooks;
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Promise / Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBookByIsbn = new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    const book = await getBookByIsbn;
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 12: Get book details based on author using Promise / Async-Await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const authorBooks = [];
      for (const key in books) {
        if (books[key].author === author) {
          authorBooks.push(books[key]);
        }
      }
      if (authorBooks.length > 0) resolve(authorBooks);
      else reject("No books found for this author");
    });
    const result = await getBooksByAuthor;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 13: Get all books based on title using Promise / Async-Await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
      const titleBooks = [];
      for (const key in books) {
        if (books[key].title === title) {
          titleBooks.push(books[key]);
        }
      }
      if (titleBooks.length > 0) resolve(titleBooks);
      else reject("No books found with this title");
    });
    const result = await getBooksByTitle;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Axios Async/Await Client Helpers (Tasks 10-13)
async function fetchAllBooks(url) {
  const response = await axios.get(url);
  return response.data;
}

async function fetchBookByISBN(url, isbn) {
  const response = await axios.get(`${url}/isbn/${isbn}`);
  return response.data;
}

async function fetchBooksByAuthor(url, author) {
  const response = await axios.get(`${url}/author/${author}`);
  return response.data;
}

async function fetchBooksByTitle(url, title) {
  const response = await axios.get(`${url}/title/${title}`);
  return response.data;
}

module.exports.general = public_users;
