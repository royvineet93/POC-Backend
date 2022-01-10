const mongoose = require('mongoose');
const validator = require('validator');

const invoiceSchema = new mongoose.Schema({
    clientName: {
        type: String
    },
    invoiceNo: {
        type: String
    },
    invoiceDate: {
        type: Date
    },
    dueDate: {
        type: Date
    },
    PONo: {
        type: String
    },
    PODate: {
        type: String
    },
    paymentTerms: {
        type: String
    },
    itemName: {
        type: String
    },
    itemDescription: {
        type: String
    },
    termsAndConditions: {
        type: String
    },
    privacyNotes: {
        type: String
    },
    items: {
        type: Object
    },
    status: {
        type: String
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    }
}, {
    timestamps: true,
});

const invoice = mongoose.model('invoices', invoiceSchema);

module.exports = invoice;