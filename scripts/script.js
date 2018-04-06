(function() {
    let tasks;//
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
        if (dueDate == '') {
            this.dueDate = 'not specified';
        } else {
            this.dueDate = dueDate;
        }
        this.id = Date.now();
        this.subject = subject;
        this.isCompleted = false;
    }

    function createListItem(task) {
        const listItem = document.createElement('li');
        listItem.setAttribute('id', task.id);
        listItem.appendChild(document.createTextNode(`${task.subject} deadline: ${task.dueDate}`));
        const removeTaskButton = document.createElement('button');
        removeTaskButton.setAttribute('type', 'button');
        removeTaskButton.appendChild(document.createTextNode('x'));
        removeTaskButton.addEventListener('click', removeTask);
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', toggleCompleted);
        listItem.appendChild(checkbox);
        listItem.appendChild(removeTaskButton);
        list.appendChild(listItem);
    }

    function addTask(event) {
        event.preventDefault();
//        let tasks;
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
        const index = tasks.findIndex(function(task) { return task.id == event.path[1].id });
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderList();
    }

    function toggleCompleted(event) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const task = tasks.find(function(task) { return task.id == event.path[1].id });
        console.log('befor toggle ', task.isCompleted);
        task.isCompleted = !task.isCompleted;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}());