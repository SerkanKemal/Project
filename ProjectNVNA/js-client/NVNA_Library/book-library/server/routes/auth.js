const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/index');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'service3832@gmail.com', //Brt use real email here
        pass: 'xaqc jhnr rmjh sogz' // Use an app password, not your real password!
    }
});

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash],
        (err) => {
            if (err) return res.status(400).json({ error: 'Username or email already exists' });

            // Send thank-you email
            transporter.sendMail({
                from: '"NVNA Book Library" <yourgmail@gmail.com>',
                to: email,
                subject: 'Thank you for registering!',
                text: `Hello ${username},\n\nThank you for registering at NVNA Book Library!\n\nHappy reading!\n\n- The NVNA Library Team`
            }, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Registration email sent:', info.response);
                }
            });

            res.json({ message: 'Registration successful' });
        }
    );
});

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err || results.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ error: 'Invalid credentials' });
            req.session.user = { id: user.id, username: user.username, role: user.role };
            // For simplicity, just send success (add sessions/JWT for real apps)
            res.json({ message: 'Login successful' });
        }
    );
});

router.get('/me', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({
        username: req.session.user.username,
        role: req.session.user.role
    });
});

module.exports = router;