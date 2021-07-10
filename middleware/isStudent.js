module.exports = function (req, res, next) {

    console.log()
    if (req.user.role !== "Student")
        return res.status(403).send('Only students can access to this API.');

    next();
}