module.exports = function (req, res, next) {

    if (req.user.role !== "Admin")
        return res.status(403).send('Only admin can access to this API.');

    next();
}