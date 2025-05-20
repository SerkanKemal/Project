// Провери дали има логнат потребител
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
if (!currentUser.username) {
    window.location.href = 'index.html';
    // Спирай изпълнението на останалия код
}

const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const username = currentUser.username || 'Анонимен';

// Свържи се към socket.io сървъра
const socket = io();

// При изпращане на съобщение
messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;
    socket.emit('chat message', { username, text });
    messageInput.value = '';
});

// При получаване на съобщение
socket.on('chat message', function(msg) {
    addMessage(msg);
});

// Добавяне на съобщение в DOM
function addMessage(msg) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    if (msg.username === username) msgDiv.classList.add('self');

    const userSpan = document.createElement('span');
    userSpan.className = 'username';
    userSpan.textContent = msg.username;

    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = msg.text;

    msgDiv.appendChild(userSpan);
    msgDiv.appendChild(textSpan);
    messagesDiv.appendChild(msgDiv);

    // Скролирай надолу
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// (По желание) Може да добавиш съобщение "Добре дошъл" при влизане