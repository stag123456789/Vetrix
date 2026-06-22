// ============================================================
// ДАННЫЕ
// ============================================================

const marketData = [
    { name: 'Telegram Pin Galaxy 1', price: 711196.67, rarity: 'common' },
    { name: 'Plush Pepe', price: 3.19, rarity: 'mythic' },
    { name: 'durov cap', price: 5.60, rarity: 'legendary' },
    { name: 'Heroic Helmet', price: 1.33, rarity: 'legendary' },
    { name: 'Heart Very Locket', price: 4.64, rarity: 'legendary' },
    { name: 'Mini Oskar', price: 1.09, rarity: 'legendary' },
    { name: 'Durov Figure Durno', price: 1.64, rarity: 'common' },
    { name: 'Redo Telegraph 67', price: 234.00, rarity: 'common' },
    { name: 'Redo legendary', price: 218.65, rarity: 'common' },
    { name: 'Mighty Arm', price: 1.91, rarity: 'legendary' },
    { name: 'Astral Shard', price: 2.02, rarity: 'legendary' },
    { name: 'Nail Bracelet', price: 2.25, rarity: 'legendary' },
    { name: 'Zumer Parfume', price: 2.19, rarity: 'common' },
    { name: 'Sleepy Frog', price: 1.17, rarity: 'common' },
    { name: 'Trojan Horse', price: 11.63, rarity: 'common' },
    { name: 'Ion Gem', price: 7.68, rarity: 'legendary' },
    { name: 'Loot Bag', price: 3.30, rarity: 'legendary' },
    { name: 'Die', price: 5.67, rarity: 'halloween' },
    { name: 'Diamond Ring', price: 6.11, rarity: 'legendary' },
    { name: 'Electric Skull', price: 6.13, rarity: 'legendary' },
    { name: 'Vintage Cigar', price: 4.22, rarity: 'legendary' },
    { name: 'Scared Cat', price: 6.11, rarity: 'legendary' },
    { name: 'Eternal Rose', price: 5.91, rarity: 'epic' },
    { name: 'Signet Ring', price: 4.08, rarity: 'legendary' },
    { name: 'Low Rider', price: 4.69, rarity: 'legendary' },
    { name: 'Snoopy Doggy', price: 13.39, rarity: 'rare' },
    { name: 'Money Pot', price: 12.62, rarity: 'rare' },
    { name: 'Chill Flame', price: 16.44, rarity: 'common' },
    { name: 'Birthday Candle', price: 33.85, rarity: 'common' },
    { name: 'Lucky Numbers', price: 19.35, rarity: 'common' },
    { name: 'Stellar Rocket', price: 9.79, rarity: 'rare' },
    { name: 'Sky Stiletos', price: 9.49, rarity: 'epic' },
    { name: 'Sakura Flower', price: 6.64, rarity: 'epic' },
    { name: 'Victory Medal', price: 23.86, rarity: 'epic' },
    { name: 'Spy Agaric', price: 20.26, rarity: 'epic' },
    { name: 'Hex pot', price: 12.47, rarity: 'epic' },
    { name: 'Jack In The Box', price: 6.87, rarity: 'epic' },
    { name: 'Input Key', price: 10.00, rarity: 'epic' },
];

const slotSymbols = ['🍒', '🍋', '🍊', '7️⃣', '💎', '⭐', '🎰', '💰'];

// ============================================================
// СОСТОЯНИЕ
// ============================================================

let state = {
    balance: 104.62,
    tradeBalance: 99.50,
    inventory: [],
    minesActive: false,
    minesRevealed: [],
    minesBombs: [],
    minesMultiplier: 1,
    minesStars: 0,
    currentMines: 2,
    isSpinning: false,
    marketFilter: 'all',
};

// ============================================================
// DOM-ССЫЛКИ
// ============================================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const mainBalance = $('#mainBalance');
const tradeBalanceEl = $('#tradeBalance');
const slotsGrid = $('#slotsGrid');
const slotBet = $('#slotBet');
const spinBtn = $('#spinSlots');
const slotResult = $('#slotResult');
const slotWinAmount = $('#slotWinAmount');
const minesGrid = $('#minesGrid');
const minesBet = $('#minesBet');
const minesAction = $('#minesAction');
const minesStatus = $('#minesStatus');
const minesAmount = $('#minesAmount');
const marketItems = $('#marketItems');
const inventoryItems = $('#inventoryItems');
const itemModal = $('#itemModal');
const modalTitle = $('#modalTitle');
const modalPrice = $('#modalPrice');
const modalRarity = $('#modalRarity');
const modalBuy = $('#modalBuy');
const modalClose = $('.modal-close');

