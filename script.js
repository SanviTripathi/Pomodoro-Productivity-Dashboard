// === Theme Toggle ===
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// === Tab Switching ===
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    tabContents.forEach(c => c.classList.remove("active"));
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// === Pomodoro Timer ===
let time = 25 * 60;
let pomodoroRunning = false;
let interval;
let isBreak = false;
const display = document.getElementById("pomodoroDisplay");
const startBtn = document.getElementById("startPomodoro");
const resetBtn = document.getElementById("resetPomodoro");
const sessionType = document.getElementById("sessionType");

function updatePomodoro() {
  const m = Math.floor(time / 60).toString().padStart(2, "0");
  const s = (time % 60).toString().padStart(2, "0");
  display.textContent = `${m}:${s}`;
}

startBtn.addEventListener("click", () => {
  if (!pomodoroRunning) {
    pomodoroRunning = true;
    startBtn.textContent = "Pause";
    interval = setInterval(() => {
      time--;
      updatePomodoro();
      if (time <= 0) {
        clearInterval(interval);
        pomodoroRunning = false;
        alert(isBreak ? "Break over! Back to work 🍅" : "Pomodoro done! Take a 5-min break ☕");
        if (!isBreak) {
          time = 5 * 60;
          sessionType.textContent = "Short Break ☕";
        } else {
          time = 25 * 60;
          sessionType.textContent = "Work Session 🍅";
        }
        isBreak = !isBreak;
        updatePomodoro();
        startBtn.textContent = "Start";
      }
    }, 1000);
  } else {
    pomodoroRunning = false;
    clearInterval(interval);
    startBtn.textContent = "Start";
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  pomodoroRunning = false;
  time = 25 * 60;
  isBreak = false;
  updatePomodoro();
  startBtn.textContent = "Start";
  sessionType.textContent = "Work Session 🍅";
});
updatePomodoro();

// === Stopwatch ===
let stopwatchSec = 0;
let stopwatchRunning = false;
let stopwatchInterval;
const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const startStopwatch = document.getElementById("startStopwatch");
const resetStopwatch = document.getElementById("resetStopwatch");

function updateStopwatch() {
  const hrs = Math.floor(stopwatchSec / 3600);
  const mins = Math.floor((stopwatchSec % 3600) / 60);
  const secs = stopwatchSec % 60;
  stopwatchDisplay.textContent = `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

startStopwatch.addEventListener("click", () => {
  if (!stopwatchRunning) {
    stopwatchRunning = true;
    startStopwatch.textContent = "Pause";
    stopwatchInterval = setInterval(() => {
      stopwatchSec++;
      updateStopwatch();
    }, 1000);
  } else {
    stopwatchRunning = false;
    startStopwatch.textContent = "Start";
    clearInterval(stopwatchInterval);
  }
});

resetStopwatch.addEventListener("click", () => {
  clearInterval(stopwatchInterval);
  stopwatchSec = 0;
  stopwatchRunning = false;
  updateStopwatch();
  startStopwatch.textContent = "Start";
});

// === Notes (LocalStorage) ===
const notesArea = document.getElementById("notesArea");
const saveNotes = document.getElementById("saveNotes");
notesArea.value = localStorage.getItem("notes") || "";
saveNotes.addEventListener("click", () => {
  localStorage.setItem("notes", notesArea.value);
  alert("Notes saved ✅");
});

// === Tasks (LocalStorage) ===
const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => {
      tasks.splice(i, 1);
      saveTasks();
    };
    li.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
    };
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

addTask.addEventListener("click", () => {
  if (taskInput.value.trim() !== "") {
    tasks.push({ text: taskInput.value, completed: false });
    taskInput.value = "";
    saveTasks();
  }
});

renderTasks();
