const Client = require('../models/clientModel');
const item = require('../models/itemModel');
const vendor = require('../models/vendorModel');
const invoice = require('../models/invoiceModel');
const Tax = require('../models/taxModel');
const Unit = require('../models/unitModel');
const catchAsync = require('../utils/catchAsync');
const ExcelJS = require('exceljs')
const sendEmail = require('../utils/email');
const client = require('../models/clientModel');
const Stream = require('stream');

exports.getCount = async(req, res, next) => {
    let model = null;
    if (req.params.model === 'client') {
        model = Client;
    }
    if (req.params.model === 'item') {
        model = item;
    }
    if (req.params.model === 'vendor') {
        model = vendor;
    }
    if (req.params.model === 'invoice') {
        model = invoice;
    }
    const count = await model.find({ 'createdBy': req.user._id }).countDocuments();
    res.json({ 'model': req.params.model, 'count': count });
};

exports.getTax = async(req, res, next) => {
    try {
        const tax = await Tax.find({ 'createdBy': req.user._id });
        res.status(200).json({
            status: 'Success',
            data: {
                tax
            },
        });
    } catch (err) {
        next(err)
    }

}

exports.getClientName = async(req, res, next) => {
    try {
        const client = await Client.find({ 'createdBy': req.user._id }, { companyName: 1, _id: 0 }).distinct('companyName');
        res.status(200).json({
            status: 'Success',
            data: {
                client
            },
        });
    } catch (err) {
        next(err)
    }

}

exports.createTax = catchAsync(async(req, res, next) => {
    try {
        req.body.createdBy = req.user._id;
        const newTax = await Tax.create(req.body);
        res.status(201).json({
            status: 'Success',
            data: {
                Tax: newTax
            }
        });

    } catch (err) {
        const msg = err.message;
        if (msg.includes('duplicate key error')) {
            return next(new AppError(err, 409));
        }
        return next(new AppError(err, 400));
    }
});

exports.getUnit = async(req, res, next) => {
    try {
        const unit = await Unit.find({ 'createdBy': req.user._id });
        res.status(200).json({
            status: 'Success',
            data: {
                unit
            },
        });
    } catch (err) {
        next(err)
    }
}
exports.createUnit = catchAsync(async(req, res, next) => {
    try {
        req.body.createdBy = req.user._id;
        const newUnit = await Unit.create(req.body);
        res.status(201).json({
            status: 'Success',
            data: {
                unit: newUnit
            }
        });

    } catch (err) {
        const msg = err.message;
        if (msg.includes('duplicate key error')) {
            return next(new AppError(err, 409));
        }
        return next(new AppError(err, 400));
    }
});

