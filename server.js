const mongoose = require('mongoose');
const app = require('./app')

/*
    Loading configuration variables e.g
*/
const config = require('./config/development-config.json')

/*
    Check for configuration variables that are defined as environment variables
*/
config.NODE_APP_PORT = process.env.NODE_APP_PORT || config.NODE_APP_PORT
config.MONGODB_PORT = process.env.MONGODB_PORT || config.MONGODB_PORT
config.MONGODB_HOST = process.env.MONGODB_HOST || config.MONGODB_HOST

/*
    Connect to database using the credentials defined in config/{development/production}-config.json file
*/
mongoose.connect(`mongodb://${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.MONGODB_DB_NAME}`, 
    config.MONGOOSE_config)
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
