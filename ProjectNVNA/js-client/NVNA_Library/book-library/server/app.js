// Import required modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db/index'); // Database connection
const booksRouter = require('./routes/books'); // Books route handler
const authRouter = require('./routes/auth'); // Authentication route handler
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or default to 3000

// Enable CORS for all routes (allows requests from other origins)
app.use(cors());

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images) from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Initialize session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: false } // for development
}));

// Mount the books router on the /books path
app.use('/books', booksRouter);

// Mount the auth router on the /auth path
app.use('/auth', authRouter);

// Start the server only after confirming a successful DB connection
db.connect(err => {
  if (err) {
    // If database connection fails, log the error and exit
    console.error('Database connection failed:', err.stack);
    process.exit(1);
  } else {
    // If connection is successful, start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
});