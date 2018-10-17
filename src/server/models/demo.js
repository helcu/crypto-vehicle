const mongoose = require('mongoose');
const { Schema } = mongoose;

const DemoSchema = new Schema({
    name: { type: String, required: false },
   
});

module.exports = mongoose.model('Demo', DemoSchema);