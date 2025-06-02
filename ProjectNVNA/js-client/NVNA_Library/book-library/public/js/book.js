document.addEventListener('DOMContentLoaded', async () => {
    // Get book ID from URL
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');
    if (!bookId) return;

    // Fetch book details from backend
    const response = await fetch(`/books/${bookId}`);
    if (!response.ok) {
        document.getElementById('bookTitle').textContent = 'Book not found';
        return;
    }
    const book = await response.json();

    // Set book details
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = `by ${book.author}`;
    document.getElementById('bookSummary').textContent = book.summary || '';

    // Show cover if available
    if (book.cover_id) {
        document.getElementById('bookCover').src = `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`;
        document.getElementById('bookCover').style.display = 'block';
    } else {
        document.getElementById('bookCover').style.display = 'none';
    }
});