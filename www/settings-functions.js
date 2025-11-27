
// ==========================================
// SETTINGS & CONFIRMATION
// ==========================================

function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const nameInput = document.getElementById('settingsUserName');

    if (state.user) {
        nameInput.value = state.user.name || '';
    }

    modal.classList.add('active');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

function saveSettings() {
    const newName = document.getElementById('settingsUserName').value.trim();

    if (newName) {
        state.user.name = newName;
        localStorage.setItem('user', JSON.stringify(state.user));
        document.getElementById('headerUserName').textContent = newName;
        showNotification('Настройки сохранены! ✅');
        closeSettingsModal();
    }
}

function clearAllData() {
    showConfirmation(
        'Вы уверены, что хотите удалить ВСЕ данные? Это действие нельзя отменить.',
        () => {
            localStorage.clear();
            window.location.reload();
        },
        'Сбросить все'
    );
}

// Custom Confirmation Modal
let confirmCallback = null;

function showConfirmation(message, onConfirm, confirmText = 'Удалить') {
    const modal = document.getElementById('confirmationModal');
    const msgEl = document.getElementById('confirmMessage');
    const btnEl = document.getElementById('confirmBtnAction');

    msgEl.textContent = message;
    btnEl.textContent = confirmText;

    confirmCallback = onConfirm;

    btnEl.onclick = () => {
        if (confirmCallback) confirmCallback();
        closeConfirmationModal();
    };

    modal.classList.add('active');
}

function closeConfirmationModal() {
    document.getElementById('confirmationModal').classList.remove('active');
    confirmCallback = null;
}
