const bcrypt = require('bcryptjs')
const comparePassword = async (pass, extPass) => {
    let status = await bcrypt.compare(pass,extPass)
    return status;
}
module.exports = comparePassword