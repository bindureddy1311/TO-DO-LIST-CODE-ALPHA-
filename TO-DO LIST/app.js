// app.js

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filterCategory = document.getElementById('filterCategory');

    // Load tasks from local storage when the page loads
    loadTasks();

    // Function to add a task
    function addTask() {
        const taskText = taskInput.value.trim();
        const category = taskCategory.value;
        const priority = taskPriority.value;

        if (taskText !== '') {
            const task = {
                text: taskText,
                category: category,
                priority: priority,
                completed: false
            };

            saveTask(task);
            displayTask(task);
            taskInput.value = '';
        }
    }

    // Save task to local storage
    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from local storage
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => displayTask(task));
    }

    // Display task in the task list
    function displayTask(task) {
        const li = document.createElement('li');
        li.textContent = `${task.text} [${task.category}]`;
        li.classList.add(getPriorityClass(task.priority));

        if (task.completed) {
            li.classList.add('completed');
        }

        // Mark task as completed
        li.onclick = () => {
            task.completed = !task.completed;
            li.classList.toggle('completed');
            updateTask(task);
        };

        // Add a delete button to the task
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = (e) => {
            e.stopPropagation();  // Prevent triggering the li click event
            taskList.removeChild(li);
            deleteTask(task);
        };

        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    // Get CSS class for priority
    function getPriorityClass(priority) {
        switch (priority) {
            case 'High':
                return 'priority-high';
            case 'Medium':
                return 'priority-medium';
            case 'Low':
                return 'priority-low';
            default:
                return '';
        }
    }

    // Update task in local storage
    function updateTask(updatedTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => task.text === updatedTask.text ? updatedTask : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Delete task from local storage
    function deleteTask(taskToDelete) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.text !== taskToDelete.text);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Filter tasks by category
    filterCategory.onchange = () => {
        const selectedCategory = filterCategory.value;
        filterTasks(selectedCategory);
    };

    function filterTasks(category) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach(task => {
            if (category === 'All' || task.category === category) {
                displayTask(task);
            }
        });
    }

    // Add task when clicking the button
    addTaskButton.onclick = addTask;

    // Add task when pressing Enter
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });
});