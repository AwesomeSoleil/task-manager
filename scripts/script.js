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
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'enter new task');
    input.required = true;
    const calendar = document.createElement('input');
    calendar.setAttribute('type', 'date');
    calendar.setAttribute('min', `${new Date().toISOString().split('T')[0]}`);
    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', 'add new task');
    const showCompleted = document.createElement('input');
    showCompleted.setAttribute('type', 'checkbox');
    showCompleted.setAttribute('name', 'completed');
    showCompleted.addEventListener('click', filter);
    form.appendChild(input);
    form.appendChild(calendar);
    form.appendChild(submitButton);
//    form.appendChild(showCompleted);
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
        const subjectField = document.createElement('div');
        subjectField.className = 'task-subject';
        subjectField.appendChild(document.createTextNode(`${task.subject}`));
        const dueDateField = document.createElement('div');
        dueDateField.className = 'task-deadline';
        dueDateField.appendChild(document.createTextNode(`${task.dueDate}`));
        const deleteButton = document.createElement('div');
        deleteButton.className = 'task-delete';        
        const removeTaskButton = document.createElement('button');
        removeTaskButton.setAttribute('type', 'button');
        removeTaskButton.appendChild(document.createTextNode('x'));
        removeTaskButton.addEventListener('click', removeTask);
        deleteButton.appendChild(removeTaskButton);
        const completedCheckbox = document.createElement('div');
        completedCheckbox.className = 'task-completed';       
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.checked = task.isCompleted;
        checkbox.addEventListener('click', toggleCompleted);
        completedCheckbox.appendChild(checkbox);
        listItem.appendChild(subjectField);
        listItem.appendChild(dueDateField);
        listItem.appendChild(completedCheckbox);
        listItem.appendChild(deleteButton);
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

    function filter() {
        let filteredTasks;
        if (event.target.name === 'completed') {
        filteredTasks = tasks.filter(function(task) {return task.isCompleted === true});
    }
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