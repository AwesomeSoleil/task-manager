(function() {

    const mount = document.querySelector('#mount');
    const list = document.createElement('ul');
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.setAttribute('name', 'subject');
    input.setAttribute('placeholder', 'enter new task');
    input.required = true;
    const calendar = document.createElement('input');
    calendar.setAttribute('type', 'date');
    calendar.setAttribute('name', 'due');
    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', 'add new task');
    form.appendChild(input);
    form.appendChild(calendar);
    form.appendChild(submitButton);
    form.addEventListener('submit', addTask);
    mount.appendChild(form);
    mount.appendChild(list);

    renderList();

    function Task(subject, dueDate) {
        this.id = Date.now();
        this.subject = subject;
        this.dueDate = dueDate;
    }

    function createListItem(task) {
        const listItem = document.createElement('li');
//        listItem.setAttribute('id', task.id);
        const removeTaskButton = document.createElement('button');
        listItem.appendChild(document.createTextNode(`${task.subject} deadline: ${task.dueDate}`));
        removeTaskButton.setAttribute('type', 'button');
        removeTaskButton.setAttribute('id', task.id);
        removeTaskButton.appendChild(document.createTextNode('x'));
        removeTaskButton.addEventListener('click', removeTask);
        listItem.appendChild(removeTaskButton);
        list.appendChild(listItem);
    }

    function addTask(event) {
        event.preventDefault();
        let tasks;
        if (localStorage.getItem('tasks')) {
            tasks = JSON.parse(localStorage.getItem('tasks'));                           
        } else {
            tasks = [];
        }
        tasks.push(new Task(input.value, calendar.value));
        localStorage.setItem('tasks', JSON.stringify(tasks));           
        createListItem(input.value);
        form.reset();
        renderList();
    }

    function renderList() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        list.innerHTML = '';
        if(tasks) {
            tasks.forEach(function(task) {
                    createListItem(task);
                }
            );
        }   
    }

    function removeTask(event) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskToRemove = tasks.findIndex(function(task) { return task.id == event.target.id });
        tasks.splice(taskToRemove, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderList();
    }
}());