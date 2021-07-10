module.exports = function (req, res, next) {

    if (req.user.role !== "Master")
        return res.status(403).send('Only masters can access to this API.');

    next();
}