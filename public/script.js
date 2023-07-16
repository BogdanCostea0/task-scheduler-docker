document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const addTaskButton = document.getElementById('add-task');
    const deleteSelectedTasksButton = document.getElementById('delete-selected-tasks');
  
    const selectedTasks = new Set(); // Set to keep track of selected task IDs
  
    // Fetch tasks from the server and display them in the HTML
    function fetchTasks() {
      fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
          taskList.innerHTML = '';
  
          tasks.forEach(task => {
            const taskItem = createTaskElement(task);
            taskList.appendChild(taskItem);
          });
        })
        .catch(error => console.error(error));
    }
  
    // Create a new task element based on the task data
    function createTaskElement(task) {
      const taskItem = document.createElement('li');
      taskItem.classList.add('task-item');
      taskItem.dataset.taskId = task.id; // Set task ID as a data attribute
  
      const taskInfo = document.createElement('div');
      taskInfo.classList.add('task-info');
      taskInfo.innerText = `ID: ${task.id}, Title: ${task.title}, Description: ${task.description}`;
  
      const taskActions = document.createElement('div');
      taskActions.classList.add('task-actions');
  
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.addEventListener('click', () => {
        deleteTask(task.id);
      });
  
      taskActions.appendChild(deleteButton);
  
      taskItem.appendChild(taskInfo);
      taskItem.appendChild(taskActions);
  
      // Add click event listener to select/deselect tasks
      taskItem.addEventListener('click', () => {
        if (selectedTasks.has(task.id)) {
          selectedTasks.delete(task.id);
          taskItem.classList.remove('selected');
        } else {
          selectedTasks.add(task.id);
          taskItem.classList.add('selected');
        }
      });
  
      return taskItem;
    }
  
    // Add a new task
    function addTask() {
      const title = taskTitleInput.value;
      const description = taskDescriptionInput.value;
  
      if (title && description) {
        const task = {
          title,
          description
        };
  
        fetch('/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(newTask => {
          const taskItem = createTaskElement(newTask);
          taskList.appendChild(taskItem);
  
          taskTitleInput.value = '';
          taskDescriptionInput.value = '';
        })
        .catch(error => console.error(error));
      }
    }
  
    // Delete a task
    function deleteTask(taskId) {
      fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          fetchTasks();
        }
      })
      .catch(error => console.error(error));
    }
  
    // Delete selected tasks
    function deleteSelectedTasks() {
      const deletePromises = Array.from(selectedTasks).map(taskId => {
        return fetch(`/tasks/${taskId}`, {
          method: 'DELETE'
        });
      });
  
      Promise.all(deletePromises)
        .then(() => {
          selectedTasks.clear();
          fetchTasks();
        })
        .catch(error => console.error(error));
    }
  
    // Add task button click event
    addTaskButton.addEventListener('click', addTask);
  
    // Delete selected tasks button click event
    deleteSelectedTasksButton.addEventListener('click', deleteSelectedTasks);
  
    // Fetch tasks on page load
    fetchTasks();
  });
  