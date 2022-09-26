const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./db/Database'); //check this database file name

//config
dotenv.config({
    path:"backend/config/.env"
})


//connect database
connectDatabase();





//creating server
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})