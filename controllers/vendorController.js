const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Vendor = require('../models/vendorModel');

//Add a customer
exports.createVendor = catchAsync(async(req, res, next) => {
    try {
        req.body.createdBy = req.user._id;
        let count = 0;
        if (req.user.role === 'guest') {
            count = await Invoice.find({ 'createdBy': req.user._id }).count;
        }
        if ((req.user.role === 'guest' && count <= 5) || req.user.role !== 'guest') {
            const newVendor = await Vendor.create(req.body);
            if (!newVendor) {
                return next(
                    new AppError('Vendor not created', 401)
                );
            }
            res.status(201).json({
                status: 'Success',
                data: {
                    item: newVendor
                }
            });
        } else {
            return next(new AppError('Maximum limit of 5 entries reached for guest account', 409));
        }

    } catch (err) {
        const msg = err.message;
        if (msg.includes('duplicate key error')) {
            return next(new AppError(err, 409));
        }
        return next(new AppError(err, 400));
    }
});

//Get a customer
exports.getVendor = catchAsync(async(req, res, next) => {
    const vendor = await Vendor.find({ 'createdBy': req.user._id });
    // Sending response
    res.status(200).json({
        status: 'Success',
        data: {
            vendor
        },
    });
});


//Delete a customer
exports.deleteVendor = catchAsync(async(req, res, next) => {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
        return next(
            new AppError('Vendor not found', 401)
        );
    } else {
        // Sending response
        res.status(200).json({
            status: 'Success',
            data: {
                vendor
            },
        });
    }
});

//Modify a customer
exports.updateVendor = catchAsync(async(req, res, next) => {
    const reqBody = req.body;
    const id = req.body._id;
    delete reqBody._id;
    const vendor = await Vendor.findByIdAndUpdate(id, reqBody);
    if (!vendor) {
        return next(
            new AppError('Vendor not found', 401)
        );
    } else {
        // Sending response
        res.status(200).json({
            status: 'Success',
            data: {
                vendor
            },
        });
    }
});

//Search a client from company
exports.searchclient = catchAsync(async(req, res, next) => {
    const vendor = await Vendor.find({ "companyName": { '$regex': req.params.id, '$options': 'i' } });
    if (!vendor) {
        return next(
            new AppError('vendor not found', 404)
        );
    } else {
        // Sending response
        res.status(200).json({
            status: 'Success',
            data: {
                vendor
            },
        });
    }
});