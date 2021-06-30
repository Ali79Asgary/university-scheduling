const {User} = require('../../models/user')
const bcrypt = require("bcrypt");

async function createUser(userDetails){
    let user = await User.findOne({ code: userDetails.code });
    if (user)
        throw new Error(`One user with the name ${user.code} already exists.`)
    user = new User(userDetails);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
}

module.exports.insertUser = createUser