const mongoose = require('mongoose');
const app = require('./app')

/*
    Loading configuration variables e.g DB port
*/
const config = require('./config/development-config.json')

/*
    Check for configuration variables that are defined as environment variables
*/
config.NODE_APP_PORT = process.env.NODE_APP_PORT || config.NODE_APP_PORT
config.MONGODB_PORT = process.env.MONGODB_PORT || config.MONGODB_PORT
config.MONGODB_HOST = process.env.MONGODB_HOST || config.MONGODB_HOST
config.MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || config.MONGODB_PASSWORD
config.MONGODB_USER = process.env.MONGODB_USER || config.MONGODB_USER

/*
    Connect to database using the credentials defined in config/{development/production}-config.json file
*/
const DB_URL = `mongodb://${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.MONGODB_DB_NAME}`
mongoose.connect(DB_URL, config.MONGOOSE_config)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

/*
    Start the express application and begin listening for connection
*/
app.listen(
    config.NODE_APP_PORT, 
    () => console.log(`Listening on port ${config.NODE_APP_PORT}...`)
);

module.exports = app
