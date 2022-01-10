const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'An item must have a name'],
    },
    itemCode: {
        type: String,
    },
    description: {
        type: String,
    },
    quantity: {
        type: Number
    },
    unit: {
        type: String,
        required: [true, 'An item must have a unit'],
    },
    tax: {
        type: Number,
    },
    HSN: {
        type: String
    },
    SAC: {
        type: String
    },
    itemType: {
        type: String
    },
    salesInfo: {
        unitPrice: {
            type: Number
        },
        currency: {
            type: Number
        },
        cessPercent: {
            type: Number
        },
        cess: {
            type: Number
        }
    },
    purchaseInfo: {
        unitPrice: {
            type: Number
        },
        currency: {
            type: Number
        },
        cessPercent: {
            type: Number
        },
        cess: {
            type: Number
        }
    },
    active: {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    createdBy: {
        type: String
    },
    updatedAt: {
        type: Date
    },
    updatedBy: {
        type: String
    }
}, {
    timestamps: true,
});

itemSchema.index({ name: 1, createdBy: 1, itemType: 1 }, { unique: true });
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;