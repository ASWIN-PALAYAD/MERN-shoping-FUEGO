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

    const resultPerPage = 8;
    const productCount  = Product.countDocuments();

    const feature = new Features(Product.find(),req.query)
                    .search()
                    .filter()
                    .pagination(resultPerPage);

    const product = await feature.query; 
    res.status(200).json({
        success:true,
        product, 
        
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
        product,
        // productCount
        
    })
}); 


//create Review and update review
exports.createProductReview = catchAsyncErrors(async(req,res,next) =>{
    const {rating,comment,productId} = req.body;

    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if(isReviewed){
        product.reviews.forEach((rev) =>{
            if(rev.user.toString() === req.user._id.toString())
            (rev.rating = rating),(rev.comment = comment);
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev)=>{
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success : true,
    });

});

//get All reviews of a single product
exports.getSinleProductReviews= catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product is not found with this id",401));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    });
});

//Delete review --admin
exports.deleteReview = catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found with this id",400));
    };

    const reviews = product.reviews.filter(
        (rev)=> rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) =>{
        avg += rev.rating;
    });

    let ratings = 0;

    if(reviews.length == 0){
        ratings = 0;
    }else{
        ratings = avg/reviews.length
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews
        },
        {
            new:true,
            runValidators:true,
            useFindAndModify:false
        }

    );
    res.status(200).json({
        success:true
    });
});
