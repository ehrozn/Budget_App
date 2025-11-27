// ==========================================
// STATE MANAGEMENT
// ==========================================

let state = {
    user: null,
    accounts: [],
    transactions: [],
    recurringTransactions: [],
    smartTransfers: [], // Smart transfers between accounts
    categories: {
        expense: [
            { id: 'food', name: 'Еда и напитки', icon: '🍔', custom: false },
            { id: 'transport', name: 'Транспорт', icon: '🚗', custom: false },
            { id: 'housing', name: 'Жилье', icon: '🏠', custom: false },
            { id: 'utilities', name: 'Коммунальные услуги', icon: '💡', custom: false },
            { id: 'entertainment', name: 'Развлечения', icon: '🎬', custom: false },
            { id: 'shopping', name: 'Покупки', icon: '🛒', custom: false },
            { id: 'health', name: 'Здоровье', icon: '💊', custom: false },
            { id: 'education', name: 'Образование', icon: '📚', custom: false },
            { id: 'clothing', name: 'Одежда', icon: '👕', custom: false },
            { id: 'gifts', name: 'Подарки', icon: '🎁', custom: false },
            { id: 'travel', name: 'Путешествия', icon: '✈️', custom: false },
            { id: 'communication', name: 'Связь', icon: '📱', custom: false },
            { id: 'other', name: 'Другое', icon: '💰', custom: false }
        ],
        income: [
            { id: 'salary', name: 'Зарплата', icon: '💼', custom: false },
            { id: 'freelance', name: 'Фриланс', icon: '💵', custom: false },
            { id: 'gift', name: 'Подарок', icon: '🎁', custom: false },
            { id: 'investment', name: 'Инвестиции', icon: '📈', custom: false },
            { id: 'bonus', name: 'Бонус', icon: '🏆', custom: false },
            { id: 'other', name: 'Другое', icon: '💰', custom: false }
        ]
    },
    customCategories: {
        expense: [],
        income: []
    }
};

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
    // Load data from localStorage
    loadData();

    // Set user name in header
    if (state.user) {
        document.getElementById('headerUserName').textContent = state.user.name || 'Пользователь';
    } else {
        // No user, redirect to login
        window.location.href = 'auth-app.html';
        return;
    }

    // Inject modals dynamically to avoid encoding issues
    injectModals();

    // Set today's date as default for transaction form
    const today = new Date().toISOString().split('T')[0];
    const transactionDateInput = document.getElementById('transactionDate');
    if (transactionDateInput) {
        transactionDateInput.value = today;
    }

    // Setup transaction type change handler
    document.querySelectorAll('input[name="transactionType"]').forEach(radio => {
        radio.addEventListener('change', updateCategoryOptions);
    });

    // Render UI
    renderUI();

    // Check for scheduled transfers
    checkScheduledTransfers();
}

