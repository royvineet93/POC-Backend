const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({

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

const invoice = mongoose.model('unit', unitSchema);

module.exports = invoice;