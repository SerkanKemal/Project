const express = require('express');
const router = express.Router();
const db = require('../db/index');

// Middleware to check if user is admin or librarian
function requireAdminOrLibrarian(req, res, next) {
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'librarian')) {
        return res.status(403).json({ error: 'You do not have permission to add books.' });
    }
    next();
}

// Route to get all books
// Responds with a list of all books in the database
router.get('/', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) {
            // If there's a database error, send a 500 response
            return res.status(500).json({ error: 'Database error' });
        }
        // Send the list of books as JSON
        res.json(results);
    });
});

// Route to search for books
// Allows searching by title or author using query parameters
router.get('/search', (req, res) => {
    const { title, author } = req.query;
    db.query(
        'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?',
        [`%${title}%`, `%${author}%`],
        (err, results) => {
            if (err) {
                // If there's a database error, send a 500 response
                return res.status(500).json({ error: 'Database error' });
            }
            // Send the search results as JSON
            res.json(results);
        }
    );
});

// Route to add a new book
// Expects title, author, and summary in the request body
router.post('/', requireAdminOrLibrarian, (req, res) => {
    const { title, author, genre, summary, coverId } = req.body;

    db.query(
        'SELECT * FROM books WHERE title = ? AND author = ?',
        [title, author],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (results.length > 0) {
                return res.status(409).json({ error: 'This book already exists in the library.' });
            }

            db.query(
                'INSERT INTO books (title, author, genre, summary, cover_id) VALUES (?, ?, ?, ?, ?)',
                [title, author, genre, summary, coverId],
                (err, results) => {
                    if (err) {
                        // If duplicate error from DB, send 409
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(409).json({ error: 'This book already exists in the library.' });
                        }
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.status(201).json({ message: 'Book added successfully' });
                }
            );
        }
    );
});

// Route to get a single book by ID
// Responds with details of the book, including title, author, summary, and cover image
router.get('/:id', (req, res) => {
    const bookId = req.params.id;
    db.query('SELECT * FROM books WHERE id = ?', [bookId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'Book not found' });
        res.json(results[0]); // This includes cover_id
    });
});

// Export the router to be used in app.js
module.exports = router;
