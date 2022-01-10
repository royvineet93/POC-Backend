const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Invoice = require('../models/invoiceModel');

//Add a invoice
exports.createInvoice = catchAsync(async(req, res, next) => {
    try {
        req.body.createdBy = req.user._id;
        let count = 0;
        if (req.user.role === 'guest') {
            count = await Invoice.find({ 'createdBy': req.user._id }).count;
        }
        if ((req.user.role === 'guest' && count <= 5) || req.user.role !== 'guest') {
            const newInvoice = await Invoice.create(req.body);
            res.status(201).json({
                status: 'Success',
                data: {
                    invoice: newInvoice
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

//Get a invoice
exports.getInvoice = catchAsync(async(req, res, next) => {
    const invoice = await Invoice.find({ 'createdBy': req.user._id });
    // Sending response
    res.status(200).json({
        status: 'Success',
        data: {
            invoice
        },
    });
});


//Delete a invoice
exports.deleteInvoice = catchAsync(async(req, res, next) => {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
        return next(
            new AppError('invoice not found', 404)
        );
    } else {
        // Sending response
        res.status(204).json({
            status: 'Success',
            data: {
                invoice
            },
        });
    }
});

//Modify a invoice
exports.updateInvoice = catchAsync(async(req, res, next) => {
    const reqBody = req.body;
    const id = req.body._id;
    delete reqBody._id;
    const invoice = await Invoice.findOneAndUpdate(id, reqBody);
    if (!invoice) {
        return next(
            new AppError('invoice not found', 404)
        );
    } else {
        // Sending response
        res.status(200).json({
            status: 'Success',
            data: {
                invoice
            },
        });
    }
});

//Search a invoice from company
exports.searchInvoice = catchAsync(async(req, res, next) => {
    const invoice = await Invoice.find({ "companyName": { '$regex': req.params.id, '$options': 'i' } });
    if (!invoice) {
        return next(
            new AppError('invoice not found', 404)
        );
    } else {
        // Sending response
        res.status(200).json({
            status: 'Success',
            data: {
                invoice
            },
        });
    }
});