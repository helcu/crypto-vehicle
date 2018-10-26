const express = require('express');
const morgan = require('morgan');
const path = require('path');


const app = express();
// Db connection
const { mongoose } = require('./database');

// Settings 
app.set('port', process.env.PORT || 8080);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Routes
//app.use('/api', require('./routes/'));
app.use('/api/transactions', require('./routes/transactions.routes'));

// Static Files
app.use(express.static(path.join(__dirname, 'build')));

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});