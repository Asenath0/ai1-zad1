class TaskManager {
  tasks = [];

  filteredTasks = [];
  phrase = "";

  editedElementId = null;

  saveToLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  };

  loadFromLocalStorage = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  };

  draw = () => {
    const wrapper = document.querySelector("#tasks");
    wrapper.innerHTML = "";

    this.filteredTasks.map((task, id) => {
      const taskElement = this.#renderTask(task, id, false);
      wrapper.append(taskElement);
    });
  };

  #renderTask = (task, id, isEdited) => {
    const section = document.createElement("section");
    section.className = "task";
    section.id = id;

    if (!isEdited) {
      section.onclick = () => this.convertToInputs(section);
    } else {
      section.classList.add("editing");
    }

    const box1 = this.#createFirstBox(task, id, isEdited);
    const box2 = this.#createSecondBox(task, id, isEdited);

    section.append(box1, box2);
    return section;
  };

  #createFirstBox = (task, id, isEdited) => {
    const box = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.checked;

    checkbox.onclick = (e) => {
      e.stopPropagation();
      this.edit(id, e.target.checked);
    };

    const taskElement = isEdited
      ? this.#createInput("text", task.task)
      : this.#createTextElement("p", task.task);

    box.append(checkbox, taskElement);
    return box;
  };

  #createSecondBox = (task, id, isEdited) => {
    const box = document.createElement("div");

    const dateElement = isEdited
      ? this.#createInput("date", task.date)
      : this.#createTextElement("p", task.date);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "delete";
    deleteButton.onclick = () => this.delete(id);

    box.append(dateElement, deleteButton);
    return box;
  };

  #createInput = (type, value) => {
    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    return input;
  };

  #createTextElement = (tag, content) => {
    const element = document.createElement(tag);

    if (this.phrase.length >= 2 && content.includes(this.phrase)) {
      const parts = content.split(this.phrase);
      element.innerHTML = `${parts[0]}<mark>${this.phrase}</mark>${parts[1]}`;
    } else {
      element.innerHTML = content;
    }

    return element;
  };

  #confirmEdit = () => {
    if (this.editedElementId) {
      const editedElement = document.getElementById(this.editedElementId);
      const checked = editedElement.querySelector(
        'input[type="checkbox"]'
      ).checked;
      const task = editedElement.querySelector('input[type="text"]').value;
      const date = editedElement.querySelector('input[type="date"]').value;

      if (!this.validateTaskName(task)) {
        alert("Task name must be at least 3 characters long.");
        return;
      }

      if (!this.validateDate(date)) {
        alert("Please select a valid date.");
        return;
      }

      this.edit(this.editedElementId, checked, task, date);
      this.editedElementId = null;

      this.draw();
    }
  };

  #renderOutsideClick = () => {
    const target = document.createElement("div");
    target.id = "outside-click-target";

    target.onclick = (e) => {
      this.#confirmEdit();
    };

    return target;
  };

  convertToInputs = (element) => {
    const task = this.tasks[element.id];
    this.editedElementId = element.id;
    element.before(this.#renderOutsideClick());
    element.replaceWith(this.#renderTask(task, element.id, true));
  };

  add = () => {
    const task = document.querySelector("#task-input").value;
    const date = document.querySelector("#date-input").value;

    if (!this.validateTaskName(task)) {
      alert("Task name must be at least 3 characters long.");
      return;
    }

    if (!this.validateDate(date)) {
      alert("Please select a valid date.");
      return;
    }

    this.tasks.push({ task, date, checked: false });
    this.filteredTasks = this.tasks;
    this.saveToLocalStorage();
    this.draw();
  };

  delete = (id) => {
    const actualTask = this.filteredTasks[id];
    const actualIndex = this.tasks.findIndex((t) => t === actualTask);

    this.tasks.splice(actualIndex, 1);
    this.filterTasks(this.phrase);
    this.saveToLocalStorage();
    this.draw();
  };

  edit = (id, checked = false, task, date) => {
    const newTask = this.tasks[id];

    newTask.checked = checked;
    newTask.task = task ? task : newTask.task;
    newTask.date = date ? date : newTask.date;

    this.tasks[id] = newTask;
    this.saveToLocalStorage();
    this.draw();
  };

  validateTaskName = (name) => {
    return name.length > 2;
  };

  validateDate = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return date >= today;
  };

  bindForm = () => {
    const formButton = document.querySelector("#add");
    formButton.onclick = () => this.add();
  };

  bindSearchBar = () => {
    const searchBar = document.querySelector("#search-input");
    searchBar.oninput = (e) => this.filterTasks(e.target.value);
  };

  filterTasks = (phrase) => {
    if (phrase.length < 2) {
      this.phrase = "";
      this.filteredTasks = this.tasks;
      this.draw();
      return;
    }

    this.phrase = phrase;
    this.filteredTasks = this.tasks.filter((task) =>
      task.task.includes(phrase)
    );
    this.draw();
  };

  initialize = () => {
    this.loadFromLocalStorage();
    this.filteredTasks = this.tasks;
    this.draw();
    this.bindForm();
    this.bindSearchBar();
  };
}

window.onload = () => {
  const manager = new TaskManager();
  manager.initialize();
};
