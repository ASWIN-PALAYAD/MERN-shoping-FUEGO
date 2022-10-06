const express = require('express');
const ErrorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser');




const app = express();
app.use(express.json());
app.use(cookieParser());

//route imports
const product = require('./routes/ProductRoute');
const user = require('./routes/UserRoute');
const order = require('./routes/OrderRoute');

app.use('/api/v2',product);
app.use('/api/v2',user);
app.use('/api/v2',order)

//its for error handling
app.use(ErrorHandler);





module.exports = app