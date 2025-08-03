// Переключение режимов
const modeBtns = document.querySelectorAll('.mode-btn');
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активный класс со всех кнопок и контента
        modeBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.mode-content').forEach(c => c.classList.remove('active'));
        
        // Добавляем активный класс к выбранной кнопке
        btn.classList.add('active');
        
        // Показываем соответствующий контент
        const mode = btn.getAttribute('data-mode');
        document.getElementById(`${mode}-content`).classList.add('active');
    });
});

// Секундомер
const stopwatchDisplay = document.getElementById('stopwatch-display');
const startStopwatchBtn = document.getElementById('start-stopwatch');
const stopStopwatchBtn = document.getElementById('stop-stopwatch');
const resetStopwatchBtn = document.getElementById('reset-stopwatch');
const lapStopwatchBtn = document.getElementById('lap-stopwatch');
const stopwatchLaps = document.getElementById('stopwatch-laps');

let stopwatchTimer = null;
let stopwatchStartTime = 0;
let stopwatchElapsedTime = 0;
let stopwatchRunning = false;
let stopwatchLapCount = 1;

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchStartTime = Date.now() - stopwatchElapsedTime;
        stopwatchTimer = setInterval(updateStopwatch, 10);
        stopwatchRunning = true;
    }
}

function stopStopwatch() {
    if (stopwatchRunning) {
        clearInterval(stopwatchTimer);
        stopwatchRunning = false;
    }
}

function resetStopwatch() {
    clearInterval(stopwatchTimer);
    stopwatchTimer = null;
    stopwatchStartTime = 0;
    stopwatchElapsedTime = 0;
    stopwatchRunning = false;
    stopwatchDisplay.textContent = '00:00:00';
    stopwatchLaps.innerHTML = '';
    stopwatchLapCount = 1;
}

function lapStopwatch() {
    if (!stopwatchRunning) return;
    
    const lapTime = stopwatchDisplay.textContent;
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `<span>Круг ${stopwatchLapCount}</span><span>${lapTime}</span>`;
    stopwatchLaps.prepend(lapItem);
    stopwatchLapCount++;
}

