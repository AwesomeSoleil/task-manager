(function() {

    let tasks;
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));                           
    } else {
        tasks = [];
    }

//  *************** form ***************
    const mount = document.querySelector('#mount');
    const container = document.createElement('div');
    container.setAttribute('id', 'container');
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
    form.appendChild(input);
    form.appendChild(calendar);
    form.appendChild(submitButton);
    form.addEventListener('submit', addTask);
    container.appendChild(form);
    createFilter();
    container.appendChild(list);
    mount.appendChild(container);

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
        subjectField.appendChild(document.createTextNode(task.subject));
        const dueDateField = document.createElement('div');
        dueDateField.className = 'task-deadline';
        dueDateField.appendChild(document.createTextNode(task.dueDate));
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

    function createFilter() {
        const values = ['all', 'completed', 'overdue'];
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.appendChild(document.createTextNode('show: '));
        fieldset.appendChild(legend);
        values.forEach(function(value) {
                const radioButton = document.createElement('input');
                radioButton.setAttribute('type', 'radio');
                radioButton.setAttribute('name', 'filter');
                radioButton.setAttribute('value', value);
                if (value === 'all') {
                    radioButton.checked = true;
                }
                radioButton.addEventListener('click', filter);
                const label = document.createElement('label');
                label.appendChild(document.createTextNode(value));
                label.appendChild(radioButton);
                fieldset.appendChild(label);
            }
        );
        container.appendChild(fieldset);
    }

    function addTask(event) {
        event.preventDefault();
        tasks.push(new Task(input.value, calendar.value));
        localStorage.setItem('tasks', JSON.stringify(tasks));           
        form.reset();
        renderList(tasks);
    }

    function removeTask(event) {
        const index = tasks.findIndex(function(task) { return task.id == event.path[2].id });
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderList(tasks);
    }

    function toggleCompleted(event) {
        const task = tasks.find(function(task) { return task.id == event.path[2].id });
        task.isCompleted = !task.isCompleted;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function filter() {
        let filteredTasks;
        switch(event.target.value) {
            case 'all': filteredTasks = tasks;
            break;
            case 'completed': filteredTasks = tasks.filter(function(task) {
                                                            return task.isCompleted === true;
                                                        }
                                                    );
            break;
            case 'overdue': filteredTasks = tasks.filter(function(task) {
                                                        const rightNow = new Date();
                                                        const deadline = new Date(task.dueDate);
                                                        return rightNow > deadline;
                                                    }
                                                );
            break;
            default: filteredTasks = tasks;
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