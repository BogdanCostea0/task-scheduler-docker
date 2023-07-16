const express = require('express');
const app = express();
const port = 5000;

app.use(express.static('public'));

app.use(express.json());

const tasks = [
  { id: 1, title: 'Task 1', description: 'This is task 1' },
  { id: 2, title: 'Task 2', description: 'This is task 2' },
  { id: 3, title: 'Task 3', description: 'This is task 3' }
];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === taskId);

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;

  const newTask = {
    id: tasks.length + 1,
    title,
    description
  };

  tasks.push(newTask);

  res.json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.listen(port, () => {
  console.log(`Task Scheduler app is running on port ${port}`);
});
