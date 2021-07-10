const express = require('express');
const users = require('./routes/users');
const auth = require('./routes/auth');
const courses = require('./routes/course')
const timeTableBells = require('./routes/timeTableBells')
const days = require('./routes/days')
const bells = require('./routes/bells')
const timeTables = require('./routes/timeTable')
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
app.use('/api/TimeTableBells', timeTableBells)
app.use('/api/Days', days);
app.use('/api/Bells', bells)
app.use('/api/TimeTables', timeTables)

module.exports = app
