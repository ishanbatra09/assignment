const mongoose = require('mongoose');

const stdFavListSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    stdId : {
        type :  mongoose.Schema.ObjectId, 
        ref : 'Student',
        required: true,
    },
    favTeacherList : { 
        type : Array, 
        of : String,
        required : true
    }
});

module.exports = mongoose.model('StudentFavList',stdFavListSchema);