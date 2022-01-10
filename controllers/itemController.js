const Item = require('../models/itemModel');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get All Items
exports.getAllItems = catchAsync(async(req, res, next) => {

    const features = new APIFeatures(Item.find(), { 'createdBy': req.user._id })
        .sort()
        // .limitFields()
        // .paginate();

    const items = await features.query;

    //     const items = await Item.find();
    res.status(200).json({
        status: 'success',
        results: items.length,
        data: {
            items,
        },
    });
});

// Create New Items

exports.createItem = catchAsync(async(req, res, next) => {
    try {
        req.body.createdBy = req.user._id;
        let count = 0;
        if (req.user.role === 'guest') {
            count = await Invoice.find({ 'createdBy': req.user._id }).count;
        }
        if ((req.user.role === 'guest' && count <= 5) || req.user.role !== 'guest') {
            const newItem = await Item.create(req.body);
            res.status(201).json({
                status: 'Success',
                data: {
                    item: newItem,
                },
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

// Get Single Item

exports.getItem = catchAsync(async(req, res, next) => {
    const item = await Item.find({ 'createdBy': req.user._id });
    if (!item) {
        return next(new AppError('No Item found with that id', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            item: item,
        },
    });
});

// Update One Item using ID

exports.updateItem = catchAsync(async(req, res, next) => {
    const reqBody = req.body;
    const id = req.body._id;
    delete reqBody._id;
    const item = await Item.findByIdAndUpdate(id, reqBody);
    if (!item) {
        return next(new AppError('Item not found', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            item,
        },
    });
});

// Delete One Item Using ID

exports.deleteItem = catchAsync(async(req, res, next) => {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
        return next(new AppError('Item not found', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            item,
        },
    });
});