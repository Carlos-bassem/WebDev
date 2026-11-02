type Todo = {
    id: number;
    text: string;
    completed: boolean;
};

type Filter = "all" | "active" | "completed";

let todos: Todo[] = [
    { id: 1, text: "See Lecture", completed: false },
    { id: 2, text: "Solve assignment", completed: false }
];

let nextId = 3;
let currentFilter: Filter = "all";

const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const itemsLeft = document.getElementById("items-left") as HTMLSpanElement;
const emptyMessage = document.getElementById("empty-message") as HTMLParagraphElement;
const clearCompletedButton = document.getElementById("clear-completed") as HTMLButtonElement;
const clearAllButton = document.getElementById("clear-all") as HTMLButtonElement;
const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-button");

function createTodoElement(todo: Todo): HTMLLIElement {
    const row = document.createElement("li");
    row.className = "todo-item";

    if (todo.completed) {
        row.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `Mark ${todo.text} completed`);

    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text; 
    text.title = "Double-click to edit";

    text.addEventListener("dblclick", () => {
        startEditing(todo, text);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);
    deleteButton.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M5 6l1 15h12l1-15"/><path d="M10 10v7M14 10v7"/></svg>';

    deleteButton.addEventListener("click", () => {
        todos = todos.filter(item => item.id !== todo.id);
        renderTodos();
    });

    row.append(checkbox, text, deleteButton);
    return row;
}

function startEditing(todo: Todo, textElement: HTMLSpanElement): void {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.maxLength = 120;
    editInput.value = todo.text;

    textElement.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    let finished = false;

    function saveEdit(): void {
        if (finished) return;
        finished = true;

        const newText = editInput.value.trim();
        if (newText !== "") {
            todo.text = newText;
        }
        renderTodos();
    }

    function cancelEdit(): void {
        if (finished) return;
        finished = true;
        renderTodos();
    }

    editInput.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") saveEdit();
        if (event.key === "Escape") cancelEdit();
    });

    editInput.addEventListener("blur", saveEdit);
}

function renderTodos(): void {
    todoList.innerHTML = "";

    const visibleTodos = todos.filter(todo => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true;
    });

    visibleTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });

    const count = todos.filter(todo => !todo.completed).length;
    itemsLeft.textContent = `${count} item${count === 1 ? "" : "s"} left`;

    emptyMessage.hidden = visibleTodos.length > 0;

    filterButtons.forEach(button => {
        const selected = button.dataset.filter === currentFilter;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
}

todoForm.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault(); 

    const text = todoInput.value.trim();
    if (text === "") return;

    todos.push({ id: nextId++, text: text, completed: false });
    todoInput.value = "";
    todoInput.focus();
    renderTodos();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        if (filter === "all" || filter === "active" || filter === "completed") {
            currentFilter = filter;
            renderTodos();
        }
    });
});

clearCompletedButton.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
});

clearAllButton.addEventListener("click", () => {
    todos = [];
    renderTodos();
});

renderTodos();
