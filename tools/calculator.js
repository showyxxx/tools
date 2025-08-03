// Улучшенный калькулятор с историей и исправленной логикой
const calcInput = document.getElementById('calc-input');
const calcExpression = document.getElementById('calc-expression');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

let currentInput = '0';
let currentExpression = '';
let lastOperation = null;
let lastResult = null;
let shouldResetInput = false;
let isNewCalculation = true;

// Загрузка истории из localStorage
function loadHistory() {
    historyList.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.expression = item.expression;
        historyItem.dataset.result = item.result;
        historyItem.innerHTML = `${item.expression} = <strong>${item.result}</strong>`;
        historyList.appendChild(historyItem);
    });
    
    // Добавляем обработчики событий для элементов истории
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            calcExpression.textContent = item.dataset.expression;
            calcInput.value = item.dataset.result;
            currentInput = item.dataset.result;
            currentExpression = item.dataset.expression;
            shouldResetInput = true;
            isNewCalculation = true;
        });
    });
}

// Сохранение в историю
function saveToHistory(expression, result) {
    const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    
    // Добавляем новую запись в начало
    history.unshift({
        expression: expression,
        result: result
    });
    
    // Сохраняем только последние 20 записей
    if (history.length > 20) {
        history.pop();
    }
    
    localStorage.setItem('calcHistory', JSON.stringify(history));
    loadHistory();
}

// Очистка истории
clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('calcHistory');
    loadHistory();
});

// Обновление дисплея
function updateDisplay() {
    calcInput.value = currentInput;
    calcExpression.textContent = currentExpression;
}

// Обработка ввода чисел
function inputDigit(digit) {
    if (shouldResetInput) {
        currentInput = '0';
        shouldResetInput = false;
    }
    
    if (currentInput === '0' && digit !== '.') {
        currentInput = digit;
    } else if (digit === '.' && currentInput.includes('.')) {
        return;
    } else {
        currentInput += digit;
    }
    
    // Если это новое вычисление, сбрасываем выражение
    if (isNewCalculation) {
        currentExpression = '';
        isNewCalculation = false;
    }
    
    updateDisplay();
}

// Обработка операций
function handleOperator(operator) {
    const inputValue = parseFloat(currentInput);
    
    // Если выражение пустое, начинаем новое выражение
    if (currentExpression === '') {
        currentExpression = currentInput;
    } 
    // Если выражение уже есть, но мы только что нажали оператор, заменяем последний оператор
    else if (shouldResetInput) {
        // Удаляем последний оператор и добавляем новый
        currentExpression = currentExpression.slice(0, -2) + ` ${operator}`;
    } 
    // Иначе добавляем текущее значение к выражению
    else {
        currentExpression += ` ${currentInput}`;
    }
    
    // Добавляем оператор к выражению
    currentExpression += ` ${operator}`;
    
    // Сбрасываем флаги
    shouldResetInput = true;
    isNewCalculation = false;
    lastOperation = operator;
    
    updateDisplay();
}

// Вычисление результата
function calculateResult() {
    if (currentExpression === '') return;
    
    // Если нужно сбросить ввод, используем предыдущее значение
    if (!shouldResetInput) {
        currentExpression += ` ${currentInput}`;
    }
    
    const expression = currentExpression;
    let result;
    
    try {
        // Заменяем символы для безопасного вычисления
        const safeExpression = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');
        
        result = eval(safeExpression);
        
        // Ограничиваем количество знаков после запятой
        if (Number.isInteger(result)) {
            result = result.toString();
        } else {
            result = parseFloat(result.toFixed(8)).toString();
        }
        
        // Сохраняем в историю
        saveToHistory(expression, result);
        
        // Обновляем выражение и текущий ввод
        currentExpression = expression;
        currentInput = result;
        lastResult = result;
        shouldResetInput = true;
        isNewCalculation = true;
        
        updateDisplay();
    } catch (error) {
        currentInput = 'Ошибка';
        updateDisplay();
        setTimeout(() => {
            clearCalculator();
        }, 1500);
    }
}

// Очистка калькулятора
function clearCalculator() {
    currentInput = '0';
    currentExpression = '';
    lastOperation = null;
    lastResult = null;
    shouldResetInput = false;
    isNewCalculation = true;
    updateDisplay();
}

// Очистка текущего ввода
function clearEntry() {
    currentInput = '0';
    shouldResetInput = false;
    updateDisplay();
}

// Удаление последнего символа
function backspace() {
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Обработка всех кнопок
document.querySelectorAll('.calculator-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        const number = button.dataset.number;
        const operator = button.dataset.operator;
        const action = button.dataset.action;
        
        if (number) {
            inputDigit(number);
        } else if (operator) {
            handleOperator(operator);
        } else if (action) {
            switch(action) {
                case 'equals':
                    calculateResult();
                    break;
                case 'clear':
                    clearCalculator();
                    break;
                case 'clear-entry':
                    clearEntry();
                    break;
                case 'backspace':
                    backspace();
                    break;
            }
        }
    });
});

// Инициализация
clearCalculator();
loadHistory();

// Обработка клавиатуры
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
    } else if (e.key === '.') {
        inputDigit('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculateResult();
    } else if (e.key === 'Escape') {
        clearCalculator();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Delete') {
        clearEntry();
    }
});