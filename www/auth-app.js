// ==========================================
// DOM ELEMENTS
// ==========================================

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

// ==========================================
// FORM SWITCHING
// ==========================================

function switchToRegister(e) {
    e.preventDefault();
    loginForm.classList.remove('form-visible');
    loginForm.classList.add('form-hidden');
    registerForm.classList.remove('form-hidden');
    registerForm.classList.add('form-visible');
}

function switchToLogin(e) {
    e.preventDefault();
    registerForm.classList.remove('form-visible');
    registerForm.classList.add('form-hidden');
    loginForm.classList.remove('form-hidden');
    loginForm.classList.add('form-visible');
}

showRegisterLink.addEventListener('click', switchToRegister);
showLoginLink.addEventListener('click', switchToLogin);

// ==========================================
// FORM VALIDATION
// ==========================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function showError(inputElement, message) {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.add('error');

    // Remove existing error message if any
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<span>⚠️</span> ${message}`;
    formGroup.appendChild(errorDiv);
}

function clearError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.remove('error');

    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearAllErrors(form) {
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

// ==========================================
// LOGIN FORM HANDLING
// ==========================================

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(loginForm);

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    // Validate email
    if (!email) {
        showError(emailInput, 'Email обязателен');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError(emailInput, 'Введите корректный email');
        hasError = true;
    }

    // Validate password
    if (!password) {
        showError(passwordInput, 'Пароль обязателен');
        hasError = true;
    } else if (!validatePassword(password)) {
        showError(passwordInput, 'Пароль должен содержать минимум 8 символов');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Show loading state
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;

    // Simulate API call
    try {
        await simulateLogin(email, password);

        // Success - show success message
        showSuccessMessage('Вход выполнен успешно! 🎉');

        // Clear form
        loginForm.reset();

        // Redirect to home page after 1 second
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);

    } catch (error) {
        showError(passwordInput, error.message);
    } finally {
        // Remove loading state
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
    }
});

// ==========================================
// REGISTRATION FORM HANDLING
// ==========================================

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(registerForm);

    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const submitButton = registerForm.querySelector('button[type="submit"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    let hasError = false;

    // Validate name
    if (!name) {
        showError(nameInput, 'Имя обязательно');
        hasError = true;
    } else if (name.length < 2) {
        showError(nameInput, 'Имя должно содержать минимум 2 символа');
        hasError = true;
    }

    // Validate email
    if (!email) {
        showError(emailInput, 'Email обязателен');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError(emailInput, 'Введите корректный email');
        hasError = true;
    }

    // Validate password
    if (!password) {
        showError(passwordInput, 'Пароль обязателен');
        hasError = true;
    } else if (!validatePassword(password)) {
        showError(passwordInput, 'Пароль должен содержать минимум 8 символов');
        hasError = true;
    }

    // Validate password confirmation
    if (!passwordConfirm) {
        showError(passwordConfirmInput, 'Подтвердите пароль');
        hasError = true;
    } else if (password !== passwordConfirm) {
        showError(passwordConfirmInput, 'Пароли не совпадают');
        hasError = true;
    }

    // Validate terms agreement
    if (!agreeTermsCheckbox.checked) {
        const checkboxGroup = agreeTermsCheckbox.closest('.checkbox-group');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message mt-sm';
        errorDiv.innerHTML = `<span>⚠️</span> Необходимо согласиться с условиями`;
        checkboxGroup.parentElement.insertBefore(errorDiv, checkboxGroup.nextSibling);
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Show loading state
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;

    // Simulate API call
    try {
        await simulateRegistration(name, email, password);

        // Store user data
        localStorage.setItem('user', JSON.stringify({
            name,
            email,
            registeredAt: new Date().toISOString()
        }));

        // Success - show success message
        showSuccessMessage('Регистрация успешна! 🎉 Перенаправление...');

        // Clear form
        registerForm.reset();

        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);

    } catch (error) {
        showError(emailInput, error.message);
    } finally {
        // Remove loading state
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
    }
});

// ==========================================
// INPUT VALIDATION ON BLUR
// ==========================================

// Add real-time validation
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim()) {
            clearError(input);
        }
    });

    input.addEventListener('input', () => {
        if (input.closest('.form-group').classList.contains('error')) {
            clearError(input);
        }
    });
});

// ==========================================
// API SIMULATION
// ==========================================

function simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful login
            // In a real app, this would be an actual API call
            if (email && password) {
                resolve({ success: true, user: { email } });
            } else {
                reject(new Error('Неверный email или пароль'));
            }
        }, 1500);
    });
}

function simulateRegistration(name, email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful registration
            // In a real app, this would be an actual API call

            // Simulate email already exists error (10% chance)
            if (Math.random() < 0.1) {
                reject(new Error('Этот email уже зарегистрирован'));
            } else {
                resolve({ success: true, user: { name, email } });
            }
        }, 1500);
    });
}

// ==========================================
// SUCCESS MESSAGE
// ==========================================

function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, hsl(142, 71%, 45%), hsl(142, 71%, 35%));
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.5s ease-out;
  `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(20px); }
  }
`;
document.head.appendChild(style);

// ==========================================
// INITIALIZE
// ==========================================

console.log('🚀 Auth App initialized successfully!');
console.log('📝 Features:');
console.log('  - Login form with validation');
console.log('  - Registration form with validation');
console.log('  - Smooth form switching');
console.log('  - Real-time error handling');
console.log('  - Beautiful animations');
console.log('  - Redirect to home page after registration');
