// Bring in Node's built-in testing tools and the Task model
const test = require('node:test');
const assert = require('node:assert');
const Task = require('../models/Task');

// A task with no title should be rejected
test('a task without a title is rejected', async () => {
    const task = new Task({});
    await assert.rejects(task.validate(), (err) => {
        assert.ok(err.errors.some((e) => e.path === 'title'));
        return true;
    });
});

// A new task should start as not done
test('a new task starts as not done', () => {
    const task = new Task({ title: 'Buy milk' });
    assert.strictEqual(task.done, false);
});