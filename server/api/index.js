const { User } = require('../models/mongo')
const argon2 = require('argon2')
const router = require('express').Router()

router.get('/', (req, res) => res.send('Beep Boop Bop... This is where the magic happens'))

router.get('/isauth', async (req, res) => {
  if (!req.session.username || !req.session.password) {
    req.session.username = null
    req.session.password = null

    return res.status(200).json({
      isAuth: false,
      reason: "No recent login creds saved",
    })
  } else {
    const user = await User.findOne({ username: req.session.username })

    if (!user) {
      req.session.username = null
      req.session.password = null
  
      return res.status(200).json({
        isAuth: false,
        reason: "User does not exist",
      })
    } else {
      if (await argon2.verify(user.password, req.session.password)) {
  
        return res.status(200).json({
          isAuth: true,
          username: user.username,
        })
      } else {
        req.session.username = null
        req.session.password = null
  
        return res.status(200).json({
          isAuth: false,
          reason: "Incorrect credentials",
        })
      }
    }
  }
})

// Code 0 = good, code 1 = username but incorrect pass, code 2 = user no exist
router.post('/signin', async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    req.session.username = null
    req.session.password = null

    return res.status(200).json({
      responseCode: 2,
    })
  } else {
    if (await argon2.verify(user.password, req.body.password)) {
      req.session.username = req.body.username
      req.session.password = req.body.password

      return res.status(200).json({
        responseCode: 0,
      })
    } else {
      req.session.username = null
      req.session.password = null

      return res.status(200).json({
        responseCode: 1,
      })
    }
  }
})

router.post('/logout', async (req, res) => {
  req.session.username = null
  req.session.password = null
  res.sendStatus(200)
})
// Temp for testing
// router.post('/signup', async (req, res) => {
//   let newuser = await User.create({
//     username: req.body.username,
//     password: await argon2.hash(req.body.password),
//   })
//   newuser.save()
//   res.status(200).json(newuser)
// })

module.exports = router
