document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskFormContainer = document.getElementById("task-form-container");
  const taskForm = document.getElementById("task-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const taskList = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const completionImage = document.getElementById("completion-image");

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const renderTasks = () => {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      const isUrgent = new Date(task.dueDate) < new Date(Date.now() + 86400000);
      taskItem.classList.add("task-item");
      taskItem.innerHTML = `
        <div class="task-info">
          <h3 class="${isUrgent ? 'urgent' : ''}">${task.title}</h3>
          <p>${task.description}</p>
          <small>Due: ${task.dueDate}</small>
        </div>
        <button class="delete-btn" data-index="${index}">
          <i class="fas fa-trash-alt"></i> Delete
        </button>
      `;

      taskItem.querySelector(".delete-btn").addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      taskList.appendChild(taskItem);
    });

    updateTaskVisuals();
  };

  const updateTaskVisuals = () => {
    if (tasks.length === 0) {
      emptyState.style.display = "block";
      completionImage.style.display = "none";
    } else {
      emptyState.style.display = "none";
      completionImage.style.display = "none"; // Optional: handle "all completed" logic later
    }
  };

  addTaskBtn.addEventListener("click", () => {
    taskFormContainer.style.display = "block";
  });

  cancelBtn.addEventListener("click", () => {
    taskFormContainer.style.display = "none";
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const dueDate = document.getElementById("task-due-date").value;

    if (title && dueDate) {
      tasks.push({ title, description, dueDate });
      saveTasks();
      renderTasks();

      taskForm.reset();
      taskFormContainer.style.display = "none";
    }
  });

  renderTasks(); // Initial render on page load
});
