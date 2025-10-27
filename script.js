class TaskManager {
  tasks = [
    { task: "Zadanie 1", date: "2025-01-01", checked: false },
    { task: "Zrobić danie", date: "2025-01-01", checked: false },
    { task: "Kupić mleko", date: "2025-01-01", checked: false },
  ];

  filteredTasks = [
    { task: "Zadanie 1", date: "2025-01-01", checked: false },
    { task: "Zrobić danie", date: "2025-01-01", checked: false },
    { task: "Kupić mleko", date: "2025-01-01", checked: false },
  ];
  phrase = "";

  editedElementId = null;

  constructor() {
    this.loadFromLocalStorage();
  }

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

    const isFiltered = this.phrase.length > 0;

    this.filteredTasks.map((task, id) => {
      const section = document.createElement("section");
      section.className = "task";

      checkbox.onchange = (e) => this.edit(id, e.target.checked);

      const taskName = document.createElement("p");
      const taskNameContent = task.task.split(this.phrase);
      taskName.innerHTML =
        this.phrase.length >= 2
          ? `${taskNameContent[0]}<mark>${this.phrase}</mark>${taskNameContent[1]}`
          : task.task;
      box1.append(checkbox);
      box1.append(taskName);

      const box2 = document.createElement("div");
      const date = document.createElement("p");
      date.innerHTML = task.date;
      const button = document.createElement("button");
      button.innerHTML = "delete";
      button.onclick = () => this.delete(id);

      box2.append(date);
      box2.append(button);

      section.append(box1);
      section.append(box2);
      section.id = id;
      wrapper.append(section);
    });
  };

  #renderTask = (task, id, isEdited) => {
    const section = document.createElement("section");
    section.className = "task";
    section.id = id;

    if (!isEdited) {
      section.onclick = () => this.convertToInputs(section);
    }

    convertToInputs = (element) => {
      const task = this.tasks[element.id];
    };
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
    };

    checkbox.onchange = (e) => {
      e.stopPropagation();
      this.edit(id, e.target.checked);
    };

    const taskElement = isEdited
      ? this.#createInput("text", task.task, (e) =>
          this.edit(id, null, e.target.value)
        )
      : this.#createTextElement("p", task.task);

    box.append(checkbox, taskElement);
    return box;
  };

  #createSecondBox = (task, id, isEdited) => {
    const box = document.createElement("div");

    const dateElement = isEdited
      ? this.#createInput("date", task.date, (e) =>
          this.edit(id, null, null, e.target.value)
        )
      : this.#createTextElement("p", task.date);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "delete";
    deleteButton.onclick = () => this.delete(id);

    box.append(dateElement, deleteButton);
    return box;
  };

  #createInput = (type, value, changeHandler) => {
    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    if (changeHandler) {
      input.onchange = changeHandler;
    }
    return input;
  };

  #createTextElement = (tag, content) => {
    const element = document.createElement(tag);
    element.innerHTML = content;
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

    bindSearchBar = () => {
      const searchBar = document.querySelector("#search-input");
      searchBar.oninput = (e) => this.filterTasks(e.target.value);
    };

    bindElements = () => {
      this.bindForm();
      this.bindSearchBar();
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
    this.tasks.push({ task, date, checked: false });
    this.saveToLocalStorage();
    this.draw();
  };

  remove = (id) => {
    this.tasks.splice(id, 1);
    this.saveToLocalStorage();
    this.draw();
  };

  edit = (id, checked, task, date) => {
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
}

window.onload = () => {
  const manager = new TaskManager();
  manager.draw();

  manager.bindElements();
};
