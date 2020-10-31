const router = require('express').Router()

/* 
  This would be http://localhost:8080/api/
*/

router.get('/', (req, res) => res.send('Hello world!'))

module.exports = router
