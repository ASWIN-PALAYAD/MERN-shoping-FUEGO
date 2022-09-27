const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./db/Database'); 

//Handling uncaught Exception
process.on('uncaughtException',(err)=>{
    console.log(`message : ${err.message}`);
    console.log(`Shutting down the Server for Handling uncaught Exception`);
})

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


//unhandled promis rejection
process.on('unhandledRejection',(err)=>{
    console.log(`Shutting down server for ${err.message}`);
    console.log(`Shutting down server due to Unhandled promis rejection`);

    server.close(()=>{
        process.exit(1);
    });
}); 