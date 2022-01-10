const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
{
    userId:{
        type:String
    },
    companyLogo:{
        type:String
    },
    companyName:{
        type:String
    },
    country:{
        type:String
    },
    city:{
        type:String
    },
    pincode:{
        type:Number
    },
    website:{
        type:String
    },
    defaultCurrency:{
        type:String
    },
    state:{
        type:String
    },
    address:{
        type:String
    },
    phone:{
        type:Number
    },
    taxationType:{
        type:String
    },
    gstIN:{
        type:String
    },
    serviceTaxNo:{
        type:String
    },
    bankDetail:{
        bankName: {
            type:String },
        branchName: {
            type:String },
        AccountNumber: {
            type:Number},
        ifscCode: {
            type:String },
        swiftCode: {
            type:String },
        adCode: {
            type:String },
        userId :{
            type:String
         }
     }
   },
    {
        timestamps: true,
    }
);

const profile = mongoose.model('Profile', profileSchema);

module.exports = profile;
