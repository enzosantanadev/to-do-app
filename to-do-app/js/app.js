
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = [];


window.addEventListener('DOMContentLoaded', () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();
});

// add
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if(taskText === '') return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
});

function renderTasks(filter = 'all') {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if(filter === 'all') return true;
        if(filter === 'completed') return task.completed;
        if(filter === 'pending') return !task.completed;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        if(task.completed) li.classList.add('completed');

        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <i class="fas fa-edit edit" data-id="${task.id}"></i>
                <i class="fas fa-check complete" data-id="${task.id}"></i>
                <i class="fas fa-trash delete" data-id="${task.id}"></i>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// save
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


taskList.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if(e.target.classList.contains('edit')) {
        editTask(id);
    } else if(e.target.classList.contains('complete')) {
        toggleCompleteTask(id);
    } else if(e.target.classList.contains('delete')) {
        deleteTask(id);
    }
});

// edit
function editTask(id) {
    const task = tasks.find(t => t.id == id);
    const newText = prompt('Editar tarefa:', task.text);
    if(newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}


function toggleCompleteTask(id) {
    const task = tasks.find(t => t.id == id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

// delete
function deleteTask(id) {
    tasks = tasks.filter(t => t.id != id);
    saveTasks();
    renderTasks();
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderTasks(btn.dataset.filter);
    });
});
