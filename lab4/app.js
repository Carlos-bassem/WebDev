"use strict";
// 2. Our application data (the two starter tasks from the lab screenshot).
let todos = [
    { id: 1, text: "See Lecture", completed: false },
    { id: 2, text: "Solve assignment", completed: false }
];
let nextId = 3;
let currentFilter = "all";
// 3. Access the HTML elements we need to update.
// "as HTML...Element" tells TypeScript the expected element type.
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedButton = document.getElementById("clear-completed");
const clearAllButton = document.getElementById("clear-all");
const filterButtons = document.querySelectorAll(".filter-button");
// 4. Create one visible row for one Todo.
function createTodoElement(todo) {
    const row = document.createElement("li");
    row.className = "todo-item";
    if (todo.completed) {
        row.classList.add("completed");
    }
    // Checkbox: change the task's completed state.
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `Mark ${todo.text} completed`);
    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        renderTodos();
    });
    // Task text: double-click to edit.
    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text; // textContent safely displays user-entered text.
    text.title = "Double-click to edit";
    text.addEventListener("dblclick", () => {
        startEditing(todo, text);
    });
    // Delete button: keep all tasks except the selected one.
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);
    // This is a fixed SVG icon; task text is NEVER inserted as HTML.
    deleteButton.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M5 6l1 15h12l1-15"/><path d="M10 10v7M14 10v7"/></svg>';
    deleteButton.addEventListener("click", () => {
        todos = todos.filter(item => item.id !== todo.id);
        renderTodos();
    });
    row.append(checkbox, text, deleteButton);
    return row;
}
// 5. Edit a task using an input in place of its text.
function startEditing(todo, textElement) {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.maxLength = 120;
    editInput.value = todo.text;
    textElement.replaceWith(editInput);
    editInput.focus();
    editInput.select();
    let finished = false;
    function saveEdit() {
        if (finished)
            return;
        finished = true;
        const newText = editInput.value.trim();
        if (newText !== "") {
            todo.text = newText;
        }
        renderTodos();
    }
    function cancelEdit() {
        if (finished)
            return;
        finished = true;
        renderTodos();
    }
    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter")
            saveEdit();
        if (event.key === "Escape")
            cancelEdit();
    });
    editInput.addEventListener("blur", saveEdit);
}
// 6. Update the HTML so it matches the current data and selected filter.
function renderTodos() {
    // Start by clearing the old rows.
    todoList.innerHTML = "";
    // filter() creates a NEW array containing the visible tasks.
    const visibleTodos = todos.filter(todo => {
        if (currentFilter === "active")
            return !todo.completed;
        if (currentFilter === "completed")
            return todo.completed;
        return true; // "all"
    });
    // Create a row for each visible task.
    visibleTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
    // The count always represents unfinished tasks, not just visible ones.
    const count = todos.filter(todo => !todo.completed).length;
    itemsLeft.textContent = `${count} item${count === 1 ? "" : "s"} left`;
    // When no tasks match the filter, show an empty-state message.
    emptyMessage.hidden = visibleTodos.length > 0;
    // Highlight the active filter button.
    filterButtons.forEach(button => {
        const selected = button.dataset.filter === currentFilter;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
}
// 7. Add a new task when the user submits the form (Add or Enter).
todoForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the page from reloading.
    const text = todoInput.value.trim();
    if (text === "")
        return;
    todos.push({ id: nextId++, text: text, completed: false });
    todoInput.value = "";
    todoInput.focus();
    renderTodos();
});
// 8. Change the filter when All / Active / Completed is clicked.
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        if (filter === "all" || filter === "active" || filter === "completed") {
            currentFilter = filter;
            renderTodos();
        }
    });
});
// 9. Clear buttons.
clearCompletedButton.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
});
clearAllButton.addEventListener("click", () => {
    todos = [];
    renderTodos();
});
// 10. Show the starter tasks when the page first opens.
renderTodos();
