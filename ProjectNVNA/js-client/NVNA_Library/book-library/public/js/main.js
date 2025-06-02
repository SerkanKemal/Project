document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const addBookForm = document.getElementById('addBookForm');
    const bookList = document.getElementById('books');
    const messageBox = document.getElementById('messageBox');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchButton');
    const genreFilter = document.getElementById('genreFilter');

    // Initialize an array to store all books
    let allBooks = [];

    // Handle Add Book form submission
    addBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const genre = document.getElementById('genre').value;
        const summary = document.getElementById('summary').value;
        const coverId = document.getElementById('coverId').value;

        const response = await fetch('/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, genre, summary, coverId })
        });

        const data = await response.json();
        if (response.status === 409) {
            messageBox.textContent = data.error || "This book already exists in the library.";
            messageBox.classList.add('show');
            setTimeout(() => messageBox.classList.remove('show'), 3000);
        } else if (response.ok) {
            messageBox.textContent = 'Book added successfully!';
            messageBox.classList.add('show');
            setTimeout(() => messageBox.classList.remove('show'), 2000);
            addBookForm.reset();
            fetchBooks();
        } else {
            messageBox.textContent = data.error || 'Failed to add book.';
            messageBox.classList.add('show');
            setTimeout(() => messageBox.classList.remove('show'), 3000);
        }
    });

    // Helper to get unique genres from books
    function getUniqueGenres(books) {
        const genres = new Set();
        books.forEach(book => {
            if (book.genre) genres.add(book.genre);
        });
        return Array.from(genres);
    }

    // Update genre filter options
    function updateGenreFilter(books) {
        const genres = getUniqueGenres(books);
        // Save the current selection
        const currentValue = genreFilter.value;
        genreFilter.innerHTML = '<option value="">All Genres</option>';
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
        // Restore the selection if possible
        genreFilter.value = currentValue;
    }

    // Fetch and display books, filtered by genre if selected
    const fetchBooks = async () => {
        try {
            const response = await fetch('/books');
            allBooks = await response.json();
            updateGenreFilter(allBooks); // Always use allBooks here

            // Filter by genre if selected
            const selectedGenre = genreFilter.value;
            let books = allBooks;
            if (selectedGenre) {
                books = books.filter(book => book.genre === selectedGenre);
            }
            displayBooks(books);
        } catch (error) {
            messageBox.textContent = 'An error occurred while fetching books.';
        }
    };

    // Listen for changes to the genre filter
    genreFilter.addEventListener('change', fetchBooks);

    // Handle search button click
    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        try {
            const response = await fetch(`/books/search?title=${encodeURIComponent(query)}&author=${encodeURIComponent(query)}`);
            allBooks = await response.json();
            updateGenreFilter(allBooks); // Always use allBooks here

            // Filter by genre if selected
            const selectedGenre = genreFilter.value;
            let books = allBooks;
            if (selectedGenre) {
                books = books.filter(book => book.genre === selectedGenre);
            }
            displayBooks(books);
        } catch (error) {
            messageBox.textContent = 'An error occurred while searching for books.';
        }
    });

    // Autofill book details from Open Library
    // document.getElementById('autofillBtn').addEventListener('click', async () => {
    //     const title = document.getElementById('title').value.trim();
    //     if (!title) return;

    //     const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    //     const data = await response.json();
    //     if (data.docs && data.docs.length > 0) {
    //         const book = data.docs[0];
    //         document.getElementById('author').value = book.author_name ? book.author_name.join(', ') : '';
    //         document.getElementById('coverId').value = book.cover_i || '';
    //         // Autofill genre if available
    //         if (book.subject && book.subject.length > 0) {
    //             document.getElementById('genre').value = book.subject[0];
    //         } else if (book.subject_facet && book.subject_facet.length > 0) {
    //             document.getElementById('genre').value = book.subject_facet[0];
    //         } else {
    //             document.getElementById('genre').value = '';
    //         }
    //         // Try to get a summary/description from Open Library works API
    //         if (book.key) {
    //             const workRes = await fetch(`https://openlibrary.org${book.key}.json`);
    //             const workData = await workRes.json();
    //             document.getElementById('summary').value = workData.description
    //                 ? (typeof workData.description === 'string' ? workData.description : workData.description.value)
    //                 : '';
    //         }
    //     } else {
    //         alert('No book found with that title.');
    //     }
    // });

    // Display books in the list, including summary and QR code
    const displayBooks = (books) => {
        bookList.innerHTML = '';
        if (!books || books.length === 0) {
            const noBookMsg = document.createElement('li');
            noBookMsg.textContent = "We don't have that book.";
            noBookMsg.setAttribute('no-book', '');
            bookList.appendChild(noBookMsg);
            return;
        }
        // Group books by genre
        const genres = {};
        books.forEach(book => {
            if (!genres[book.genre]) genres[book.genre] = [];
            genres[book.genre].push(book);
        });
        // Display each genre section
        Object.keys(genres).forEach(genre => {
            const genreHeader = document.createElement('h3');
            genreHeader.textContent = genre;
            bookList.appendChild(genreHeader);
            genres[genre].forEach(book => {
                const li = document.createElement('li');
                let coverImg = '';
                if (book.cover_id) {
                    coverImg = `<img src="https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg" alt="Book cover" style="height:100px;display:block;margin-bottom:8px;border-radius:8px;">`;
                }
                li.innerHTML = `
                    ${coverImg}
                    <strong>${book.title}</strong> by ${book.author}<br>
                    <em>${book.summary || ''}</em>
                `;

                // Create a canvas for the QR code
                const qr = document.createElement('canvas');
                // Set the QR code to link to the book details page
                const bookUrl = `http://UR_IP:3000/book.html?id=${book.id}`; // use ur local IP
                new QRious({
                    element: qr,
                    value: bookUrl,
                    size: 80
                });

                li.appendChild(document.createElement('br'));
                li.appendChild(qr);
                bookList.appendChild(li);
            });
        });
    };

    // Initial fetch to display all books on page load
    fetchBooks();

    fetch('/auth/me')
  .then(res => res.json())
  .then(user => {
      if (user.role === 'admin' || user.role === 'librarian') {
          document.getElementById('addBookForm').style.display = 'block';
          document.getElementById('addBookFormMessage').style.display = 'none';
      } else {
          document.getElementById('addBookForm').style.display = 'none';
          document.getElementById('addBookFormMessage').style.display = 'block';
      }
  })
  .catch(() => {
      document.getElementById('addBookForm').style.display = 'none';
      document.getElementById('addBookFormMessage').style.display = 'block';
  });
});

