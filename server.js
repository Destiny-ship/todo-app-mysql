// Destiny's to-do app
//load settings from the .env file
require('dotenv').config();

//Bring in the the libaries and the task routes
const express = require('express');
const sequelize = require('./db');
const taskRoutes = require('./routes/tasks');

//Creeate the app and choose the port
const app = express();
const PORT = process.env.PORT || 3080;

//Set up how the app handles requests
app.use(express.json());
app.use(express.static('public'));
app.use('/api/tasks', taskRoutes);

// Health check: lets the pipeline (and later Kubernetes) ask "are you alive?"
app.get('/health', (req, res) => {
    res.send('OK');
});

//Connect to MySQL, create the table when needed, then start the server
sequelize.sync()
    .then(() => {
        console.log('Connected to MySQL');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Could not connect to MySQL:', err.message);
        process.exit(1);
    });