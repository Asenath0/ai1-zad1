class TaskManager {
    tasks = [{task: "task1", date: "2025-01-01", checked: false}]

    draw = () => {
        console.log(this.tasks)
        const wrapper = document.querySelector("#tasks")
        wrapper.innerHTML = "";

        this.tasks.map((task, id) => {
            const section = document.createElement("section")
            section.className="task";

            section.onclick = () => this.convertToInputs(section)

            const box1 = document.createElement("div")
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.checked = task.checked

            checkbox.onchange = (e) => this.edit(id, e.target.checked)

            const taskName = document.createElement("p")
            taskName.innerHTML = task.task

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
        
        console.log(task.chlildren)
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
}



window.onload = () => {
    const manager = new TaskManager();
    manager.draw();

    manager.bindForm()
};