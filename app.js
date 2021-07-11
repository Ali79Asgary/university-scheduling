const express = require('express');
const users = require('./routes/users');
const auth = require('./routes/auth');
const courses = require('./routes/course')
const timeTableBells = require('./routes/timeTableBells')
const days = require('./routes/days')
const bells = require('./routes/bells')
const timeTables = require('./routes/timeTable')
const announcements = require('./routes/announcements')
const app = express();

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./config/swagger.json')

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
app.use('/api/Announcements', announcements)

/*
    Adding swagger UI
*/
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument) );

module.exports = app
