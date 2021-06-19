module.exports = function (req, res, next) {

    if (req.user.rule !== "Student")
        return res.status(403).send('Only students can access to this API.');

    next();
}