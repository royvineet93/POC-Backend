const mongoose = require('mongoose');
const validator = require('validator');

const clientSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'A Client should have a company name'],
    },
    phone: {
        type: String,
        required: [true, 'A Client should have a contact No.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    contactDetails: [{
        contactName: {
            type: String,
            required: [true, 'A Client should have a contact name'],
        },
        contactPhone: {
            type: String,
            required: [true, 'A Client should have a contact No.'],
        },
        contactEmail: {
            type: String,
            required: [true, 'Please provide email'],
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        }
    }],
    gstin: {
        type: String,
    },
    panId: {
        type: String,
    },
    tin: {
        type: String,
    },
    vat: {
        type: Number,
    },
    website: {
        type: String,
    },
    currency: {
        type: String,
    },
    billingAddress: {
        address: {
            type: String
        },
        country: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        pincode: {
            type: Number
        }
    },
    shippingAddress: {
        address: {
            type: String
        },
        country: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        pincode: {
            type: Number
        }
    },
    otherInfo: {
        facebook: {
            type: String
        },
        lst: {
            type: Number
        },
        cst: {
            type: Number
        },
        serviceTax: {
            type: Number
        }
    },
    notes: {
        type: String
    },
    active: {
        type: Boolean
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

clientSchema.index({ email: 1, createdBy: 1 }, { unique: true });

const client = mongoose.model('Clients', clientSchema);

module.exports = client;