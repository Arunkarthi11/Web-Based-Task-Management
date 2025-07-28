document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addBtn").addEventListener("click", addTask);
  document.getElementById("searchInput").addEventListener("input", filterTasks);
  loadTasks();
});

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const time = document.getElementById("time").value;

  if (!title || !time) {
    alert("Please enter both title and time.");
    return;
  }

  const task = {
    title,
    description: desc,
    time,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  loadTasks();

  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("time").value = "";
}

function loadTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const tasks = getTasks();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const overdue = new Date(task.time) < new Date() && !task.completed;
    if (overdue) li.style.borderLeftColor = "red";

    li.innerHTML = `
      <strong>${task.title}</strong>
      <div class="task-meta">${task.description}</div>
      <div class="task-meta">Scheduled: ${new Date(task.time).toLocaleString()}</div>
      <div class="task-actions">
        <button class="complete-btn" onclick="toggleComplete(${index})">
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function toggleComplete(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  loadTasks();
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  loadTasks();
}

function clearCompleted() {
  let tasks = getTasks().filter(task => !task.completed);
  saveTasks(tasks);
  loadTasks();
}

function clearAll() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("tasks");
    loadTasks();
  }
}

function filterTasks() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const tasks = document.querySelectorAll("#taskList li");

  tasks.forEach(task => {
    const text = task.textContent.toLowerCase();
    task.style.display = text.includes(query) ? "block" : "none";
  });
}
