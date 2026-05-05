javascript
Копировать
// --- КОНФИГУРАЦИЯ ---
const MAX_MINUTES = parseInt(document.getElementById('maxValue').textContent);
const CIRCUMFERENCE = parseFloat(document.getElementById('base-timer-path-remaining').getAttribute('stroke-dasharray'));

// --- ЭЛЕМЕНТЫ DOM ---
const timerDisplay = document.getElementById('timerDisplay');
const minutesInput = document.getElementById('minutesInput');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const spinner = document.getElementById('spinner');
const svgCircle = document.getElementById('base-timer-path-remaining');

// --- ПЕРЕМЕННЫЕ СОСТОЯНИЯ ---
let duration = null; // Общее время в секундах
let timeRemaining = null; // Оставшееся время в секундах
let timerInterval = null; // ID интервала setInterval

// --- ФУНКЦИИ ЛОГИКИ ---

function onStart() {
    if (timeRemaining === null || timeRemaining <= 0) {
       setNewTime(); // Если таймер был остановлен или завершен, сбрасываем время из инпута
   }
   startBtn.classList.add('active');
   stopBtn.classList.remove('active');
   spinner.style.display = 'block'; // Показываем спиннер мгновенно

   // Прячем спиннер через секунду (для имитации загрузки)
   setTimeout(() => {
       spinner.style.display = 'none';
   }, 1000);
   
   startTimer();
}

function onStop() {
   clearInterval(timerInterval);
   timerInterval = null;
   startBtn.classList.remove('active');
   stopBtn.classList.add('active');
}

function onReset() {
   onStop(); // Останавливаем, если идет отсчет
   setNewTime(); // Задаем время из инпута (по сути, сбрасываем прогресс)
   updateDisplay(); // Обновляем UI до начального состояния

   // Сбрасываем анимацию круга к началу визуально мгновенно
   const offset = CIRCUMFERENCE * (timeRemaining / duration);
   svgCircle.style.strokeDashoffset = offset.toString();
}


function setNewTime() {
   const inputValue = parseInt(minutesInput.value);
   duration = Math.min(Math.max(inputValue, 1), MAX_MINUTES) * 60; // Конвертируем в секунды и ограничиваем макс/мин
   timeRemaining = duration; // Сбрасываем оставшееся время до полного значения
}


function startTimer() {
   if (timerInterval) return; // Защита от двойного клика

   timerInterval = setInterval(() => {
       if (timeRemaining > 1) { // Если осталось больше секунды
           timeRemaining -= (1/60); // Уменьшаем на долю секунды для плавности (60fps)
           updateDisplay();
       } else { // Таймер закончился (время <= ~1 сек)
           clearInterval(timerInterval);
           timerInterval = null;
           timeRemaining = null; // Полный сброс состояния

           // Финальные действия при завершении
           updateDisplay();
           alert("Время вышло!");
           startBtn.classList.remove('active');
       }
   }, 17); // ~60 кадров в секунду для плавной анимации круга и цифр
}


function updateDisplay() {
   if (!timeRemaining && timeRemaining !== 0) return; // Защита на случай null

   // Форматирование времени мм : сс с ведущими нулями и округлением секунд
   const minutesRaw = Math.floor(timeRemaining / 60);
   const secondsRaw = Math.floor(timeRemaining % 60);
   
   const minutes = String(minutesRaw).padStart(2, '0');
   
   // Округление секунд до ближайшего целого для более "чистого" отображения при высокой частоте кадров
   const secondsRounded = Math.round(secondsRaw);
   const seconds = String(secondsRounded).padStart(2, '0');
   
   timerDisplay.textContent = `${minutes}:${seconds}`;

   // Анимация круга (SVG)
   const progress = timeRemaining / duration; // Процент оставшегося времени (от 1 до ~-1)
   const offset = CIRCUMFERENCE * progress; // Вычисляем смещение линии

   svgCircle.style.strokeDashoffset = offset.toString();
}


// --- НАЧАЛЬНАЯ НАСТРОЙКА И ОБРАБОТЧИКИ СОБЫТИЙ ---
setNewTime(); // Инициализация времени при загрузке страницы

startBtn.addEventListener('click', onStart);
stopBtn.addEventListener('click', onStop);
resetBtn.addEventListener('click', onReset);