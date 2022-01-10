const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({

    name: String,
    label: String,
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    }
}, {
    timestamps: true,
});

const invoice = mongoose.model('tax', taxSchema);

module.exports = invoice;