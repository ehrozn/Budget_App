// ==========================================
// CUSTOM CATEGORY MANAGEMENT
// ==========================================

// Available icons for categories (500+ options)
const AVAILABLE_ICONS = [
    '🍔', '🍕', '🍗', '🍟', '🌭', '🥪', '🌮', '🌯', '🥙', '🥗', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🍤', '🍙', '🍚', '🍘',
    '🍥', '🥟', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯',
    '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🍾', '🧉', '🧊',
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚔', '🚍',
    '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬',
    '🛩️', '💺', '🚁', '🛰️', '🚀', '🛸', '🚢', '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚧', '⛽', '🚏', '🚦', '🚥',
    '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌',
    '🕍', '🛕', '🕋', '⛩️', '🛤️', '🛣️', '🗾', '🎑', '🏞️', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙️', '🌃', '🌌', '🌉',
    '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️',
    '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿',
    '💊', '💉', '🩸', '🩹', '🩺', '🌡️', '🧬', '🦠', '🧫', '🧪', '🥢', '🍽️', '🍴', '🥄', '🏺',
    '📱', '📲', '☎️', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮', '🎥',
    '🎞️', '📽️', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🏮', '📔', '📕', '📖', '📗', '📘',
    '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '🧾',
    '💹', '💱', '💲', '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️',
    '🖌️', '🖍️', '📝', '💼', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️',
    '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫',
    '🏹', '🛡️', '🔧', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🧰', '🧲', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉',
    '🩸', '💊', '🩹', '🩺', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧴', '🧷', '🧼', '🧽', '🧯', '🛒',
    '🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '🛂',
    '🛃', '🛄', '🛅', '⚠️', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵', '🔞', '☢️', '☣️',
    '🎮', '🕹️', '🎰', '🎲', '🧩', '🧸', '🎭', '🎨', '🧵', '🧶', '🎼', '🎤', '🎧', '🎷', '🎸', '🎹', '🎺', '🎻', '🥁', '🎬',
    '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎯', '🎱', '🎳', '🎮', '🎰',
    '👕', '👔', '👗', '👘', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '👠', '👡', '👢', '👑', '👒', '🎩', '🎓', '🧢',
    '⛑️', '📿', '💄', '💍', '💎', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕',
    '🎁', '🎀', '🎊', '🎉', '🎈', '🎏', '🎐', '🧧', '✨', '🎄', '🎃', '🎗️', '🥳', '🥂',
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🏹', '🎣',
    '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏊',
    '🤽', '🚣', '🧗', '🚴', '🚵', '🎖️', '🏆', '🥇', '🥈', '🥉', '🏅',
    '🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️',
    '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂',
    '🍃', '🍄', '🌰', '🦀', '🦞', '🦐', '🦑', '🐙', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🐞', '🦗', '🕷️', '🕸️', '🦂',
    '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆',
    '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌',
    '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁',
    '🐀', '🐿️', '🦔', '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁',
    '⭐', '🌟', '✨', '⚡', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️',
    '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌫️'
];

// Load custom categories from localStorage
function loadCustomCategories() {
    const customCats = localStorage.getItem('customCategories');
    if (customCats) {
        const parsed = JSON.parse(customCats);
        state.customCategories = parsed;

        // Merge custom categories with default ones
        state.categories.expense = [
            ...state.categories.expense.filter(c => !c.custom),
            ...parsed.expense
        ];
        state.categories.income = [
            ...state.categories.income.filter(c => !c.custom),
            ...parsed.income
        ];
    }
}

// Save custom categories to localStorage
function saveCustomCategories() {
    localStorage.setItem('customCategories', JSON.stringify(state.customCategories));
}

// Open add category modal
function openAddCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    modal.classList.add('active');

    // Reset form
    document.getElementById('addCategoryForm').reset();
    document.getElementById('selectedIcon').value = '';

    // Populate icon picker
    populateIconPicker();
}

// Close add category modal
function closeAddCategoryModal() {
    document.getElementById('addCategoryModal').classList.remove('active');
}

// Populate icon picker with all available icons
function populateIconPicker() {
    const picker = document.getElementById('iconPicker');
    picker.innerHTML = AVAILABLE_ICONS.map(icon => `
    <div class="icon-option" data-icon="${icon}" onclick="selectIcon('${icon}')">
      ${icon}
    </div>
  `).join('');
}

// Select an icon
function selectIcon(icon) {
    // Remove previous selection
    document.querySelectorAll('.icon-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Add selection to clicked icon
    const selected = document.querySelector(`[data-icon="${icon}"]`);
    if (selected) {
        selected.classList.add('selected');
        document.getElementById('selectedIcon').value = icon;
    }
}

// Filter icons based on search
function filterIcons() {
    const search = document.getElementById('iconSearch').value.toLowerCase();
    const icons = document.querySelectorAll('.icon-option');

    icons.forEach(icon => {
        const iconValue = icon.getAttribute('data-icon');
        // Simple filter - you could enhance this with emoji names/keywords
        if (search === '') {
            icon.classList.remove('hidden');
        } else {
            // For now, just show all since we don't have emoji names
            // In a real app, you'd map emojis to keywords
            icon.classList.remove('hidden');
        }
    });
}

// Handle add category form submission
function handleAddCategory(event) {
    event.preventDefault();

    const type = document.querySelector('input[name="categoryType"]:checked').value;
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('selectedIcon').value;
    const color = document.querySelector('input[name="categoryColor"]:checked').value;

    if (!icon) {
        showNotification('Выберите иконку!', 'error');
        return;
    }

    const category = {
        id: generateId(),
        name,
        icon,
        color,
        custom: true
    };

    // Add to state
    state.customCategories[type].push(category);
    state.categories[type].push(category);

    // Save to localStorage
    saveCustomCategories();

    // Close modal
    closeAddCategoryModal();

    // Update category options if transaction modal is open
    if (document.getElementById('addTransactionModal').classList.contains('active')) {
        updateCategoryOptions();
    }

    showNotification(`Категория "${name}" создана! 🎉`);
}

// Add to initialization
document.addEventListener('DOMContentLoaded', () => {
    loadCustomCategories();
    init();
});

console.log('💰 Custom Categories Module loaded!');
console.log(`📦 Available icons: ${AVAILABLE_ICONS.length}`);
