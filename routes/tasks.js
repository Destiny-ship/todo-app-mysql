// fetch Express for handling requests
const express = require('express');

// fetch the Task model to save, find, update and delete tasks
const Task = require('../models/Task');

// Create an empty list to hold the routes
const router = express.Router();

// When asked for all tasks, get them from the database and send them back
router.get('/', async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

// When a new task is sent, save it and send it back
router.post('/', async (req, res) => {
    const task = await Task.create({ title: req.body.title });
    res.status(201).json(task);
});

// When a task is ticked or unticked, update it and send it back
router.patch('/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    await task.update({ done: req.body.done });
    res.json(task);
});

// When a task is deleted, remove it from the database
router.delete('/:id', async (req, res) => {
    await Task.destroy({ where: { id: req.params.id } });
    res.status(204).end();
});

// Share the routes with other files
module.exports = router;