// Bring in the data types, and the shared connection
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// The rules: what a task looks like (this becomes a table in MySQL)
const Task = sequelize.define('Task', {
    title: { type: DataTypes.STRING, allowNull: false },
    done: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Share the model with other files
module.exports = Task;