module.exports = function (req, res, next) {

    if (req.user.rule !== "Admin") return res.status(403).send('Only admin can access.');

    next();
}