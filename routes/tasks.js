// fetch Express for handling requests
const express = require('express');

//fetch model/Task to save, find, update and delete tasks.
const Task = require('../models/Task');

//Create an empty list to hold the routes
const router = express.Router();

// When asked for all tasks, get them from the database and send them back
router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

//When a new book is sent, save it and send it back
router.post('/', async (req, res) => {
    const task = await Task.create ({ title: req.body.title });
    res.status(201).json(task);
});

// Share the routes with other file
module.exports = router;

//When a task is ticked or unticked, update it and send it back
router.patch('/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        { done: req.body.done },
        { returnDocument: 'after' }
    );
    res.json(task);
});

// When a task is deleted, remove it from the database
router.delete('/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
});