// ============================================================
// ВКЛАДКИ
// ============================================================

$$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $$('.tab').forEach(t => t.classList.remove('active'));
        const tab = document.getElementById('tab-' + btn.dataset.tab);
        if (tab) tab.classList.add('active');
    });
});

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

function init() {
    renderSlots();
    renderMines();
    renderMarket();
    renderInventory();
    updateBalances();
    
    // События для слотов
    spinBtn.addEventListener('click', spinSlots);
    
    // События для мин
    minesAction.addEventListener('click', startMinesGame);
    
    // Выбор режима мин
    $$('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentMines = parseInt(btn.dataset.mines);
            state.minesActive = false;
            renderMines();
            minesStatus.textContent = 'Открывайте клетки';
            minesAmount.textContent = '';
            minesAction.textContent = 'Сделать ставку';
        });
    });
    
    // Фильтры маркета
    $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.marketFilter = btn.textContent.toLowerCase();
            renderMarket();
        });
    });
    
    // Модальное окно
    modalClose.addEventListener('click', () => {
        itemModal.classList.remove('active');
    });
    itemModal.addEventListener('click', (e) => {
        if (e.target === itemModal) itemModal.classList.remove('active');
    });
    
    // ALL IN
    $('#allIn').addEventListener('click', () => {
        const balance = parseFloat(tradeBalanceEl.textContent);
        if (balance <= 0) {
            alert('Недостаточно средств!');
            return;
        }
        const direction = confirm('Угадай направление: OK = ВВЕРХ, Отмена = ВНИЗ');
        const win = Math.random() > 0.5;
        if (win) {
            const newBalance = balance * 2.5;
            tradeBalanceEl.textContent = newBalance.toFixed(2);
            alert(`🎉 ПОБЕДА! ${balance} → ${newBalance.toFixed(2)} TON (x2.5)`);
        } else {
            tradeBalanceEl.textContent = '0.00';
            alert('💀 Проигрыш! Баланс обнулён.');
        }
    });
    
    // Купить/продать TON
    $('#buyTon').addEventListener('click', () => {
        const amount = prompt('Введите сумму TON для покупки:', '10');
        if (amount) {
            const val = parseFloat(amount);
            if (val > 0) {
                state.balance -= val;
                state.tradeBalance += val;
                updateBalances();
            }
        }
    });
    
    $('#sellTon').addEventListener('click', () => {
        const amount = prompt('Введите сумму TON для продажи:', '10');
        if (amount) {
            const val = parseFloat(amount);
            if (val > 0 && val <= state.tradeBalance) {
                state.tradeBalance -= val;
                state.balance += val * 0.9; // 10% комиссия
                updateBalances();
            }
        }
    });
}

// ============================================================
// ОБНОВЛЕНИЕ БАЛАНСОВ
// ============================================================

function updateBalances() {
    mainBalance.textContent = state.balance.toFixed(2);
    tradeBalanceEl.textContent = state.tradeBalance.toFixed(2);
}

// ============================================================
// СЛОТЫ
// ============================================================

function renderSlots() {
    slotsGrid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const div = document.createElement('div');
        div.className = 'slot-item';
        div.textContent = slotSymbols[i % slotSymbols.length];
        div.dataset.index = i;
        slotsGrid.appendChild(div);
    }
}

function spinSlots() {
    if (state.isSpinning) return;
    const bet = parseFloat(slotBet.value) || 0.10;
    if (bet > state.balance) {
        alert('Недостаточно средств!');
        return;
    }
    
    state.isSpinning = true;
    spinBtn.disabled = true;
    state.balance -= bet;
    updateBalances();
    
    const items = slotsGrid.querySelectorAll('.slot-item');
    let spins = 0;
    const maxSpins = 15 + Math.floor(Math.random() * 10);
    
    const interval = setInterval(() => {
        items.forEach(el => {
            const idx = Math.floor(Math.random() * slotSymbols.length);
            el.textContent = slotSymbols[idx];
            el.classList.remove('highlight');
        });
        spins++;
        if (spins >= maxSpins) {
            clearInterval(interval);
            // Финальный результат
            const results = [];
            items.forEach(el => {
                const idx = Math.floor(Math.random() * slotSymbols.length);
                el.textContent = slotSymbols[idx];
                results.push(idx);
            });
            
            // Проверка выигрыша
            const win = checkSlotsWin(results);
            if (win > 0) {
                const winAmount = bet * win;
                state.balance += winAmount;
                updateBalances();
                slotWinAmount.textContent = winAmount.toFixed(2);
                slotResult.style.display = 'block';
                items.forEach((el, i) => {
                    if (results[i] === results[4]) el.classList.add('highlight');
                });
            } else {
                slotResult.style.display = 'block';
                slotWinAmount.textContent = '0.00';
            }
            
            state.isSpinning = false;
            spinBtn.disabled = false;
        }
    }, 100);
}

