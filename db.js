// Load settings, so MYSQL_URL is available
require('dotenv').config();

// Bring in Sequelize, the go-between for JavaScript and MySQL
const { Sequelize } = require('sequelize');

// Use the real address from settings, or a placeholder when none is set (e.g. when Jenkins runs the tests)
const sequelize = new Sequelize(process.env.MYSQL_URL || 'mysql://localhost:3306/todo', { logging: false });

// Share it with other files
module.exports = sequelize;