function updateStopwatch() {
    stopwatchElapsedTime = Date.now() - stopwatchStartTime;
    
    const milliseconds = Math.floor((stopwatchElapsedTime % 1000) / 10);
    const seconds = Math.floor((stopwatchElapsedTime / 1000) % 60);
    const minutes = Math.floor((stopwatchElapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((stopwatchElapsedTime / (1000 * 60 * 60)) % 24;
    
    stopwatchDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

startStopwatchBtn.addEventListener('click', startStopwatch);
stopStopwatchBtn.addEventListener('click', stopStopwatch);
resetStopwatchBtn.addEventListener('click', resetStopwatch);
lapStopwatchBtn.addEventListener('click', lapStopwatch);

// Таймер обратного отсчета
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
const stopTimerBtn = document.getElementById('stop-timer');
const resetTimerBtn = document.getElementById('reset-timer');

let timerInterval = null;
let timerRunning = false;
let totalSeconds = 0;
let remainingSeconds = 0;

// Инициализация таймера
function initTimer() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
}

function startTimer() {
    if (timerRunning) return;
    
    if (remainingSeconds <= 0) {
        initTimer(); // Перезапускаем таймер, если время закончилось
    }
    
    timerRunning = true;
    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();
        
        if (remainingSeconds <= 0) {
            stopTimer();
            playAlarm();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
}

function resetTimer() {
    stopTimer();
    initTimer();
}

function updateTimerDisplay() {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    
    timerDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Обработчики событий
startTimerBtn.addEventListener('click', startTimer);
stopTimerBtn.addEventListener('click', stopTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Валидация ввода
[hoursInput, minutesInput, secondsInput].forEach(input => {
    input.addEventListener('input', () => {
        let value = parseInt(input.value) || 0;
        
        if (input === hoursInput) {
            if (value > 23) input.value = 23;
            if (value < 0) input.value = 0;
        } else {
            if (value > 59) input.value = 59;
            if (value < 0) input.value = 0;
        }
        
        initTimer();
    });
});

// Инициализируем таймер при загрузке
initTimer();

// Настройки звукового сигнала
const alarmSound = document.getElementById('alarm-sound');
const soundRadios = document.querySelectorAll('input[name="alarm-sound"]');
const customSoundInput = document.getElementById('sound-file');
const customSoundSection = document.getElementById('custom-sound');
const resetCustomBtn = document.getElementById('reset-custom');
const testSoundBtn = document.getElementById('test-sound');
const resetToDefaultBtn = document.getElementById('reset-to-default');

// Текущий выбранный звук
let currentSound = alarmSound;
let customSound = null;

// Загружаем настройки звука из localStorage
function loadSoundSettings() {
    const savedSoundType = localStorage.getItem('alarmSoundType');
    const customSoundData = localStorage.getItem('customAlarmSound');
    
    if (savedSoundType) {
        // Выбираем сохраненный тип звука
        document.querySelector(`input[value="${savedSoundType}"]`).checked = true;
        selectSound(savedSoundType);
        
        // Если есть пользовательский звук
        if (savedSoundType === 'custom' && customSoundData) {
            customSound = new Audio(customSoundData);
            currentSound = customSound;
        }
    }
}

// Сохраняем настройки звука в localStorage
function saveSoundSettings(soundType) {
    localStorage.setItem('alarmSoundType', soundType);
}

// Выбор звука
function selectSound(soundType) {
    switch(soundType) {
        case 'default':
            currentSound = alarmSound;
            customSoundSection.style.display = 'none';
            break;
        case 'custom':
            customSoundSection.style.display = 'block';
            // Используем пользовательский звук, если он был загружен
            if (customSound) currentSound = customSound;
            break;
    }
    
    // Сохраняем выбор пользователя
    saveSoundSettings(soundType);
}

// Обработка выбора звука
soundRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        selectSound(radio.value);
    });
});

// Обработка загрузки пользовательского звука
customSoundInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Проверяем тип файла
    if (!file.type.startsWith('audio/')) {
        alert('Пожалуйста, выберите аудиофайл');
        return;
    }
    
    // Проверяем размер файла (максимум 1 МБ)
    if (file.size > 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер 1 МБ.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Создаем новый аудиоэлемент
        customSound = new Audio(e.target.result);
        
        // Проверяем, можно ли воспроизвести файл
        customSound.oncanplay = () => {
            // Сохраняем пользовательский звук в localStorage
            localStorage.setItem('customAlarmSound', e.target.result);
            currentSound = customSound;
            alert('Пользовательский звук успешно загружен!');
        };
        
        customSound.onerror = () => {
            alert('Не удалось загрузить аудиофайл. Попробуйте другой файл.');
        };
    };
    
    reader.readAsDataURL(file);
});

// Сброс пользовательского звука
resetCustomBtn.addEventListener('click', function() {
    customSoundInput.value = '';
    if (customSound) {
        customSound = null;
    }
    alert('Пользовательский звук сброшен');
});

// Полный сброс к стандартному звуку
resetToDefaultBtn.addEventListener('click', function() {
    // Сбрасываем выбор пользователя
    document.getElementById('sound-default').checked = true;
    selectSound('default');
    
    // Очищаем пользовательский звук
    customSoundInput.value = '';
    customSound = null;
    localStorage.removeItem('customAlarmSound');
    
    // Удаляем настройку типа звука
    localStorage.removeItem('alarmSoundType');
    
    alert('Все звуковые настройки сброшены к стандартным');
});

// Проверка звука
testSoundBtn.addEventListener('click', function() {
    playAlarm();
});

// Воспроизведение звукового сигнала
function playAlarm() {
    currentSound.currentTime = 0;
    currentSound.play().catch(e => {
        console.error('Ошибка воспроизведения звука:', e);
        alert('Ошибка воспроизведения звука. Проверьте настройки звука в браузере.');
    });
}

// Загружаем настройки звука при запуске
loadSoundSettings();
