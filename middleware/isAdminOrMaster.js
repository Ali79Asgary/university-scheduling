module.exports = function (req, res, next) {

    if (req.user.role !== "Master" && req.user.rule !== "Admin")
        return res.status(403).send('Only masters and admins can access to this API.');

    next();
}