const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    
    res.json({gg:'gg'});
  });

  module.exports = router