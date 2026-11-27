const STORAGE_KEY = "study_todos_v1";

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let currentFilter = "all";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((item) => !item.completed);
  }
  if (currentFilter === "completed") {
    return todos.filter((item) => item.completed);
  }
  return todos;
}

function renderTodos() {
  const visibleTodos = getFilteredTodos();
  list.innerHTML = "";

  visibleTodos.forEach((item) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const left = document.createElement("div");
    left.className = "todo-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => {
      item.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const span = document.createElement("span");
    span.className = "todo-text" + (item.completed ? " completed" : "");
    span.textContent = item.text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "Xóa";
    delBtn.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== item.id);
      saveTodos();
      renderTodos();
    });

    left.appendChild(checkbox);
    left.appendChild(span);
    li.appendChild(left);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.unshift({
    id: Date.now(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();
  input.value = "";
  input.focus();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

renderTodos();