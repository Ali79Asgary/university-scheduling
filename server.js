const mongoose = require('mongoose');
const app = require('./app')

const opts = {
    APP_PORT: process.env.PORT || 3000,
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

app.listen(opts.APP_PORT, () => console.log(`Listening on port ${opts.APP_PORT}...`));

module.exports = app
