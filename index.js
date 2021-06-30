const Joi = require('joi');
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const courses = require('./routes/course')
const express = require('express');
const app = express();

const opts = {
    MONGOOSE_OPTS: { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    },
    MONGODB_PORT: process.env.MONGODB_PORT || 27017,
    MONGODB_DB_NAME: "uni",
    MONGODB_HOST: "localhost"
}

mongoose.connect(`mongodb://${opts.MONGODB_HOST}:${opts.MONGODB_PORT}/${opts.MONGODB_DB_NAME}`, opts.MONGOOSE_OPTS)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/Users', users);
app.use('/api/Auth', auth);
app.use('/api/Courses', courses);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
