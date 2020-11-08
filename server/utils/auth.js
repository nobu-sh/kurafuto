const { User } = require('../models/mongo')
const argon2 = require('argon2')
module.exports = async (req, res, next) => {
  if (!req.session.username || !req.session.password) {
    req.session.username = null
    req.session.password = null

    return res.status(401).json({
      isAuth: false,
      reason: "No recent login creds saved",
    })
  } else {
    const user = await User.findOne({ username: req.session.username })

    if (!user) {
      req.session.username = null
      req.session.password = null
  
      return res.status(404).json({
        isAuth: false,
        reason: "User does not exist",
      })
    } else {
      if (await argon2.verify(user.password, req.session.password)) {
  
        return next()
      } else {
        req.session.username = null
        req.session.password = null
  
        return res.status(401).json({
          isAuth: false,
          reason: "Incorrect credentials",
        })
      }
    }
  }
}