// Include Tesseract.js for OCR functionality
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
document.head.appendChild(script);

// Autofill book details from cover photo using Tesseract.js OCR
document.getElementById('photoAutofillBtn').addEventListener('click', async () => {

    let form = new FormData();
    form.append('file', coverPhotoInput.files[0]);

    fetch('http://UR_IP:8000/ocr', { // USE UR IP
        method: 'POST',
        cors: "none",
        body: form
    }).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        document.getElementById('title').value = data.title;
        document.getElementById('author').value = data.author;
        document.getElementById('summary').value = data.summary;
        document.getElementById('genre').value = data.genre; // Genre is hard to extract from cover, leave blank or let user fill
    })

    // const fileInput = document.getElementById('coverPhotoInput');
    // if (!fileInput.files.length) {
    //     alert('Please select or take a photo of the book cover.');
    //     return;
    // }
    // const image = fileInput.files[0];

    // // Show a loading message
    // const messageBox = document.getElementById('messageBox');
    // messageBox.textContent = 'Processing image...';

    // // Run OCR
    // const { data: { text } } = await Tesseract.recognize(image, 'eng', { logger: m => console.log(m) });

    // // Try to extract fields from the recognized text
    // // This is a simple heuristic: first line = title, second = author, rest = summary
    // const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // document.getElementById('title').value = lines[0] || '';
    // document.getElementById('author').value = lines[1] || '';
    // document.getElementById('summary').value = lines.slice(2).join(' ') || '';
    // document.getElementById('genre').value = ''; // Genre is hard to extract from cover, leave blank or let user fill

    // messageBox.textContent = 'Autofill complete! Please check and edit the fields if needed.';
});