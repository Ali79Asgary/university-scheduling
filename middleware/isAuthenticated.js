const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // const token = req.header('Authorization');
    // if (!token) return res.status(401).send('Access denied. No token provided.');

    // try {
    //     req.user = jwt.verify(token, 'wonderland');
    //     next();
    // }
    // catch (ex) {
    //     res.status(400).send('Invalid token.');
    // }
    next()
}