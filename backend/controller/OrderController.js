const Order = require('../models/OrderModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require("../models/ProductModels");
//create order
exports.createOrder = catchAsyncErrors(async (req,res,next) =>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success :true,
        order
    });
});

//get Single order details 
exports.getSingleOrder = catchAsyncErrors(async (req,res,next) =>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("Order item not found with this id",404));
    };

    res.status(200).json({
        success:true,
        order
    });
});

//get all order
exports.getAllOrders = catchAsyncErrors(async(req,res,next) =>{
    const orders = await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders
    });
});

//get all orders --admin
exports.getAdminAllOrders = catchAsyncErrors(async(req,res,next) =>{
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    });
});

//update order details --admin
exports.updateAdminOrder = catchAsyncErrors(async (req,res,next) =>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("YOu have already delivered this order"));
    }

    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async(i)=>{
            await updateStock(i.product, i.quantity);
        });
    }

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveryAt = Date.now();
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,

    });
});

//update stock function in the update order details
async function updateStock(id,quantity){

    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({validateBeforeSave:false});
}

//delete order --admin
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order is found with this id"));
    }

    await order.remove();

    res.status(200).json({
        success:true
    })
})


