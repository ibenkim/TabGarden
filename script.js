let startTime = null;
let intervalId = null;
let elapsedTime = 0;
let plantCount = 0;

const timerDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const clearBtn = document.getElementById("clear");
const garden = document.getElementById("garden");

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function addPlant() {
  const plant = document.createElement("div");
  plant.textContent = "🌿";
  plant.className = "text-2xl plant";
  garden.appendChild(plant);
}

function updateTimer() {
  const now = Date.now();
  const totalElapsed = elapsedTime + (now - startTime);
  timerDisplay.textContent = formatTime(totalElapsed);

  const newPlantCount = Math.floor(totalElapsed / 5000);
  if (newPlantCount > plantCount) {
    for (let i = plantCount; i < newPlantCount; i++) {
      addPlant();
    }
    plantCount = newPlantCount;
  }

  //save
  localStorage.setItem("startTime", startTime);
  localStorage.setItem("elapsedTime", elapsedTime);
  localStorage.setItem("plantCount", plantCount);
}

startBtn.addEventListener("click", () => {
  if (intervalId !== null) return;
  startTime = Date.now();
  intervalId = setInterval(updateTimer, 1000);
  updateTimer();
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
});

stopBtn.addEventListener("click", () => {
  if (intervalId === null) return;
  clearInterval(intervalId);
  intervalId = null;
  elapsedTime += Date.now() - startTime;
  startTime = null;
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
  localStorage.setItem("elapsedTime", elapsedTime);
  localStorage.setItem("plantCount", plantCount);
  localStorage.removeItem("startTime");
});

clearBtn.addEventListener("click", () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }

  startTime = null;
  elapsedTime = 0;
  plantCount = 0;
  timerDisplay.textContent = "00:00:00";
  garden.innerHTML = "";

  localStorage.clear();

  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedElapsed = parseInt(localStorage.getItem("elapsedTime")) || 0;
  const savedStart = parseInt(localStorage.getItem("startTime"));
  const savedPlantCount = parseInt(localStorage.getItem("plantCount")) || 0;

  elapsedTime = savedElapsed;
  plantCount = 0;

  const totalElapsed = savedStart ? savedElapsed + (Date.now() - savedStart) : savedElapsed;
  const restoredPlantCount = Math.floor(totalElapsed / 5000);
  for (let i = 0; i < restoredPlantCount; i++) addPlant();
  plantCount = restoredPlantCount;

  timerDisplay.textContent = formatTime(totalElapsed);

  if (savedStart) {
    startTime = Date.now() - (Date.now() - savedStart);
    intervalId = setInterval(updateTimer, 1000);
    startBtn.classList.add("hidden");
    stopBtn.classList.remove("hidden");
  }
});

