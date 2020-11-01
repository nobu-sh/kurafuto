const config = require("../../kurafuto.config")
const mongoose = require('mongoose');const options = {
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true, 
}
module.exports = mongoose.connect(`mongodb+srv://${config.mongoUsername}:${config.mongoPassword}${config.mongoEndpoint}${config.mongoDatabase}?retryWrites=true&w=majority`,options)
