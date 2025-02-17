let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskInput = document.getElementById("todoInput");
const taskList = document.getElementById("todoList");
const taskCount = document.getElementById("todoCount");
const addButton = document.querySelector(".add-btn");
const clearButton = document.getElementById("deleteButton");

document.addEventListener("DOMContentLoaded", () => {
  addButton.addEventListener("click", addNewTask);
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTask();
    }
  });
  clearButton.addEventListener("click", clearAllTasks);
  renderTasks();
});

function addNewTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) {
    taskInput.classList.add("shake");
    setTimeout(() => taskInput.classList.remove("shake"), 500);
    return;
  }
  
  tasks.push({
    id: Date.now(),
    text: taskText,
    completed: false,
    createdAt: new Date()
  });
  
  saveAndRender();
  taskInput.value = "";
}

function renderTasks() {
  taskList.innerHTML = tasks
    .map((task, index) => `
      <div class="todo-container" data-id="${task.id}">
        <input type="checkbox" class="todo-checkbox" 
          ${task.completed ? "checked" : ""} 
          onchange="toggleTask(${index})">
        <p class="${task.completed ? "disabled" : ""}" 
          onclick="editTask(${index})">${task.text}</p>
        <button class="remove-btn" onclick="removeTask(${index})">🗑️</button>
      </div>
    `).join("");
    
  taskCount.textContent = tasks.filter(task => !task.completed).length;
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRender();
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveAndRender();
}

function editTask(index) {
  const container = document.querySelector(`[data-id="${tasks[index].id}"]`);
  const taskText = container.querySelector("p");
  const currentText = tasks[index].text;
  
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "input-box";
  
  taskText.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => {
    const newText = input.value.trim();
    if (newText && newText !== currentText) {
      tasks[index].text = newText;
      saveAndRender();
    } else {
      renderTasks();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      input.blur();
    }
    if (e.key === "Escape") {
      renderTasks();
    }
  });
}

function clearAllTasks() {
  if (tasks.length && confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveAndRender();
  }
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}