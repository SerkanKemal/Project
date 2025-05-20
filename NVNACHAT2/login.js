// Вземи елементите от DOM за формата и нейните части
const form = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('toggle-link');
const formError = document.getElementById('form-error');

const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const emailError = document.getElementById('email-error');
const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');

// Променлива за режим: вход или регистрация
let isRegister = false;

// Помощна функция: взима масива с потребители от localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Помощна функция: записва масива с потребители в localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Помощна функция: записва текущия логнат потребител в localStorage
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Изчиства всички съобщения за грешки във формата
function clearErrors() {
    emailError.textContent = '';
    usernameError.textContent = '';
    passwordError.textContent = '';
    formError.textContent = '';
}

// Превключва между режим "Вход" и "Регистрация"
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegister = !isRegister;
    if (isRegister) {
        // Ако сме в режим регистрация, сменяме заглавието и бутона
        formTitle.textContent = 'Регистрация';
        submitBtn.textContent = 'Регистрация';
        toggleText.innerHTML = 'Вече имате акаунт? <a href="#" id="toggle-link">Вход</a>';
    } else {
        // Ако сме в режим вход, сменяме заглавието и бутона
        formTitle.textContent = 'Вход';
        submitBtn.textContent = 'Вход';
        toggleText.innerHTML = 'Нямате акаунт? <a href="#" id="toggle-link">Регистрация</a>';
    }
    // Присвояваме отново event listener на новия линк
    document.getElementById('toggle-link').addEventListener('click', toggleLink.onclick);
    clearErrors();
    form.reset();
});

// Валидация на формата: проверява дали всички полета са попълнени и коректни
function validateForm(email, username, password) {
    let valid = true;
    clearErrors();

    // Проверка за имейл
    if (!email) {
        emailError.textContent = 'Въведете имейл';
        valid = false;
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        emailError.textContent = 'Невалиден имейл';
        valid = false;
    }
    // Проверка за потребителско име
    if (!username) {
        usernameError.textContent = 'Въведете потребителско име';
        valid = false;
    }
    // Проверка за парола
    if (!password) {
        passwordError.textContent = 'Въведете парола';
        valid = false;
    } else if (password.length < 4) {
        passwordError.textContent = 'Паролата трябва да е поне 4 символа';
        valid = false;
    }
    return valid;
}

// Основна логика за обработка на формата при вход или регистрация
form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!validateForm(email, username, password)) return;

    // Избери правилния URL според режима
    const url = isRegister ? '/api/register' : '/api/login';

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) {
            // Покажи грешка от сървъра
            if (data.error) {
                if (data.error.includes('Имейл')) emailError.textContent = data.error;
                else if (data.error.includes('Потребителското')) usernameError.textContent = data.error;
                else formError.textContent = data.error;
            } else {
                formError.textContent = 'Грешка при заявката';
            }
            return;
        }
        // Успешен вход/регистрация
        setCurrentUser({ email: data.email, username: data.username });
        window.location.href = 'chat.html';
    })
    .catch(() => {
        formError.textContent = 'Грешка при връзка със сървъра!';
    });
});