function checkSlotsWin(results) {
    // Простая проверка: если 3 в ряд одинаковые
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтали
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикали
        [0, 4, 8], [2, 4, 6] // диагонали
    ];
    
    for (const combo of wins) {
        const [a, b, c] = combo;
        if (results[a] === results[b] && results[b] === results[c]) {
            // Множитель зависит от символа
            const multipliers = {
                '🍒': 1.5, '🍋': 1.5, '🍊': 1.5,
                '7️⃣': 3, '💎': 5, '⭐': 4,
                '🎰': 2, '💰': 10
            };
            const symbol = slotSymbols[results[a]];
            return multipliers[symbol] || 1.5;
        }
    }
    return 0;
}

// ============================================================
// МИНЫ
// ============================================================

function renderMines() {
    minesGrid.innerHTML = '';
    const total = state.currentMines === 2 ? 9 : 
                  state.currentMines === 4 ? 16 : 
                  state.currentMines === 10 ? 25 : 36;
    const cols = state.currentMines === 2 ? 3 : 
                 state.currentMines === 4 ? 4 : 5;
    minesGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    state.minesRevealed = [];
    state.minesBombs = [];
    state.minesMultiplier = 1;
    state.minesStars = 0;
    
    // Выбираем бомбы
    const bombCount = Math.min(state.currentMines, Math.floor(total / 3));
    const bombIndices = [];
    while (bombIndices.length < bombCount) {
        const idx = Math.floor(Math.random() * total);
        if (!bombIndices.includes(idx)) bombIndices.push(idx);
    }
    state.minesBombs = bombIndices;
    
    for (let i = 0; i < total; i++) {
        const div = document.createElement('div');
        div.className = 'mine-cell';
        div.dataset.index = i;
        div.textContent = '❓';
        div.addEventListener('click', () => revealMine(i));
        minesGrid.appendChild(div);
    }
}

function revealMine(index) {
    if (!state.minesActive) {
        alert('Сначала сделайте ставку!');
        return;
    }
    if (state.minesRevealed.includes(index)) return;
    
    const cells = minesGrid.querySelectorAll('.mine-cell');
    const cell = cells[index];
    
    if (state.minesBombs.includes(index)) {
        // БОМБА!
        cell.textContent = '💣';
        cell.classList.add('bomb');
        state.minesActive = false;
        minesStatus.textContent = '💀 Проигрыш!';
        minesAmount.textContent = `-${parseFloat(minesBet.value || 0.10).toFixed(2)} TON`;
        minesAction.textContent = 'Сделать ставку';
        showAllBombs();
    } else {
        // ЗОЛОТО
        cell.textContent = '⭐';
        cell.classList.add('gem');
        state.minesRevealed.push(index);
        state.minesStars++;
        const multiplier = 1 + state.minesStars * 0.05;
        state.minesMultiplier = multiplier;
        
        // Обновляем множитель
        const mults = minesGrid.parentElement.querySelector('.mines-multipliers');
        if (mults) {
            const stars = mults.querySelectorAll('span');
            stars.forEach((el, i) => {
                if (i < state.minesStars) {
                    el.style.color = '#ffd700';
                }
            });
        }
        
        const bet = parseFloat(minesBet.value) || 0.10;
        const win = bet * multiplier;
        minesStatus.textContent = `★${state.minesStars} • множитель x${multiplier.toFixed(2)}`;
        minesAmount.textContent = `${win.toFixed(2)} TON`;
        minesAction.textContent = 'Забрать';
        
        // Проверка победы - все клетки открыты (кроме бомб)
        const totalCells = cells.length;
        if (state.minesRevealed.length + state.minesBombs.length === totalCells) {
            // Победа!
            const winAmount = bet * multiplier;
            state.balance += winAmount;
            updateBalances();
            minesStatus.textContent = '🎉 ПОБЕДА!';
            minesAmount.textContent = `+${winAmount.toFixed(2)} TON`;
            state.minesActive = false;
            minesAction.textContent = 'Сделать ставку';
        }
    }
}

