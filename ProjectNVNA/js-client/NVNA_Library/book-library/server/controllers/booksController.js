// Controller class for handling book-related HTTP requests
class BooksController {
    constructor(bookModel) {
        // Store the book model for database operations
        this.bookModel = bookModel;
    }

    // Handle GET request to fetch all books
    async getAllBooks(req, res) {
        try {
            const books = await this.bookModel.getAllBooks();
            res.status(200).json(books); // Respond with the list of books
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving books', error });
        }
    }

    // Handle GET request to search for books by title or author
    async searchBooks(req, res) {
        const { title, author } = req.query;
        try {
            const books = await this.bookModel.searchBooks(title, author);
            res.status(200).json(books); // Respond with the search results
        } catch (error) {
            res.status(500).json({ message: 'Error searching for books', error });
        }
    }

    // Handle POST request to add a new book
    async addBook(req, res) {
        // Extract book data from the request body
        const { title, author, genre, publishedYear } = req.body;
        try {
            // Add the new book using the model
            const newBook = await this.bookModel.addBook({ title, author, genre, publishedYear });
            res.status(201).json(newBook); // Respond with the created book
        } catch (error) {
            res.status(500).json({ message: 'Error adding book', error });
        }
    }
}

// Export the controller class for use in routes
module.exports = BooksController;