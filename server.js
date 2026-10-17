// Destiny's to-do app
//load settings from the .env file
require('dotenv').config();

//Bring in the the libaries and the task routes
const express = require('express');
const mongoose = require('mongoose');
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

//Connect to MongoDB, then start the server
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Could not connect to MongoDB:', err.message);
        process.exit(1);
    });