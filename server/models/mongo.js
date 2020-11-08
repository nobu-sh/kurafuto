const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { versionKey: false })

const serverInstance = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  port: {
    type: String,
    required: true,
  },
}, { versionKey: false })

module.exports = {
  User: mongoose.model('users', userSchema, 'users'),
  ServerInstance: mongoose.model('serverinstances', serverInstance, 'serverinstances'),
}
