module.exports = function (req, res, next) {

    if (req.user.rule !== "Master" && req.user.rule !== "Admin")
        return res.status(403).send('Only masters and admins can access to this API.');

    next();
}