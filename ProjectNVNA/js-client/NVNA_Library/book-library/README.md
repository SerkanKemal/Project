# Book Library

## Overview
The Book Library is a web-based application for managing a collection of books with a modern, animated interface. Users can add books (with summaries), search by title or author, and view book details via QR codes. The app is built with Node.js, Express, MySQL, and a clean, well-commented codebase for easy understanding and maintenance.

## Features
- **Add Books:** Fill out a form to add new books with title, author, and summary.
- **Search:** Find books by title or author using the search bar.
- **Book List:** View all books in a visually appealing, animated list.
- **Book Details Page:** Scan a QR code for any book to view its details on a dedicated page.
- **Responsive Design:** Works well on desktop and mobile devices.
- **Well-Commented Code:** All files include clear comments for easy navigation and learning.
- **Modern UI:** Includes animations, gradients, and interactive feedback.

## Technologies Used
- **Frontend:** HTML, CSS (with animations), JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL
- **QR Codes:** [QRious](https://github.com/neocotic/qrious) JavaScript library

## Project Structure
```
book-library
├── server
│   ├── app.js                # Main Express app (with comments)
│   ├── routes
│   │   └── books.js          # Book routes (with comments)
│   ├── controllers
│   │   └── booksController.js# Controller logic (with comments)
│   ├── models
│   │   └── bookModel.js      # Book model (with comments)
│   └── db
│       └── index.js          # Database connection (with comments)
├── public
│   ├── index.html            # Main UI (with comments)
│   ├── book.html             # Book details page (with comments)
│   ├── css
│   │   └── styles.css        # Modern, animated styles (with comments)
│   └── js
│       └── main.js           # Frontend logic (with comments)
├── package.json              # Project metadata (with comments)
└── README.md                 # This file
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   ```
2. **Navigate to the project directory:**
   ```
   cd book-library
   ```
3. **Install dependencies:**
   ```
   npm install
   ```
4. **Set up the MySQL database:**
   - Create a database named `book_library`.
   - Run the provided SQL script or use the schema in your `create-db-template.sql`.
   - Update the database connection details in `server/db/index.js` if needed.
5. **Start the server:**
   ```
   npm start
   ```
6. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

## Usage

- **Add a Book:** Fill out the form (title, author, summary) and click "Add Book".
- **Search:** Enter a title or author and click "Search" to filter the list.
- **View Book Details:** Click or scan the QR code next to any book to open its details page.
- **No Results:** If a search returns no books, a friendly message will appear.
- **Responsive UI:** Enjoy smooth animations and a modern look on any device.

## Code Documentation

- All major files (backend, frontend, models, routes, styles) include clear comments explaining their purpose and logic.
- This makes it easy for new contributors or students to understand and extend the project.

## Contributing

Contributions are welcome!  
Please submit a pull request or open an issue for any suggestions, improvements, or bug reports.

## License

This project is licensed under the MIT License.

---

**Tip:**  
If you want to access the app from your phone, make sure your computer and phone are on the same Wi-Fi, and use your computer’s local IP address in the QR code URLs.  
See the comments in `main.js` for more details.