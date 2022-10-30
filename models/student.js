const mongoose = require('mongoose');

const stdSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    firstName : {
        //Shashwat 
        type :  String, 
        required: true,
        match : /(^[A-Z][a-z][A-Za-z]*$)/
    },
    lastName : { 
        //Singh
        type : String
    },
    phoneNum : { 
        //Must Be Perfectly Tendigit only
        type : Number , 
        required : true,
        unique: true,
        match : /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g
    },
    email : { 
        type : String, 
        required : true,
        unique : true,
        match : /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },
    userName : {
        type : String,
        required : true,
        unique : true,
       // match : /(?:[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$)/
    },
    pass : { 
        type :  String, 
        required : true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Student',stdSchema);