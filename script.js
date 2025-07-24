let startBtn = document.getElementById("start");
let stopBtn = document.getElementById("stop");
let timeEl = document.getElementById("time");
let gardenEl = document.getElementById("garden");

let timer;
let startTime;

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSec % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function updateTime() {
  const now = Date.now();
  const elapsed = now - startTime;
  timeEl.textContent = formatTime(elapsed);
}

startBtn.onclick = () => {
  startTime = Date.now();
  timer = setInterval(updateTime, 1000);
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
};

stopBtn.onclick = () => {
  clearInterval(timer);
  const elapsed = Date.now() - startTime;

  //const newPlant = document.createElement("img");
  //newPlant.src = "assets/plant1.png"; // replace with your actual plant image
  //newPlant.alt = "Plant";
  //newPlant.width = 64;
  //newPlant.className = "plant";

  const newPlant = document.createElement("div");
  newPlant.textContent = "🌿";  // temporary plant emoji
  newPlant.className = "text-3xl plant";
  gardenEl.appendChild(newPlant);

  savePlant();

  stopBtn.classList.add("hidden");
  startBtn.classList.remove("hidden");
};

function savePlant() {
  const count = gardenEl.children.length;
  chrome.storage.sync.set({ plantCount: count });
}

function loadGarden() {
  chrome.storage.sync.get(["plantCount"], ({ plantCount }) => {
    for (let i = 0; i < (plantCount || 0); i++) {
      //const plant = document.createElement("img");
      //plant.src = "assets/plant1.png";
      //plant.alt = "Plant";
      //plant.width = 64;
      //plant.className = "plant";
      const plant = document.createElement("div");
      plant.textContent = "🌿";
      plant.className = "text-3xl plant";
      gardenEl.appendChild(plant);
    }
  });
}

loadGarden();