function injectModals() {
    const modalsHTML = `
    <!-- Create Account Modal -->
    <div class="modal" id="createAccountModal">
        <div class="modal-overlay" onclick="closeCreateAccountModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Создать счет</h3>
                <button class="modal-close" onclick="closeCreateAccountModal()">✕</button>
            </div>
            <form class="modal-body" id="createAccountForm" onsubmit="handleCreateAccount(event)">
                <div class="form-group">
                    <label class="form-label">Название счета *</label>
                    <input type="text" class="form-input" id="accountName" placeholder="Например: Основная карта" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Тип счета *</label>
                    <select class="form-input" id="accountType" required>
                        <option value="cash">💵 Наличные</option>
                        <option value="card" selected>💳 Карта</option>
                        <option value="savings">🏦 Сбережения</option>
                        <option value="other">💼 Другое</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Начальный баланс</label>
                    <input type="number" class="form-input" id="accountBalance" placeholder="0" step="0.01" value="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Валюта</label>
                    <select class="form-input" id="accountCurrency">
                        <option value="₽" selected>₽ Рубль</option>
                        <option value="$">$ Доллар</option>
                        <option value="€">€ Евро</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Цвет</label>
                    <div class="color-picker">
                        <input type="radio" name="accountColor" value="hsl(220, 90%, 56%)" id="color1" checked>
                        <label for="color1" class="color-option" style="background: hsl(220, 90%, 56%)"></label>
                        <input type="radio" name="accountColor" value="hsl(142, 71%, 45%)" id="color2">
                        <label for="color2" class="color-option" style="background: hsl(142, 71%, 45%)"></label>
                        <input type="radio" name="accountColor" value="hsl(262, 83%, 58%)" id="color3">
                        <label for="color3" class="color-option" style="background: hsl(262, 83%, 58%)"></label>
                        <input type="radio" name="accountColor" value="hsl(25, 95%, 53%)" id="color4">
                        <label for="color4" class="color-option" style="background: hsl(25, 95%, 53%)"></label>
                        <input type="radio" name="accountColor" value="hsl(0, 84%, 60%)" id="color5">
                        <label for="color5" class="color-option" style="background: hsl(0, 84%, 60%)"></label>
                        <input type="radio" name="accountColor" value="hsl(45, 93%, 47%)" id="color6">
                        <label for="color6" class="color-option" style="background: hsl(45, 93%, 47%)"></label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeCreateAccountModal()">Отмена</button>
                    <button type="submit" class="btn btn-primary">Создать счет</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Transaction Modal -->
    <div class="modal" id="addTransactionModal">
        <div class="modal-overlay" onclick="closeAddTransactionModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Добавить транзакцию</h3>
                <button class="modal-close" onclick="closeAddTransactionModal()">✕</button>
            </div>
            <form class="modal-body" id="addTransactionForm" onsubmit="handleAddTransaction(event)">
                <div class="form-group">
                    <label class="form-label">Тип *</label>
                    <div class="transaction-type-toggle">
                        <input type="radio" name="transactionType" value="expense" id="typeExpense" checked>
                        <label for="typeExpense" class="type-option type-expense"><span>📉</span> Расход</label>
                        <input type="radio" name="transactionType" value="income" id="typeIncome">
                        <label for="typeIncome" class="type-option type-income"><span>📈</span> Доход</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Счет *</label>
                    <select class="form-input" id="transactionAccount" required></select>
                </div>
                <div class="form-group">
                    <label class="form-label">Сумма *</label>
                    <input type="number" class="form-input" id="transactionAmount" placeholder="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Категория *</label>
                    <select class="form-input" id="transactionCategory" required></select>
                </div>
                <div class="form-group">
                    <label class="form-label">Описание</label>
                    <input type="text" class="form-input" id="transactionDescription" placeholder="Необязательно">
                </div>
                <div class="form-group">
                    <label class="form-label">Дата *</label>
                    <input type="date" class="form-input" id="transactionDate" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeAddTransactionModal()">Отмена</button>
                    <button type="submit" class="btn btn-primary">Добавить</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Pocket Modal -->
    <div class="modal" id="addPocketModal">
        <div class="modal-overlay" onclick="closeAddPocketModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Создать подсчет</h3>
                <button class="modal-close" onclick="closeAddPocketModal()">✕</button>
            </div>
            <form class="modal-body" id="addPocketForm" onsubmit="handleAddPocket(event)">
                <input type="hidden" id="pocketAccountId">
                <div class="form-group">
                    <label class="form-label">Название подсчета *</label>
                    <input type="text" class="form-input" id="pocketName" placeholder="Например: Накопления на отпуск" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Начальный баланс</label>
                    <input type="number" class="form-input" id="pocketInitialBalance" placeholder="0" step="0.01" value="0">
                    <small style="color: var(--color-text-muted); font-size: 0.875rem;">Будет переведено из основного баланса счета</small>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="pocketAutoAllocateEnabled" onchange="toggleAutoAllocateSettings()">
                        Автоматическое пополнение
                    </label>
                </div>
                <div id="autoAllocateSettings" style="display: none;">
                    <div class="form-group">
                        <label class="form-label">Тип пополнения</label>
                        <div class="transaction-type-toggle">
                            <input type="radio" name="pocketAllocationType" value="percentage" id="allocTypePercentage" checked>
                            <label for="allocTypePercentage" class="type-option"><span>%</span> Процент</label>
                            <input type="radio" name="pocketAllocationType" value="fixed" id="allocTypeFixed">
                            <label for="allocTypeFixed" class="type-option"><span>₽</span> Фиксированная сумма</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Значение</label>
                        <input type="number" class="form-input" id="pocketAllocateValue" placeholder="10" step="0.01" min="0">
                        <small style="color: var(--color-text-muted); font-size: 0.875rem;">Процент или фиксированная сумма для автоматического пополнения</small>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Источник</label>
                        <select class="form-input" id="pocketAllocateSource">
                            <option value="income">Только доходы</option>
                            <option value="all">Все транзакции</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeAddPocketModal()">Отмена</button>
                    <button type="submit" class="btn btn-primary">Создать подсчет</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Smart Transfer Modal -->
    <div class="modal" id="smartTransferModal">
        <div class="modal-overlay" onclick="closeSmartTransferModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Смарт-трансфер</h3>
                <button class="modal-close" onclick="closeSmartTransferModal()">✕</button>
            </div>
            <form class="modal-body" id="smartTransferForm" onsubmit="handleSmartTransfer(event)">
                <div class="form-group">
                    <label class="form-label">Название (для автоматизации)</label>
                    <input type="text" class="form-input" id="transferName" placeholder="Например: Откладывать 10% на инвестиции">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Откуда *</label>
                        <select class="form-input" id="transferFromAccount" required onchange="updateTransferToOptions()">
                            <!-- Options populated dynamically -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Куда *</label>
                        <select class="form-input" id="transferToAccount" required>
                            <!-- Options populated dynamically -->
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="transferAutomationEnabled" onchange="toggleTransferAutomation()">
                        Включить автоматизацию
                    </label>
                </div>

                <div id="transferAutomationSettings" style="display: none;">
                    <div class="form-group">
                        <label class="form-label">Тип автоматизации</label>
                        <div class="transaction-type-toggle">
                            <input type="radio" name="transferAmountType" value="percentage" id="transTypePercentage" checked>
                            <label for="transTypePercentage" class="type-option"><span>%</span> Процент</label>
                            <input type="radio" name="transferAmountType" value="fixed" id="transTypeFixed">
                            <label for="transTypeFixed" class="type-option"><span>₽</span> Фикс</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Значение</label>
                        <input type="number" class="form-input" id="transferAutomationValue" placeholder="10" step="0.01" min="0">
                        <small style="color: var(--color-text-muted); font-size: 0.875rem;">Процент от дохода или фиксированная сумма</small>
                    </div>
                </div>

                <div class="form-group" id="manualAmountGroup">
                    <label class="form-label">Сумма перевода *</label>
                    <input type="number" class="form-input" id="transferAmount" placeholder="0" step="0.01">
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeSmartTransferModal()">Отмена</button>
                    <button type="submit" class="btn btn-primary">Перевести</button>
                </div>
            </form>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalsHTML);
}

// ==========================================
// DATA PERSISTENCE
// ==========================================

function loadData() {
    // Load user
    const userData = localStorage.getItem('user');
    if (userData) {
        state.user = JSON.parse(userData);
    }

    // Load accounts
    const accountsData = localStorage.getItem('budgetAccounts');
    if (accountsData) {
        state.accounts = JSON.parse(accountsData);
    }

    // Load transactions
    const transactionsData = localStorage.getItem('budgetTransactions');
    if (transactionsData) {
        state.transactions = JSON.parse(transactionsData);
    }

    // Load recurring transactions
    const recurringData = localStorage.getItem('budgetRecurringTransactions');
    if (recurringData) {
        state.recurringTransactions = JSON.parse(recurringData);
    }
}

function saveData() {
    localStorage.setItem('budgetAccounts', JSON.stringify(state.accounts));
    localStorage.setItem('budgetTransactions', JSON.stringify(state.transactions));
    localStorage.setItem('budgetRecurringTransactions', JSON.stringify(state.recurringTransactions));
}

// ==========================================
// UI RENDERING
// ==========================================

function renderUI() {
    if (state.accounts.length === 0) {
        // Show empty state
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    } else {
        // Show dashboard
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';

        renderStats();
        renderAccounts();
        renderTransactions();
    }
}

function renderStats() {
    const totalBalance = calculateTotalBalance();
    const monthlyIncome = calculateMonthlyIncome();
    const monthlyExpense = calculateMonthlyExpense();

    document.getElementById('totalBalance').textContent = formatCurrency(totalBalance);
    document.getElementById('monthlyIncome').textContent = formatCurrency(monthlyIncome);
    document.getElementById('monthlyExpense').textContent = formatCurrency(monthlyExpense);
}

function renderAccounts() {
    const grid = document.getElementById('accountsGrid');

    if (state.accounts.length === 0) {
        grid.innerHTML = '<p class="empty-transactions">Нет счетов</p>';
        return;
    }

    grid.innerHTML = state.accounts.map(account => `
    <div class="account-card" style="--account-color: ${account.color}" onclick="viewAccount('${account.id}')">
      <div class="account-header">
        <div class="account-icon">${getAccountIcon(account.type)}</div>
        <div class="account-type">${getAccountTypeName(account.type)}</div>
      </div>
      <div class="account-name">${account.name}</div>
      <div class="account-balance">${formatCurrency(account.balance)} ${account.currency}</div>
      <div class="account-actions" onclick="event.stopPropagation()">
        <button class="btn-icon-small" onclick="editAccount('${account.id}')" title="Редактировать">
          ✏️
        </button>
        <button class="btn-icon-small btn-delete" onclick="deleteAccount('${account.id}')" title="Удалить">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function viewAccount(accountId) {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return;

    // Get all transactions for this account
    const accountTransactions = state.transactions
        .filter(t => t.accountId === accountId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate account statistics
    const totalIncome = accountTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = accountTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total in pockets
    const totalInPockets = account.pockets?.reduce((sum, p) => sum + p.balance, 0) || 0;

    // Create pockets HTML
    const pocketsHTML = account.pockets && account.pockets.length > 0 ? `
        <h4 style="margin: var(--spacing-lg) 0 var(--spacing-md) 0;">
            Подсчеты (${account.pockets.length})
            <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openAddPocketModal('${account.id}')" style="float: right; font-size: 0.875rem; padding: 0.5rem 1rem;">
                ➕ Добавить подсчет
            </button>
        </h4>
        <div class="pockets-list" style="display: grid; gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
            ${account.pockets.map(pocket => `
                <div class="pocket-item" style="background: var(--color-bg-secondary); padding: var(--spacing-md); border-radius: var(--border-radius); border-left: 4px solid ${account.color};">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; margin-bottom: 0.25rem;">🏦 ${pocket.name}</div>
                            <div style="font-size: 1.25rem; font-weight: 700; color: ${account.color};">
                                ${formatCurrency(pocket.balance)} ${account.currency}
                            </div>
                            ${pocket.autoAllocate.enabled ? `
                                <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.5rem;">
                                    📊 Авто: ${pocket.autoAllocate.type === 'percentage' ?
                `${pocket.autoAllocate.value}%` :
                `${formatCurrency(pocket.autoAllocate.value)} ${account.currency}`
            } от ${pocket.autoAllocate.source === 'income' ? 'доходов' : 'всех транзакций'}
                                </div>
                            ` : ''}
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-icon-small" onclick="event.stopPropagation(); deletePocket('${account.id}', '${pocket.id}')" title="Удалить">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    ` : `
        <h4 style="margin: var(--spacing-lg) 0 var(--spacing-md) 0;">
            Подсчеты
            <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openAddPocketModal('${account.id}')" style="float: right; font-size: 0.875rem; padding: 0.5rem 1rem;">
                ➕ Создать первый подсчет
            </button>
        </h4>
        <div style="text-align: center; padding: var(--spacing-lg); color: var(--color-text-muted);">
            <p>Создайте подсчеты для накоплений, налогов или других целей</p>
        </div>
    `;

    // Create modal HTML
    const modalHTML = `
        <div class="modal active" id="accountDetailsModal" style="z-index: 2000;">
            <div class="modal-overlay" onclick="closeAccountDetails()"></div>
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3 class="modal-title">${getAccountIcon(account.type)} ${account.name}</h3>
                    <button class="modal-close" onclick="closeAccountDetails()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="account-details-stats">
                        <div class="account-detail-card">
                            <div class="account-detail-label">Основной баланс</div>
                            <div class="account-detail-value" style="color: ${account.color}">
                                ${formatCurrency(account.balance)} ${account.currency}
                            </div>
                        </div>
                        <div class="account-detail-card">
                            <div class="account-detail-label">В подсчетах</div>
                            <div class="account-detail-value" style="color: var(--color-info)">
                                ${formatCurrency(totalInPockets)} ${account.currency}
                            </div>
                        </div>
                        <div class="account-detail-card">
                            <div class="account-detail-label">Всего доходов</div>
                            <div class="account-detail-value" style="color: var(--color-success)">
                                +${formatCurrency(totalIncome)} ${account.currency}
                            </div>
                        </div>
                        <div class="account-detail-card">
                            <div class="account-detail-label">Всего расходов</div>
                            <div class="account-detail-value" style="color: var(--color-danger)">
                                -${formatCurrency(totalExpense)} ${account.currency}
                            </div>
                        </div>
                    </div>
                    
                    ${pocketsHTML}
                    
                    <h4 style="margin: var(--spacing-lg) 0 var(--spacing-md) 0;">
                        Транзакции (${accountTransactions.length})
                    </h4>
                    
                    <div class="account-transactions-list">
                        ${accountTransactions.length === 0 ?
            '<div class="empty-transactions"><p>Нет транзакций по этому счету</p></div>' :
            accountTransactions.map(transaction => {
                const category = getCategoryById(transaction.category, transaction.type);
                return `
                                    <div class="transaction-item">
                                        <div class="transaction-icon">${category?.icon || '💰'}</div>
                                        <div class="transaction-info">
                                            <div class="transaction-category">${category?.name || 'Неизвестно'}</div>
                                            <div class="transaction-description">${transaction.description || ''}</div>
                                        </div>
                                        <div class="transaction-amount-wrapper">
                                            <div class="transaction-amount ${transaction.type}">
                                                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
                                            </div>
                                            <div class="transaction-date">${formatDate(transaction.date)}</div>
                                        </div>
                                    </div>
                                `;
            }).join('')
        }
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeAccountDetails()">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('accountDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeAccountDetails() {
    const modal = document.getElementById('accountDetailsModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}


function renderTransactions() {
    const list = document.getElementById('transactionsList');

    if (state.transactions.length === 0) {
        list.innerHTML = '<div class="empty-transactions"><p>Нет транзакций</p></div>';
        return;
    }

    // Get last 10 transactions
    const recentTransactions = [...state.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

    list.innerHTML = recentTransactions.map(transaction => {
        const category = getCategoryById(transaction.category, transaction.type);
        const account = state.accounts.find(a => a.id === transaction.accountId);

        return `
      <div class="transaction-item">
        <div class="transaction-icon">${category?.icon || '💰'}</div>
        <div class="transaction-info">
          <div class="transaction-category">${category?.name || 'Неизвестно'}</div>
          <div class="transaction-description">${transaction.description || account?.name || ''}</div>
        </div>
        <div class="transaction-amount-wrapper">
          <div class="transaction-amount ${transaction.type}">
            ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
          </div>
          <div class="transaction-date">${formatDate(transaction.date)}</div>
        </div>
        <div class="transaction-actions">
          <button class="btn-icon-small" onclick="editTransaction('${transaction.id}')" title="Редактировать">
            ✏️
          </button>
          <button class="btn-icon-small btn-delete" onclick="deleteTransaction('${transaction.id}')" title="Удалить">
            🗑️
          </button>
        </div>
      </div>
    `;
    }).join('');
}

// ==========================================
// ACCOUNT MANAGEMENT
// ==========================================

function openCreateAccountModal() {
    document.getElementById('createAccountModal').classList.add('active');
    document.getElementById('createAccountForm').reset();

    // Reset editing state
    delete window.editingAccountId;

    // Set modal title and button
    document.querySelector('#createAccountModal .modal-title').textContent = 'Создать счет';
    document.querySelector('#createAccountForm button[type="submit"]').textContent = 'Создать счет';
}

function closeCreateAccountModal() {
    document.getElementById('createAccountModal').classList.remove('active');
    document.getElementById('createAccountForm').reset();

    // Reset editing state
    if (window.editingAccountId) {
        delete window.editingAccountId;

        // Reset modal title and button
        document.querySelector('#createAccountModal .modal-title').textContent = 'Создать счет';
        document.querySelector('#createAccountForm button[type="submit"]').textContent = 'Создать счет';
    }
}

function handleCreateAccount(event) {
    event.preventDefault();

    const name = document.getElementById('accountName').value.trim();
    const type = document.getElementById('accountType').value;
    const balance = parseFloat(document.getElementById('accountBalance').value) || 0;
    const currency = document.getElementById('accountCurrency').value;
    const color = document.querySelector('input[name="accountColor"]:checked').value;

    // Check if we're editing
    if (window.editingAccountId) {
        // Edit mode
        const account = state.accounts.find(a => a.id === window.editingAccountId);

        if (account) {
            account.name = name;
            account.type = type;
            account.balance = balance;
            account.currency = currency;
            account.color = color;

            showNotification('Счет обновлен! ✅');
        }

        // Clear editing state
        delete window.editingAccountId;

        // Reset modal
        document.querySelector('#createAccountModal .modal-title').textContent = 'Создать счет';
        document.querySelector('#createAccountForm button[type="submit"]').textContent = 'Создать счет';
    } else {
        // Create mode
        const account = {
            id: generateId(),
            name,
            type,
            balance,
            currency,
            color,
            createdAt: new Date().toISOString(),
            pockets: [] // Sub-accounts for savings, taxes, etc.
        };

        state.accounts.push(account);
        showNotification('Счет успешно создан! 🎉');
    }

    saveData();
    renderUI();
    closeCreateAccountModal();
}

function editAccount(accountId) {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return;

    // Store the account being edited
    window.editingAccountId = accountId;

    // Open modal
    document.getElementById('createAccountModal').classList.add('active');

    // Change modal title
    document.querySelector('#createAccountModal .modal-title').textContent = 'Редактировать счет';

    // Change button text
    const submitBtn = document.querySelector('#createAccountForm button[type="submit"]');
    submitBtn.textContent = 'Сохранить';

    // Fill form with account data
    document.getElementById('accountName').value = account.name;
    document.getElementById('accountType').value = account.type;
    document.getElementById('accountBalance').value = account.balance;
    document.getElementById('accountCurrency').value = account.currency;

    // Set color
    const colorRadio = document.querySelector(`input[name="accountColor"][value="${account.color}"]`);
    if (colorRadio) {
        colorRadio.checked = true;
    }
}

function deleteAccount(accountId) {
    // Remove account
    state.accounts = state.accounts.filter(a => a.id !== accountId);

    // Remove associated transactions
    state.transactions = state.transactions.filter(t => t.accountId !== accountId);

    saveData();
    renderUI();

    showNotification('Счет удален! 🗑️');
}

// ==========================================
// TRANSACTION MANAGEMENT
// ==========================================

function openAddTransactionModal() {
    if (state.accounts.length === 0) {
        showNotification('Сначала создайте счет!', 'warning');
        return;
    }

    document.getElementById('addTransactionModal').classList.add('active');
    document.getElementById('addTransactionForm').reset();

    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('transactionDate').value = today;

    // Populate account options
    updateAccountOptions();

    // Populate category options
    updateCategoryOptions();
}

function closeAddTransactionModal() {
    document.getElementById('addTransactionModal').classList.remove('active');
    document.getElementById('addTransactionForm').reset();

    // Reset editing state if it exists
    if (window.editingTransactionId) {
        delete window.editingTransactionId;
        delete window.originalTransaction;

        // Reset modal title and button
        document.querySelector('#addTransactionModal .modal-title').textContent = 'Добавить транзакцию';
        document.querySelector('#addTransactionForm button[type="submit"]').textContent = 'Добавить';
    }
}

function updateAccountOptions() {
    const select = document.getElementById('transactionAccount');
    select.innerHTML = state.accounts.map(account =>
        `<option value="${account.id}">${getAccountIcon(account.type)} ${account.name}</option>`
    ).join('');
}

function updateCategoryOptions() {
    const type = document.querySelector('input[name="transactionType"]:checked').value;
    const select = document.getElementById('transactionCategory');

    const categories = state.categories[type];
    select.innerHTML = categories.map(cat =>
        `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
    ).join('');
}

function handleAddTransaction(event) {
    event.preventDefault();

    const type = document.querySelector('input[name="transactionType"]:checked').value;
    const accountId = document.getElementById('transactionAccount').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const category = document.getElementById('transactionCategory').value;
    const description = document.getElementById('transactionDescription').value.trim();
    const date = document.getElementById('transactionDate').value;

    if (!amount || amount <= 0) {
        showNotification('Введите корректную сумму', 'error');
        return;
    }

    // Check if we're editing
    if (window.editingTransactionId) {
        // Edit mode
        const transaction = state.transactions.find(t => t.id === window.editingTransactionId);
        const originalTransaction = window.originalTransaction;

        if (transaction) {
            // Revert old balance change
            const account = state.accounts.find(a => a.id === originalTransaction.accountId);
            if (account) {
                if (originalTransaction.type === 'income') {
                    account.balance -= originalTransaction.amount;
                } else {
                    account.balance += originalTransaction.amount;
                }
            }

            // Update transaction
            transaction.accountId = accountId;
            transaction.type = type;
            transaction.amount = amount;
            transaction.category = category;
            transaction.description = description;
            transaction.date = date;

            // Apply new balance change
            const newAccount = state.accounts.find(a => a.id === accountId);
            if (newAccount) {
                if (type === 'income') {
                    newAccount.balance += amount;
                } else {
                    newAccount.balance -= amount;
                }
            }

            showNotification('Транзакция обновлена! ✅');
        }

        // Clear editing state
        delete window.editingTransactionId;
        delete window.originalTransaction;

        // Reset modal
        document.querySelector('#addTransactionModal .modal-title').textContent = 'Добавить транзакцию';
        document.querySelector('#addTransactionForm button[type="submit"]').textContent = 'Добавить';
    } else {
        // Add mode
        const transaction = {
            id: generateId(),
            accountId,
            type,
            amount,
            category,
            description,
            date,
            createdAt: new Date().toISOString()
        };

        state.transactions.push(transaction);

        // Update account balance
        const account = state.accounts.find(a => a.id === accountId);
        if (account) {
            if (type === 'income') {
                account.balance += amount;
                // Automatically allocate to pockets if configured
                allocateToPockets(accountId, amount, type);
                // Process automatic transfers
                processAutomaticTransfers(accountId, amount, type);
            } else {
                account.balance -= amount;
            }
        }

        showNotification(
            type === 'income' ? 'Доход добавлен! 📈' : 'Расход добавлен! 📉'
        );
    }

    saveData();
    renderUI();
    closeAddTransactionModal();
}

// Edit transaction
function editTransaction(transactionId) {
    const transaction = state.transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    // Store the transaction being edited
    window.editingTransactionId = transactionId;
    window.originalTransaction = { ...transaction };

    // Open modal
    document.getElementById('addTransactionModal').classList.add('active');

    // Change modal title
    document.querySelector('#addTransactionModal .modal-title').textContent = 'Редактировать транзакцию';

    // Change button text
    const submitBtn = document.querySelector('#addTransactionForm button[type="submit"]');
    submitBtn.textContent = 'Сохранить';

    // Fill form with transaction data
    document.querySelector(`input[name="transactionType"][value="${transaction.type}"]`).checked = true;

    // Populate accounts and categories
    updateAccountOptions();
    updateCategoryOptions();

    // Set values
    document.getElementById('transactionAccount').value = transaction.accountId;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('transactionCategory').value = transaction.category;
    document.getElementById('transactionDescription').value = transaction.description || '';
    document.getElementById('transactionDate').value = transaction.date;
}

// Delete transaction
function deleteTransaction(transactionId) {
    const transaction = state.transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    // Revert balance change
    const account = state.accounts.find(a => a.id === transaction.accountId);
    if (account) {
        if (transaction.type === 'income') {
            account.balance -= transaction.amount;
        } else {
            account.balance += transaction.amount;
        }
    }

    // Remove transaction
    state.transactions = state.transactions.filter(t => t.id !== transactionId);

    saveData();
    renderUI();

    showNotification('Транзакция удалена! 🗑️');
}

// ==========================================
// CALCULATIONS
// ==========================================

function calculateTotalBalance() {
    return state.accounts.reduce((sum, account) => sum + account.balance, 0);
}

function calculateMonthlyIncome() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return state.transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'income' &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function calculateMonthlyExpense() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return state.transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'expense' &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Вчера';
    } else {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short'
        });
    }
}

function getAccountIcon(type) {
    const icons = {
        cash: '💵',
        card: '💳',
        savings: '🏦',
        other: '💼'
    };
    return icons[type] || '💼';
}

function getAccountTypeName(type) {
    const names = {
        cash: 'Наличные',
        card: 'Карта',
        savings: 'Сбережения',
        other: 'Другое'
    };
    return names[type] || 'Другое';
}

function getCategoryById(id, type) {
    return state.categories[type]?.find(cat => cat.id === id);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, hsl(142, 71%, 45%), hsl(142, 71%, 35%))' :
            type === 'error' ? 'linear-gradient(135deg, hsl(0, 84%, 60%), hsl(0, 84%, 50%))' :
                'linear-gradient(135deg, hsl(45, 93%, 47%), hsl(45, 93%, 37%))'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    font-weight: 600;
    z-index: 2000;
    animation: slideIn 0.5s ease-out;
  `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==========================================
// POCKET (SUB-ACCOUNT) MANAGEMENT
// ==========================================

function createPocket(accountId, pocketData) {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) {
        showNotification('Счет не найден', 'error');
        return null;
    }

    const pocket = {
        id: generateId(),
        name: pocketData.name,
        balance: pocketData.initialBalance || 0,
        autoAllocate: {
            enabled: pocketData.autoAllocate?.enabled || false,
            type: pocketData.autoAllocate?.type || 'percentage', // 'percentage' or 'fixed'
            value: pocketData.autoAllocate?.value || 0,
            source: pocketData.autoAllocate?.source || 'income' // 'income' or 'all'
        },
        createdAt: new Date().toISOString()
    };

    // Initialize pockets array if it doesn't exist (for old accounts)
    if (!account.pockets) {
        account.pockets = [];
    }

    // Transfer initial balance from main account to pocket
    if (pocket.balance > 0) {
        if (account.balance >= pocket.balance) {
            account.balance -= pocket.balance;
        } else {
            showNotification('Недостаточно средств на счете', 'error');
            return null;
        }
    }

    account.pockets.push(pocket);
    saveData();
    renderUI();

    showNotification(`Подсчет "${pocket.name}" создан! 🏦`);
    return pocket;
}

function updatePocket(accountId, pocketId, updates) {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return false;

    const pocket = account.pockets?.find(p => p.id === pocketId);
    if (!pocket) return false;

    // Update pocket properties
    if (updates.name) pocket.name = updates.name;
    if (updates.autoAllocate) {
        pocket.autoAllocate = { ...pocket.autoAllocate, ...updates.autoAllocate };
    }

    saveData();
    renderUI();
    showNotification('Подсчет обновлен! ✅');
    return true;
}

function deletePocket(accountId, pocketId) {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return false;

    const pocketIndex = account.pockets?.findIndex(p => p.id === pocketId);
    if (pocketIndex === -1) return false;

    const pocket = account.pockets[pocketIndex];

    // Return pocket balance to main account
    account.balance += pocket.balance;

    // Remove pocket
    account.pockets.splice(pocketIndex, 1);

    saveData();
    renderUI();
    showNotification('Подсчет удален! 🗑️');
    return true;
}

function transferToPocket(accountId, pocketId, amount) {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return false;

    const pocket = account.pockets?.find(p => p.id === pocketId);
    if (!pocket) return false;

    if (account.balance < amount) {
        showNotification('Недостаточно средств на счете', 'error');
        return false;
    }

    account.balance -= amount;
    pocket.balance += amount;

    saveData();
    renderUI();
    showNotification(`Переведено ${formatCurrency(amount)} в "${pocket.name}" 💸`);
    return true;
}

function transferFromPocket(accountId, pocketId, amount) {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return false;

    const pocket = account.pockets?.find(p => p.id === pocketId);
    if (!pocket) return false;

    if (pocket.balance < amount) {
        showNotification('Недостаточно средств в подсчете', 'error');
        return false;
    }

    pocket.balance -= amount;
    account.balance += amount;

    saveData();
    renderUI();
    showNotification(`Переведено ${formatCurrency(amount)} из "${pocket.name}" 💸`);
    return true;
}

// Automatic allocation to pockets when income is added
function allocateToPockets(accountId, transactionAmount, transactionType) {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account || !account.pockets || account.pockets.length === 0) return;

    // Only allocate for income transactions or if pocket accepts all transactions
    account.pockets.forEach(pocket => {
        if (!pocket.autoAllocate.enabled) return;

        // Check if this pocket should receive allocation from this transaction type
        if (pocket.autoAllocate.source === 'income' && transactionType !== 'income') return;

        let allocationAmount = 0;

        if (pocket.autoAllocate.type === 'percentage') {
            allocationAmount = (transactionAmount * pocket.autoAllocate.value) / 100;
        } else if (pocket.autoAllocate.type === 'fixed') {
            allocationAmount = pocket.autoAllocate.value;
        }

        // Only allocate if there's enough balance
        if (allocationAmount > 0 && account.balance >= allocationAmount) {
            account.balance -= allocationAmount;
            pocket.balance += allocationAmount;

            // Create expense transaction for tracking
            const transaction = {
                id: generateId(),
                accountId: accountId,
                type: 'expense',
                amount: allocationAmount,
                category: 'Копилка',
                description: `Авто-пополнение: ${pocket.name}`,
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            };
            state.transactions.push(transaction);

            console.log(`Auto-allocated ${formatCurrency(allocationAmount)} to pocket "${pocket.name}"`);
        }
    });

    saveData();
}

// ==========================================
// SMART TRANSFER MANAGEMENT
// ==========================================

function createSmartTransfer(transferData) {
    const transfer = {
        id: generateId(),
        name: transferData.name,
        fromAccountId: transferData.fromAccountId,
        toAccountId: transferData.toAccountId,
        type: transferData.type || 'manual', // 'manual' or 'automatic'
        automation: {
            enabled: transferData.automation?.enabled || false,
            trigger: transferData.automation?.trigger || 'income', // 'income' or 'schedule'
            amountType: transferData.automation?.amountType || 'percentage', // 'percentage' or 'fixed'
            amount: transferData.automation?.amount || 0,
            schedule: transferData.automation?.schedule || null
        },
        createdAt: new Date().toISOString(),
        lastExecuted: null
    };

    state.smartTransfers.push(transfer);
    saveData();

    showNotification(`Смарт-трансфер "${transfer.name}" создан! 🔄`);
    return transfer;
}

function executeTransfer(transferId, amount = null) {
    const transfer = state.smartTransfers.find(t => t.id === transferId);
    if (!transfer) {
        showNotification('Трансфер не найден', 'error');
        return false;
    }

    const fromAccount = state.accounts.find(a => a.id === transfer.fromAccountId);
    const toAccount = state.accounts.find(a => a.id === transfer.toAccountId);

    if (!fromAccount || !toAccount) {
        showNotification('Один из счетов не найден', 'error');
        return false;
    }

    // Calculate transfer amount if not provided
    let transferAmount = amount;
    if (!transferAmount && transfer.automation.enabled) {
        if (transfer.automation.amountType === 'fixed') {
            transferAmount = transfer.automation.amount;
        }
        // For percentage, amount should be provided based on transaction
    }

    if (!transferAmount || transferAmount <= 0) {
        showNotification('Некорректная сумма трансфера', 'error');
        return false;
    }

    if (fromAccount.balance < transferAmount) {
        showNotification('Недостаточно средств на счете отправителя', 'error');
        return false;
    }

    // Execute transfer
    fromAccount.balance -= transferAmount;
    toAccount.balance += transferAmount;

    // Create expense transaction for tracking
    const transaction = {
        id: generateId(),
        accountId: fromAccount.id,
        type: 'expense',
        amount: transferAmount,
        category: 'Перевод',
        description: `Перевод на: ${toAccount.name}`,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };
    state.transactions.push(transaction);

    // Update last executed time
    transfer.lastExecuted = new Date().toISOString();

    saveData();
    renderUI();

    showNotification(
        `Переведено ${formatCurrency(transferAmount)} из "${fromAccount.name}" в "${toAccount.name}" 💸`
    );
    return true;
}

function processAutomaticTransfers(accountId, transactionAmount, transactionType) {
    // Find all automatic transfers that should be triggered
    const activeTransfers = state.smartTransfers.filter(transfer =>
        transfer.automation.enabled &&
        transfer.automation.trigger === 'income' &&
        transfer.fromAccountId === accountId &&
        transactionType === 'income'
    );

    activeTransfers.forEach(transfer => {
        let transferAmount = 0;

        if (transfer.automation.amountType === 'percentage') {
            transferAmount = (transactionAmount * transfer.automation.amount) / 100;
        } else if (transfer.automation.amountType === 'fixed') {
            transferAmount = transfer.automation.amount;
        }

        if (transferAmount > 0) {
            executeTransfer(transfer.id, transferAmount);
        }
    });
}

function checkScheduledTransfers() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    state.smartTransfers.forEach(transfer => {
        if (!transfer.automation.enabled || transfer.automation.trigger !== 'schedule') return;

        const lastExecuted = transfer.lastExecuted ? new Date(transfer.lastExecuted) : null;
        let shouldExecute = false;

        if (!lastExecuted) {
            // Never executed, execute now
            shouldExecute = true;
        } else {
            const nextDate = new Date(lastExecuted);

            switch (transfer.automation.schedule) {
                case 'daily':
                    nextDate.setDate(nextDate.getDate() + 1);
                    break;
                case 'weekly':
                    nextDate.setDate(nextDate.getDate() + 7);
                    break;
                case 'monthly':
                    nextDate.setMonth(nextDate.getMonth() + 1);
                    break;
            }

            if (now >= nextDate) {
                shouldExecute = true;
            }
        }

        if (shouldExecute) {
            let transferAmount = 0;
            if (transfer.automation.amountType === 'fixed') {
                transferAmount = transfer.automation.amount;
            }
            // Percentage doesn't make sense for scheduled without a source transaction, 
            // unless it's percentage of balance? For now assume fixed.

            if (transferAmount > 0) {
                console.log(`Executing scheduled transfer: ${transfer.name}`);
                executeTransfer(transfer.id, transferAmount);
            }
        }
    });
}

function deleteSmartTransfer(transferId) {
    state.smartTransfers = state.smartTransfers.filter(t => t.id !== transferId);
    saveData();
    showNotification('Смарт-трансфер удален! 🗑️');
    return true;
}

function updateSmartTransfer(transferId, updates) {
    const transfer = state.smartTransfers.find(t => t.id === transferId);
    if (!transfer) return false;

    // Update transfer properties
    if (updates.name) transfer.name = updates.name;
    if (updates.automation) {
        transfer.automation = { ...transfer.automation, ...updates.automation };
    }

    saveData();
    showNotification('Смарт-трансфер обновлен! ✅');
    return true;
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('user');
        window.location.href = 'auth-app.html';
    }
}

// ==========================================
// POCKET MODAL FUNCTIONS
// ==========================================

function openAddPocketModal(accountId) {
    document.getElementById('addPocketModal').classList.add('active');
    document.getElementById('addPocketForm').reset();
    document.getElementById('pocketAccountId').value = accountId;
    document.getElementById('autoAllocateSettings').style.display = 'none';
}

function closeAddPocketModal() {
    document.getElementById('addPocketModal').classList.remove('active');
    document.getElementById('addPocketForm').reset();
}

function toggleAutoAllocateSettings() {
    const enabled = document.getElementById('pocketAutoAllocateEnabled').checked;
    document.getElementById('autoAllocateSettings').style.display = enabled ? 'block' : 'none';
}

function handleAddPocket(event) {
    event.preventDefault();

    const accountId = document.getElementById('pocketAccountId').value;
    const name = document.getElementById('pocketName').value.trim();
    const initialBalance = parseFloat(document.getElementById('pocketInitialBalance').value) || 0;
    const autoAllocateEnabled = document.getElementById('pocketAutoAllocateEnabled').checked;

    const pocketData = {
        name,
        initialBalance,
        autoAllocate: {
            enabled: autoAllocateEnabled,
            type: autoAllocateEnabled ?
                document.querySelector('input[name="pocketAllocationType"]:checked').value : 'percentage',
            value: autoAllocateEnabled ?
                parseFloat(document.getElementById('pocketAllocateValue').value) || 0 : 0,
            source: autoAllocateEnabled ?
                document.getElementById('pocketAllocateSource').value : 'income'
        }
    };

    const pocket = createPocket(accountId, pocketData);
    if (pocket) {
        closeAddPocketModal();
        // Refresh account details if modal is open
        if (document.getElementById('accountDetailsModal')) {
            closeAccountDetails();
            viewAccount(accountId);
        }
    }
}

// ==========================================
// SMART TRANSFER MODAL FUNCTIONS
// ==========================================

function openSmartTransferModal() {
    if (state.accounts.length < 2) {
        showNotification('Для перевода нужно минимум 2 счета', 'warning');
        return;
    }

    document.getElementById('smartTransferModal').classList.add('active');
    document.getElementById('smartTransferForm').reset();
    document.getElementById('transferAutomationSettings').style.display = 'none';
    document.getElementById('manualAmountGroup').style.display = 'block';

    // Populate account options
    const fromSelect = document.getElementById('transferFromAccount');
    fromSelect.innerHTML = state.accounts.map(account =>
        `<option value="${account.id}">${getAccountIcon(account.type)} ${account.name} (${formatCurrency(account.balance)})</option>`
    ).join('');

    updateTransferToOptions();
}

function closeSmartTransferModal() {
    document.getElementById('smartTransferModal').classList.remove('active');
    document.getElementById('smartTransferForm').reset();
}

function toggleTransferAutomation() {
    const enabled = document.getElementById('transferAutomationEnabled').checked;
    document.getElementById('transferAutomationSettings').style.display = enabled ? 'block' : 'none';

    // If automation is enabled, manual amount might not be needed if it's percentage based
    // But for simplicity, we keep manual amount for immediate transfer if desired
    // Or we can say: if automation is enabled, this creates a rule. If not, it's a one-time transfer.

    // Let's clarify: The form can be used for ONE-TIME transfer OR creating an AUTOMATION rule.
    // If automation is checked, we create a rule. If not, we execute transfer immediately.

    const submitBtn = document.querySelector('#smartTransferForm button[type="submit"]');
    if (enabled) {
        submitBtn.textContent = 'Создать правило';
        document.getElementById('manualAmountGroup').style.display = 'none';
        document.getElementById('transferName').required = true;
    } else {
        submitBtn.textContent = 'Перевести';
        document.getElementById('manualAmountGroup').style.display = 'block';
        document.getElementById('transferName').required = false;
    }
}

function updateTransferToOptions() {
    const fromId = document.getElementById('transferFromAccount').value;
    const toSelect = document.getElementById('transferToAccount');

    toSelect.innerHTML = state.accounts
        .filter(a => a.id !== fromId)
        .map(account =>
            `<option value="${account.id}">${getAccountIcon(account.type)} ${account.name}</option>`
        ).join('');
}

function handleSmartTransfer(event) {
    event.preventDefault();

    const fromAccountId = document.getElementById('transferFromAccount').value;
    const toAccountId = document.getElementById('transferToAccount').value;
    const automationEnabled = document.getElementById('transferAutomationEnabled').checked;

    if (automationEnabled) {
        // Create automation rule
        const name = document.getElementById('transferName').value.trim();
        const amountType = document.querySelector('input[name="transferAmountType"]:checked').value;
        const amount = parseFloat(document.getElementById('transferAutomationValue').value);

        if (!name) {
            showNotification('Введите название для правила', 'error');
            return;
        }

        const transferData = {
            name,
            fromAccountId,
            toAccountId,
            type: 'automatic',
            automation: {
                enabled: true,
                trigger: 'income', // Default to income trigger for now
                amountType,
                amount
            }
        };

        createSmartTransfer(transferData);
    } else {
        // Execute one-time transfer
        const amount = parseFloat(document.getElementById('transferAmount').value);

        if (!amount || amount <= 0) {
            showNotification('Введите корректную сумму', 'error');
            return;
        }

        // Create a record of this manual transfer
        if (state.accounts.find(a => a.id === fromAccountId).balance < amount) {
            showNotification('Недостаточно средств', 'error');
            return;
        }

        const fromAccount = state.accounts.find(a => a.id === fromAccountId);
        const toAccount = state.accounts.find(a => a.id === toAccountId);

        fromAccount.balance -= amount;
        toAccount.balance += amount;

        // Create expense transaction for tracking
        const transaction = {
            id: generateId(),
            accountId: fromAccount.id,
            type: 'expense',
            amount: amount,
            category: 'Перевод',
            description: `Перевод на: ${toAccount.name}`,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        state.transactions.push(transaction);

        saveData();
        renderUI();
        showNotification(`Переведено ${formatCurrency(amount)} 💸`);
    }

    closeSmartTransferModal();
}

// ==========================================
// INITIALIZE APP
// ==========================================

document.addEventListener('DOMContentLoaded', init);

console.log('💰 Budget App initialized!');
