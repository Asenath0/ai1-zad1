class TaskManager {
    tasks = [{task: "Zadanie 1", date: "2025-01-01", checked: false},
        {task: "Zrobić danie", date: "2025-01-01", checked: false},
        {task: "Kupić mleko", date: "2025-01-01", checked: false}]

    filteredTasks = [{task: "Zadanie 1", date: "2025-01-01", checked: false},
        {task: "Zrobić danie", date: "2025-01-01", checked: false},
        {task: "Kupić mleko", date: "2025-01-01", checked: false}]
    phrase = ''

    draw = () => {
        const wrapper = document.querySelector("#tasks")
        wrapper.innerHTML = "";

        const isFiltered = this.phrase.length > 0

        this.filteredTasks.map((task, id) => {
            const section = document.createElement("section")
            section.className="task"

            section.onclick = () => this.convertToInputs(section)

            const box1 = document.createElement("div")
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.checked = task.checked

            checkbox.onchange = (e) => this.edit(id, e.target.checked)

            const taskName = document.createElement("p")
            const taskNameContent = task.task.split(this.phrase)
            taskName.innerHTML = this.phrase.length >= 2 ?
                `${taskNameContent[0]}<mark>${this.phrase}</mark>${taskNameContent[1]}`
                : task.task
            box1.append(checkbox)
            box1.append(taskName)

            const box2 = document.createElement("div")
            const date = document.createElement("p")
            date.innerHTML = task.date
            const button = document.createElement("button")
            button.innerHTML = "delete"
            button.onclick = () => this.delete(id)

            box2.append(date)
            box2.append(button)

            section.append(box1)
            section.append(box2)
            section.id = id;
            wrapper.append(section)
        })


    }

    convertToInputs = (element) => {
        const task = this.tasks[element.id]
    
    }

    add = () => {
        const task = document.querySelector("#task-input").value
        const date = document.querySelector("#date-input").value

        this.tasks.push({task, date, checked: false})
        this.draw()
    }

    delete = (id) => {
        this.tasks.splice(id, 1);
        this.draw()
    }

    edit = (id, checked, task, date) => {
        const newTask = this.tasks[id]

        newTask.checked = checked
        newTask.task = task ? task : newTask.task
        newTask.date = date ? date : newTask.date

        this.tasks[id] = newTask
        this.draw()
    };

    validateTaskName = (name) => {
        return name.length > 2
    }

    bindForm = () => {
        const formButton = document.querySelector("#add")
        formButton.onclick = () => this.add()
    }

    bindSearchBar = () => {
        const searchBar = document.querySelector('#search-input')
        searchBar.oninput = (e) => this.filterTasks(e.target.value)
    }

    bindElements = () => {
        this.bindForm()
        this.bindSearchBar()
    }

    filterTasks = (phrase) => {
        if (phrase.length < 2) {
            this.phrase = ''
            this.filteredTasks = this.tasks
            this.draw()
            return
        }

        this.phrase = phrase
        this.filteredTasks = this.tasks.filter(task => task.task.includes(phrase))
        this.draw()
    }
}



window.onload = () => {
    const manager = new TaskManager();
    manager.draw();

    manager.bindElements()
};