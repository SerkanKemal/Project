const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs'); // Добави това най-горе, ако го няма

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const usersFile = path.join(__dirname, 'users.json');

// Помощна функция за четене на потребителите от users.json
function readUsers() {
    if (!fs.existsSync(usersFile)) return [];
    return JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
}

// Помощна функция за запис на потребителите в users.json
function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// API за регистрация
app.post('/api/register', express.json(), (req, res) => {
    const { email, username, password } = req.body;
    let users = readUsers();
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Имейлът вече е регистриран' });
    }
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ error: 'Потребителското име е заето' });
    }
    users.push({ email, username, password });
    writeUsers(users);
    res.json({ email, username });
});

// API за вход
app.post('/api/login', express.json(), (req, res) => {
    const { email, username, password } = req.body;
    let users = readUsers();
    const user = users.find(u => u.email === email && u.username === username && u.password === password);
    if (!user) {
        return res.status(400).json({ error: 'Грешен имейл, потребителско име или парола' });
    }
    res.json({ email: user.email, username: user.username });
});

// Сервирай статичните файлове (index.html, chat.html, style.css, login.js, chat.js)
app.use(express.static(path.join(__dirname, '..')));

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Изпрати към всички
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сървърът работи на http://localhost:${PORT}`);
});