exports.exportExcelReportToDB = async(req, res, next) => {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.read(req.files.file.data);
        } catch (err) {
            console.log(err);
        }
    }
    // exports.exportExcelReport = async(req, res, next) => {
    //     try {
    //         let columnHeader = null;
    //         let model = null;
    //         if (req.params.model === 'client') {
    //             model = Client;
    //             columnHeader = [
    //                 { header: 'Company Name', key: 'companyName' },
    //                 { header: 'Phone', key: 'phone' },
    //                 { header: 'Email', key: 'email' },
    //                 { header: 'PanId', key: 'panId' },
    //                 { header: 'Website', key: 'website' },
    //                 { header: 'Billing Address', key: 'billingAddress' },
    //                 { header: 'Shipping Address', key: 'shippingAddress' },
    //                 { header: 'Contact Details', key: 'contactDetails' },
    //                 { header: 'Notes', key: 'notes' }
    //             ]
    //         }
    //         if (req.params.model === 'item') {
    //             model = item;
    //             columnHeader = [
    //                 { header: 'Item Name', key: 'name' },
    //                 { header: 'Item Code', key: 'itemCode' },
    //                 { header: 'Description', key: 'description' },
    //                 { header: 'Quantity', key: 'quantity' },
    //                 { header: 'Unit', key: 'unit' },
    //                 { header: 'Tax', key: 'tax' },
    //                 { header: 'HSN', key: 'HSN' },
    //                 { header: 'SAC', key: 'SAC' },
    //                 { header: 'Item Type', key: 'itemType' },
    //                 { header: 'Sales Info', key: 'salesInfo' },
    //                 { header: 'Purchase Info', key: 'purchaseInfo' },
    //                 { header: 'Active', key: 'active' }
    //             ];
    //         }
    //         if (req.params.model === 'vendor') {
    //             model = vendor;
    //             columnHeader = [
    //                 { header: 'Company Name', key: 'companyName' },
    //                 { header: 'Phone', key: 'phone' },
    //                 { header: 'Email', key: 'email' },
    //                 { header: 'PanId', key: 'panId' },
    //                 { header: 'Website', key: 'website' },
    //                 { header: 'Billing Address', key: 'billingAddress' },
    //                 { header: 'Shipping Address', key: 'shippingAddress' },
    //                 { header: 'Contact Details', key: 'contactDetails' },
    //                 { header: 'Notes', key: 'notes' }
    //             ];
    //         }
    //         if (req.params.model === 'invoice') {
    //             model = invoice;
    //             columnHeader = [
    //                 { header: 'Client Name', key: 'clientName' },
    //                 { header: 'Invoice No', key: 'invoiceNo' },
    //                 { header: 'Invoice Date', key: 'invoiceDate' },
    //                 { header: 'Due Date', key: 'dueDate' },
    //                 { header: 'PO No', key: 'PONo' },
    //                 { header: 'PO Date', key: 'PODate' },
    //                 { header: 'Payment Terms', key: 'paymentTerms' },
    //                 { header: 'Terms And Conditions', key: 'termsAndConditions' },
    //                 { header: 'Privacy Notes', key: 'privacyNotes' },
    //                 { header: 'Items', key: 'items' },
    //                 { header: 'Status', key: 'status' }
    //             ];
    //         }
    //         // const data = await model.find({ 'createdBy': req.user._id });
    //         const workbook = new ExcelJS.Workbook();
    //         workbook.creator = 'test user';
    //         workbook.created = new Date();
    //         const worksheet = workbook.addWorksheet('test worksheet', { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] });
    //         worksheet.columns = columnHeader;
    //         worksheet.getRow(1).font = { bold: true };
    //         // worksheet.addRows(data);
    //         const buffer = await workbook.csv.writeBuffer();
    //         const message = 'Please find the attached export report as requested.';
    //         await sendEmail({
    //             email: req.user.email,
    //             subject: 'Export report from Unicodez',
    //             message,
    //             attachments: [{
    //                 filename: 'exports.xlsx',
    //                 content: buffer
    //             }]
    //         });
    //         res.status(200).json({
    //             status: 'Success',
    //             message: 'Export file has been emailed successfully'
    //         });
    //     } catch (err) {
    //         next(err)
    //     }
    // }

const removeId = (array) => {
    array.splice(array.indexOf('_id'), 1);
    array.splice(array.indexOf('id'), 1);
    array.splice(array.indexOf('__v'), 1);
    array.splice(array.indexOf('createdBy'), 1);
    array.splice(array.indexOf('updatedBy'), 1);
    array.splice(array.indexOf('createdAt'), 1);
    array.splice(array.indexOf('updatedAt'), 1);
}
exports.exportExcelReport = async(req, res, next) => {
    try {
        let model = null;
        const columnHeader1 = [];
        if (req.params.model === 'client') {
            const clientArray = Object.keys(client.schema.tree);
            removeId(clientArray);
            clientArray.forEach(object => {
                columnHeader1.push({ header: object, key: object });
            });
        }
        if (req.params.model === 'item') {
            const itemArray = Object.keys(item.schema.tree);
            removeId(itemArray);
            itemArray.forEach(object => {
                columnHeader1.push({ header: object, key: object });
            });
        }
        if (req.params.model === 'vendor') {
            const vendorArray = Object.keys(vendor.schema.tree);
            removeId(vendorArray);
            vendorArray.forEach(object => {
                columnHeader1.push({ header: object, key: object });
            });
        }
        if (req.params.model === 'invoice') {
            model = invoice;
            const invoiceArray = Object.keys(invoice.schema.tree);
            removeId(invoiceArray);
            invoiceArray.forEach(object => {
                columnHeader1.push({ header: object, key: object });
            });
        }
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'test user';
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet('test worksheet', { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] });
        worksheet.columns = columnHeader1;
        worksheet.getRow(1).font = { bold: true };
        const buffer = await workbook.csv.writeBuffer();;
        res.set('Content-Type', 'csv');
        res.write(buffer, 'binary');
        res.end(null, 'binary');
    } catch (err) {
        next(err)
    }
}