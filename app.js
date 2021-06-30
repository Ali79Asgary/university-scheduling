const express = require('express');
const users = require('./routes/users');
const auth = require('./routes/auth');
const courses = require('./routes/course')
const app = express();

/*
    Parses incoming requests with JSON payloads
*/
app.use(express.json());

/*
    Adding routes to the express application
*/
app.use('/api/Users', users);
app.use('/api/Auth', auth);
app.use('/api/Courses', courses);

module.exports = app
