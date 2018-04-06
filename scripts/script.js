(function() {

    let tasks;
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));                           
    } else {
        tasks = [];
    }

//  *************** form ***************
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
    const showCompleted = document.createElement('input');
    showCompleted.setAttribute('type', 'checkbox');
    showCompleted.addEventListener('click', filter('completed'));
    form.appendChild(input);
    form.appendChild(calendar);
    form.appendChild(submitButton);
    form.appendChild(showCompleted);
    form.addEventListener('submit', addTask);
    mount.appendChild(form);
    mount.appendChild(list);

//  *************** form ***************

    renderList(tasks);

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
        checkbox.checked = task.isCompleted;
        checkbox.addEventListener('click', toggleCompleted);
        listItem.appendChild(checkbox);
        listItem.appendChild(removeTaskButton);
        list.appendChild(listItem);
    }

    function addTask(event) {
        event.preventDefault();
        tasks.push(new Task(input.value, calendar.value));
        localStorage.setItem('tasks', JSON.stringify(tasks));           
        createListItem(input.value);
        form.reset();
        renderList(tasks);
    }

    function removeTask(event) {
        const index = tasks.findIndex(function(task) { return task.id == event.path[1].id });
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderList(tasks);
    }

    function toggleCompleted(event) {
        const task = tasks.find(function(task) { return task.id == event.path[1].id });
        task.isCompleted = !task.isCompleted;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function filter(criteria) {
        let filteredTasks;
        if (criteria === 'completed') {
        filteredTasks = tasks.filter(function(task) {return task.isCompleted === true});
    }
        console.log(filteredTasks);
        renderList(filteredTasks);
    }

    function renderList(tasks) {
        list.innerHTML = '';
        if(tasks) {
            tasks.forEach(function(task) {
                    createListItem(task);
                }
            );
        }   
    }
}());