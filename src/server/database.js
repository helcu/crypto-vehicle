const mongoose = require('mongoose');

const URI = 'mongodb://global:Global123@ds029541.mlab.com:29541/crypto-vehicle';

mongoose.connect(URI, { useNewUrlParser: true })
    .then(db => console.log('Connected to ' + URI))
    .catch(err => console.error(err));

module.exports = mongoose;