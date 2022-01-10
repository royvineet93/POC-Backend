const client = require('../models/clientModel');
const item = require('../models/itemModel');
const vendor = require('../models/vendorModel');

exports.count = async(req, res, next) => {
    model = null;
    if (req.params.model === 'client') {
        model = client;
    }
    if (req.params.model === 'item') {
        model = item;
    }
    if (req.params.model === 'vendor') {
        model = vendor;
    }
    const count = await model.find({ 'createdBy': req.user._id }).countDocuments();
    res.json({ 'model': req.params.model, 'count': count });

}