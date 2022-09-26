const Product = require('../models/ProductModels')


//create product
exports.createProduct = async (req,res,next) =>{
    const product = await Product.create(req.body);



    res.status(201).json(
        {
            success:true,
            product
        }
    )
}



exports.getAllProduct = (req,res) =>{
    res.status(200).json({
        message:'route is working properly' 
    })  
}