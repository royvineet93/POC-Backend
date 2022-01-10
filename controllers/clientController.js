const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Client = require('../models/clientModel');

//Add a client
exports.createclient = catchAsync(async(req, res, next) => {
    try {
        req.body.createdBy = req.user._id;
        let count = 0;
        if (req.user.role === 'guest') {
            count = await Client.find({ 'createdBy': req.user._id }).count;
        }
        if ((req.user.role === 'guest' && count <= 5) || req.user.role !== 'guest') {
            const newclient = await Client.create(req.body);
            res.status(201).json({
                status: 'Success',
                data: {
                    item: newclient
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

//Get a client
exports.getclient = catchAsync(async(req, res, next) => {
    const client = await Client.find({ 'createdBy': req.user._id });
    // Sending response
    res.status(200).json({
        status: 'Success',
        data: {
            client
        },
    });
});


//Delete a client
exports.deleteclient = catchAsync(async(req, res, next) => {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
        return next(
            new AppError('client not found', 404)
        );
    } else {
        // Sending response
        res.status(204).json({
            status: 'Success',
            data: {
                client
            },
        });
    }
});

//Modify a client
exports.updateclient = catchAsync(async(req, res, next) => {
    const reqBody = req.body;
    const id = req.body._id;
    delete reqBody._id;
    const client = await Client.findOneAndUpdate(id, reqBody);
    if (!client) {
        return next(
            new AppError('client not found', 404)
        );
    } else {
        // Sending response
        res.status(200).json({
            status: 'Success',
            data: {
                client
            },
        });
    }
});

//Search a client from company
exports.searchclient = catchAsync(async(req, res, next) => {
    const client = await Client.find({ "companyName": { '$regex': req.params.id, '$options': 'i' } });
    if (!client) {
        return next(
            new AppError('client not found', 404)
        );
    } else {
        // Sending response
        res.status(200).json({
            status: 'Success',
            data: {
                client
            },
        });
    }
});