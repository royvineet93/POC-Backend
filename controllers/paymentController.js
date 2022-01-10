const Razorpay = require('razorpay');
const AppError = require('../utils/appError');

exports.create = function (req, res, next) {
    var instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET
    })
    var options={
            amount: req.body.amount *100,
            currency: req.body.currency,
            receipt: "Order1041",
            payment_capture: 0,
    };
    instance.orders.create(options, (err, order)=>{
        if(err){
             return next(new AppError(err.error.description, 400));
        }
        if(order){
            res.json({success:true, status:"Order created successfully", value:order, key:process.env.RAZOR_PAY_KEY_ID})
        }
    });
};


