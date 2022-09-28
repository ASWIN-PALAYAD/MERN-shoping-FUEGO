const express = require('express');
const app = express();
const ErrorHandler = require('./middleware/error')

app.use(express.json());

//route imports
const product = require('./routes/ProductRoute');
const user = require('./routes/UserRoute');

app.use('/api/v2',product);
app.use('/api/v2',user);


app.use(ErrorHandler);





module.exports = app