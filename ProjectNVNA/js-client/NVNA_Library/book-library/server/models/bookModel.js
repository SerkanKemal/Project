// Import the mysql2 library and the database connection
const mysql = require('mysql2');
const db = require('../db/index');

// Book model object containing methods for database operations
const Book = {
    // Create a new book entry in the database
    create: (title, author, summary, cover_id, callback) => {
        const query = 'INSERT INTO books (title, author, summary, cover_id) VALUES (?, ?, ?, ?)';
        db.query(query, [title, author, summary, cover_id], (err, results) => {
            if (err) return callback(err); // If error, pass it to callback
            callback(null, results.insertId); // On success, return new book's ID
        });
    },

    // Retrieve all books from the database
    findAll: (callback) => {
        const query = 'SELECT * FROM books';
        db.query(query, (err, results) => {
            if (err) return callback(err); // If error, pass it to callback
            callback(null, results); // On success, return all books
        });
    },

    // Search for books by title or author
    search: (searchTerm, callback) => {
        const query = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';
        db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
            if (err) return callback(err); // If error, pass it to callback
            callback(null, results); // On success, return matching books
        });
    }
};

// Export the Book model for use in controllers and routes
module.exports = Book;