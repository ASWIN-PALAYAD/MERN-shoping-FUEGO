const Product = require('../models/ProductModels');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Features = require('../utils/Features');


//create product
exports.createProduct = catchAsyncErrors(async (req,res,next) =>{
    const product = await Product.create(req.body);



    res.status(201).json(
        {
            success:true,
            product
        }
    )
});


//get all project
exports.getAllProduct = catchAsyncErrors(async (req,res) =>{
    const feature = new Features(Product.find(),req.query).search();

    const product = await feature.query; 
    res.status(200).json({
        success:true,
        product
    })
    
});


//Update Product --admin
exports.updateProduct =  catchAsyncErrors(async (req,res,next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product is not found with this id",404));

    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useUnified:false
    });
    res.status(200).json({
        success:true,
        product
    })
});

//delete product
exports.deleteProduct = catchAsyncErrors(async (req,res,next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product is not found with this id",404));

    }

    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"  
    })
});

//get Single product details 
exports.getSingleProduct = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product is not found with this id",404));
    }

    res.status(200).json({ 
        success:true, 
        product
    })
}); 
