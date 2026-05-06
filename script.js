const input = document.getElementById("minutesInput");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const display = document.getElementById("timeDisplay");
const spinner = document.getElementById("spinner");

const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

let totalSeconds = 0;
let remainingSeconds = 0;
let interval = null;

function setProgress(percent) {
  const offset = circumference - percent * circumference;
  circle.style.strokeDashoffset = offset;
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateUI() {
  display.textContent = formatTime(remainingSeconds);

  const progress = 1 - remainingSeconds / totalSeconds;
  setProgress(progress);
}

function startTimer() {
  const minutes = parseInt(input.value);

  if (!minutes || minutes < 1 || minutes > 99) {
    alert("Введите от 1 до 99 минут");
    return;
  }

  clearInterval(interval);

  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;

  spinner.classList.remove("hidden");

  updateUI();

  interval = setInterval(() => {
    remainingSeconds--;

    updateUI();

    if (remainingSeconds <= 0) {
      clearInterval(interval);
      spinner.classList.add("hidden");
      alert("Время вышло!");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  remainingSeconds = 0;
  totalSeconds = 0;
  display.textContent = "00:00";
  setProgress(0);
  spinner.classList.add("hidden");
}

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