function showAllBombs() {
    const cells = minesGrid.querySelectorAll('.mine-cell');
    state.minesBombs.forEach(idx => {
        if (cells[idx]) {
            cells[idx].textContent = '💣';
            cells[idx].classList.add('bomb');
        }
    });
}

function startMinesGame() {
    const bet = parseFloat(minesBet.value) || 0.10;
    
    if (state.minesActive && minesAction.textContent === 'Забрать') {
        // Забрать выигрыш
        const winAmount = bet * state.minesMultiplier;
        state.balance += winAmount;
        updateBalances();
        minesStatus.textContent = '✅ Забрано!';
        minesAmount.textContent = `+${winAmount.toFixed(2)} TON`;
        state.minesActive = false;
        minesAction.textContent = 'Сделать ставку';
        return;
    }
    
    if (bet > state.balance) {
        alert('Недостаточно средств!');
        return;
    }
    
    state.balance -= bet;
    updateBalances();
    state.minesActive = true;
    state.minesRevealed = [];
    state.minesMultiplier = 1;
    state.minesStars = 0;
    minesStatus.textContent = 'Открывайте клетки';
    minesAmount.textContent = '';
    minesAction.textContent = 'Играть...';
    
    // Сброс поля
    const cells = minesGrid.querySelectorAll('.mine-cell');
    cells.forEach(cell => {
        cell.textContent = '❓';
        cell.className = 'mine-cell';
    });
    
    // Перемешиваем бомбы
    const total = cells.length;
    const bombCount = Math.min(state.currentMines, Math.floor(total / 3));
    state.minesBombs = [];
    while (state.minesBombs.length < bombCount) {
        const idx = Math.floor(Math.random() * total);
        if (!state.minesBombs.includes(idx)) state.minesBombs.push(idx);
    }
    
    // Сброс множителей
    const mults = minesGrid.parentElement.querySelector('.mines-multipliers');
    if (mults) {
        mults.querySelectorAll('span').forEach(el => {
            el.style.color = '#888';
        });
    }
    
    minesAction.textContent = 'Забрать';
}

// ============================================================
// МАРКЕТ
// ============================================================

function renderMarket() {
    marketItems.innerHTML = '';
    let items = marketData;
    if (state.marketFilter !== 'все') {
        items = items.filter(item => item.rarity === state.marketFilter);
    }
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'market-item';
        div.innerHTML = `
            <span class="name">${item.name}</span>
            <span class="price">${item.price.toFixed(2)} TON</span>
            <span class="rarity rarity-${item.rarity}">${item.rarity}</span>
        `;
        div.addEventListener('click', () => openModal(item));
        marketItems.appendChild(div);
    });
}

// ============================================================
// ИНВЕНТАРЬ
// ============================================================

function renderInventory() {
    if (state.inventory.length === 0) {
        inventoryItems.innerHTML = '<p class="empty">У вас пока нет предметов</p>';
        return;
    }
    inventoryItems.innerHTML = '';
    state.inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'market-item';
        div.innerHTML = `
            <span class="name">${item.name}</span>
            <span class="rarity rarity-${item.rarity}">${item.rarity}</span>
        `;
        inventoryItems.appendChild(div);
    });
}

// ============================================================
// МОДАЛЬНОЕ ОКНО
// ============================================================

function openModal(item) {
    modalTitle.textContent = item.name;
    modalPrice.textContent = `Цена: ${item.price.toFixed(2)} TON`;
    modalRarity.textContent = `Редкость: ${item.rarity}`;
    modalRarity.className = `rarity rarity-${item.rarity}`;
    modalBuy.dataset.item = JSON.stringify(item);
    itemModal.classList.add('active');
}

modalBuy.addEventListener('click', () => {
    const item = JSON.parse(modalBuy.dataset.item);
    if (item.price > state.balance) {
        alert('Недостаточно средств!');
        return;
    }
    state.balance -= item.price;
    state.inventory.push({ ...item });
    updateBalances();
    renderInventory();
    itemModal.classList.remove('active');
    alert(`🎉 Куплено: ${item.name}!`);
});

// ============================================================
// ЗАПУСК
// ============================================================

document.addEventListener('DOMContentLoaded', init);
