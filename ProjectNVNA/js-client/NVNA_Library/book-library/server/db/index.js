// Import the mysql2 library for connecting to MySQL
const mysql = require('mysql2');

// Create a connection to the MySQL database using the provided credentials
const db = mysql.createConnection({
    host: 'localhost',           // Database host (local machine)
    user: 'library_user',        // MySQL username
    password: '18811991',        // MySQL password for the user
    database: 'book_library'     // Name of the database to use
});

// Attempt to connect to the database and log the result
db.connect(err => {
    if (err) {
        // If connection fails, log the error stack
        console.error('Database connection failed:', err.stack);
        return;
    }
    // If connection is successful, log a confirmation message
    console.log('Connected to the database.');
});

// Export the database connection for use in other modules
module.exports = db;


// const axios = require('axios');
// const fs = require('fs');
// const FormData = require('form-data');

// async function sendImage() {
//   const form = new FormData();
//   form.append('image', fs.createReadStream('./example.jpg'));

//   const response = await axios.post('http://localhost:5000/ocr', form, {
//     headers: form.getHeaders()
//   });

//   console.log('Резултат от OCR:', response.data.text);
// }

// sendImage();