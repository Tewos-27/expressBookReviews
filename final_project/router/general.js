const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

 // Assume this is where user data is stored

 public_users.post('/register', function (req, res) {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Both username and password are required" });
    }
  
    if (users[username]) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Register the new user
    users[username] = { username, password }; // Store the user details
    return res.status(201).json({ message: "User registered successfully", user: { username } });
  });

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Simulate an asynchronous operation (e.g., fetching from a database or API)
      const bookList = await new Promise((resolve) => {
        setTimeout(() => resolve(books), 1000); // Simulate a delay
      });
      return res.status(200).json(bookList);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book list" });
    }
  });
// Get book details based on ISBN
// Task 11: Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const bookDetails = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        }, 1000); // Simulate a delay
      });
      return res.status(200).json(bookDetails);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });
  
// Get book details based on author
// Task 12: Get book details based on Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    try {
      const filteredBooks = await new Promise((resolve) => {
        setTimeout(() => {
          const booksArray = Object.values(books);
          const filteredBooks = booksArray.filter(
            (book) => book.author.toLowerCase() === author.toLowerCase()
          );
          resolve(filteredBooks);
        }, 1000); // Simulate a delay
      });
  
      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "No books found for the specified author" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author" });
    }
  });

// Get all books based on title
// Task 13: Get book details based on Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
      const filteredBooks = await new Promise((resolve) => {
        setTimeout(() => {
          const booksArray = Object.values(books);
          const filteredBooks = booksArray.filter(
            (book) => book.title.toLowerCase() === title.toLowerCase()
          );
          resolve(filteredBooks);
        }, 1000); // Simulate a delay
      });
  
      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "No books found for the specified title" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title" });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Check if the book exists in the books object
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" }); // Return 404 if the book does not exist
  }

  // Extract the reviews for the specified book
  const bookReviews = books[isbn].reviews;

  // Check if there are any reviews
  if (Object.keys(bookReviews).length === 0) {
    return res.status(200).json({ message: "No reviews available for this book" }); // Return a message if no reviews exist
  }

  // Return the reviews
  return res.status(200).json(bookReviews); // Return the reviews as JSON
});

module.exports.general = public_users;

//CRUD

/**const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


 // Assume this is where user data is stored

public_users.post('/register', function (req, res) {
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Validate that both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users[username] = { username, password }; // Store the user details (you can hash the password in a real application)

  // Return a success message
  return res.status(201).json({ message: "User registered successfully", user: { username } });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Check if the book exists in the books object
  if (books[isbn]) {
    return res.status(200).json(books[isbn]); // Return the book if found
  } else {
    return res.status(404).json({ message: "Book not found" }); // Return 404 if not found
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Convert the books object into an array of book objects
  const booksArray = Object.values(books);

  // Filter the books by the specified author (case-insensitive comparison)
  const filteredBooks = booksArray.filter(book => 
    book.author && book.author.toLowerCase() === author.toLowerCase()
  );

  // Check if any books were found
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks); // Return the matching books
  } else {
    return res.status(404).json({ message: "No books found for the specified author" }); // Return 404 if no books are found
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Convert the books object into an array of book objects
  const booksArray = Object.values(books);

  // Filter the books by the specified title (case-insensitive comparison)
  const filteredBooks = booksArray.filter(book => 
    book.title && book.title.toLowerCase() === title.toLowerCase()
  );

  // Check if any books were found
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks); // Return the matching books
  } else {
    return res.status(404).json({ message: "No books found for the specified title" }); // Return 404 if no books are found
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Check if the book exists in the books object
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" }); // Return 404 if the book does not exist
  }

  // Extract the reviews for the specified book
  const bookReviews = books[isbn].reviews;

  // Check if there are any reviews
  if (Object.keys(bookReviews).length === 0) {
    return res.status(200).json({ message: "No reviews available for this book" }); // Return a message if no reviews exist
  }

  // Return the reviews
  return res.status(200).json(bookReviews); // Return the reviews as JSON
});

module.exports.general = public_users;
**/
