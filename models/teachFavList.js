const mongoose = require('mongoose');

const teachFavListSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    teachId : {
        type :  mongoose.Schema.ObjectId, 
        ref : 'Teacher',
        required: true,
    },
    stdIdsList : { 
        type : Array, 
        of : String,
        required : true
    },
    likes : {
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model('TeacherFavList',teachFavListSchema);