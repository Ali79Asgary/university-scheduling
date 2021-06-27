const express = require('express');
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = express();


app.use(express.json());
app.use('/api/Users', users);
app.use('/api/Auth', auth);


module.exports = app
