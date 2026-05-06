// --- Класс для управления таймером ---
class Timer {
    constructor() {
        // Элементы DOM
        this.timerDisplay = document.getElementById('timerDisplay');
        this.minutesInput = document.getElementById('minutesInput');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.spinner = document.getElementById('spinner');
        this.svgCircle = document.getElementById('base-timer-path-remaining');

        // Константы
        this.CIRCUMFERENCE = parseFloat(this.svgCircle.getAttribute('stroke-dasharray'));
        this.MAX_MINUTES = 99;

        // Состояние
        this.duration = 0;
        this.timeRemaining = 0;
        this.timerInterval = null;

        // Привязка контекста для обработчиков событий
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onReset = this.onReset.bind(this);

        // Подключение слушателей событий
        this.startBtn.addEventListener('click', this.onStart);
        this.stopBtn.addEventListener('click', this.onStop);
        this.resetBtn.addEventListener('click', this.onReset);

        // Инициализация при загрузке
        this.setNewTime();
    }

    // --- Методы управления ---
    onStart() {
        if (this.timeRemaining <= 0) {
            this.setNewTime();
            this.updateDisplay(); // Сбросить вид, если был закончен
        }

        if (this.timerInterval) return; // Защита от двойного клика

        this.startBtn.classList.add('active');
        this.stopBtn.classList.remove('active');

        // Показать спиннер и скрыть через секунду
        this.spinner.style.display = 'block';
        setTimeout(() => this.spinner.style.display = 'none', 1000);

        this.timerInterval = setInterval(() => {
            if (this.timeRemaining > 0.1) { // Условие для плавного завершения
                this.timeRemaining -= 0.1; // Уменьшаем на 100мс (10 раз в секунду)
                this.updateDisplay();
            } else {
                this.stopTimer();
                alert("Время вышло!");
            }
        }, 100); // Интервал 100мс для баланса плавности и производительности
    }

    onStop() {
        this.stopTimer();
    }

    onReset() {
        this.stopTimer();
        this.setNewTime();
        this.updateDisplay();
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        
        this.startBtn.classList.remove('active');
        this.stopBtn.classList.remove('active'); // Убираем активный класс у Стопа при остановке
    }

    // --- Логика вычислений ---
    setNewTime() {
        const inputValue = parseInt(this.minutesInput.value) || 5; // Если пусто, то 5
        this.duration = Math.min(Math.max(inputValue, 1), this.MAX_MINUTES) * 60;
        this.timeRemaining = this.duration;
    }

    updateDisplay() {
        if (this.timeRemaining < 0) return; // Защита

        const minutesRaw = Math.floor(this.timeRemaining / 60);
        const secondsRaw = Math.floor(this.timeRemaining % 60);
        
        const minutes = String(minutesRaw).padStart(2, '0');
        
        // Округление секунд для красоты отображения (например, 59.9 станет 60 -> 00)
        const secondsRounded = Math.round(secondsRaw % 60);
        
        // Если округлили до 60, прибавляем минуту и ставим секунды в 00
        const displaySeconds = secondsRounded === 60 ? '00' : String(secondsRounded).padStart(2, '0');
        
        if (secondsRounded === 60) {
            // Это нужно, чтобы минуты обновились корректно при округлении секунд до 60
            const displayMinutes = String(minutesRaw + 1).padStart(2, '0');
            this.timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
            return;
        }
        
         this.timerDisplay.textContent = `${minutes}:${displaySeconds}`;

         // Анимация круга (SVG)
         const progress = this.timeRemaining / this.duration;
         const offset = this.CIRCUMFERENCE * progress;
         this.svgCircle.style.strokeDashoffset = offset.toString();
    }
}

// Инициализация приложения при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
    new Timer(); // Создаем экземпляр таймера, когда страница готова
});
