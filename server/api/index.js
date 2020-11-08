const { User } = require('../models/mongo')
const argon2 = require('argon2')
const router = require('express').Router()
const isAuth = require('../utils/auth')
const IH = require('../utils/instanceHandler')
const { ServerInstancer } = require('../instances/server')

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

router.post('/isonline', isAuth, (req, res) => {
  if (!req.body.serverName) {
    return res.status(400).json({
      "info": "Bad Request",
    })
  }
  let name = res.body.serverName
  let server = fakeServerList.find(s => s.name === name)
  if (!server) {
    return res.status(200).json({
      serverExist: false,
    })
  }
  res.status(200).json({
    serverExist: true,
    isOnline: server.Is_Online(),
  })
})

// Create Server Instance
router.post('/server/instance', (req, resp) => {
  if (!req.body.path || !req.body.name || !req.body.port) {
    return resp.status(400).json({
      "info": "Bad Request",
      "request": {
        "path": "C:\\Kurafuto\\Minecraft\\bedrock_server_mod.exe",
        "name": "Super Neat MC Server",
        "port": 123456,
      },
      "hint": "'\' is an escape sequence, keep that in mind when specifying the file path",
    })
  }
  IH.add(req.body.path, req.body.name, `${req.body.port}`).then(res => {
    ServerInstancer.refresh()
    resp.status(200).json(res)
  })
})

// Update Server Instance
router.patch('/server/instance', isAuth, (req, resp) => {
  // Make it update instance if exist
  if (!req.body.name) {
    return resp.status(400).json({
      "info": "Bad Request",
      "request": {
        "name": "",
        "?newName": "",
        "?newPath": "",
        "?newPort": "",
      },
      "hint": "'\' is an escape sequence, keep that in mind when specifying the file path",
      "hint": "? should not be included in request, ? means optional. (At least 1 of the fields marked with '?' are required)",
    })
  }
  if (!req.body.newPath || !req.body.newName || !req.body.newPort) {
    return resp.status(400).json({
      "info": "Bad Request",
      "request": {
        "name": "",
        "?newName": "",
        "?newPath": "",
        "?newPort": "",
      },
      "hint": "'\' is an escape sequence, keep that in mind when specifying the file path",
      "hint": "? should not be included in request, ? means optional. (At least 1 of the fields marked with '?' are required)",
    })
  }
  IH.update(req.body.name, req.body.newName ? req.body.newName : null, req.body.newPath ? req.body.newPath : null, req.body.newPort ? req.body.newPort : null).then(async res => {
    await ServerInstancer.killByName(req.body.name)
    ServerInstancer.refresh()
    resp.status(200).json(res)
  })
})

// Delete Server Instance
router.delete('/server/instance', async (req, resp) => {
  if (!req.body.name) {
    return resp.status(400).json({
      "info": "Bad Request",
      "request": {
        "name": "",
      },
    })
  }
  await ServerInstancer.killByName(req.body.name)
  IH.remove(req.body.name).then(res => {
    ServerInstancer.refresh()
    resp.status(200).json(res)
  })
})

// Get One Server Instance
router.get('/server/instance/one', isAuth, (req, resp) => {
  IH.getOne(req.body.name).then(res => {
    resp.status(200).json(res)
  })
})

// Get All Server Instances
router.get('/server/instance/all', isAuth, (req, resp) => {
  IH.getAll().then(res => {
    resp.status(200).json(res)
  })
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
