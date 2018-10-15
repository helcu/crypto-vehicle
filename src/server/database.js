const mongoose = require('mongoose');

const URI = 'mongodb://localhost/crytovehicle-db';

mongoose.connect(URI, { useNewUrlParser: true })
    .then(db => console.log('Connected to ' + URI))
    .catch(err => console.error(err));

module.exports = mongoose;