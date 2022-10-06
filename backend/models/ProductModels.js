const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Pleases enter the product name'],
        trim:true,
        maxlength:[20,'Product not exceed than 20 charactor']
    },
    description:{
        type:String,
        required:[true,'please add a description of your product'],
        maxlength:[4000,'Description is can not exceed than 4000 charactor']
    },
    price:{
        type:Number,
        required:[true,'please add a price for your product'],
        maxlength:[8,'Price can not exceed than 8 charactors']
    },
    discountPrice:{
        type:String,
        maxlength:[4,'Discount price can not exceed 4 charactor']
    },
    color:{
        type:String,
    },
    size:{
        type:String,
    },
    ratings:{
        type:Number,
        default:0,
    },
    images:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            },
        }
    ],
    category:{
        type:String,
        required:[true,'Please enter a category of your product'],
    },
    stock:{
        type:Number,
        required:[true,'Please enter the stock of your product'],
        maxlength:[4,'Stock can not exceed than 4 charactor'],
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true,
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String
            },
            time:{
                type:Date,
                default:Date.now()
            },
        },
    ],
    user:{
     type:mongoose.Schema.ObjectId,
     ref:'User',
     required:true,
    },
    createAt:{
        type:Date, 
        default:Date.now() 
    }
})

module.exports = mongoose.model("Product",productSchema); 