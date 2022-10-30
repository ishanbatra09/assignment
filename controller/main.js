//Importing the Models
const teachFavList = require('../models/teachFavList');

exports.home = (req,res,next)=>{
    res.status(200).json({
        message : "Server Started Working!"
    })}

exports.mostLikeTeach = async(req,res,next) => {
    try{

        const data = await teachFavList.aggregate([
            {$sort : {likes:-1}},
            {$limit : 1}
        ])
         res.status(200).json({
            status : true,
            message : "Found the Most Liked Teacher",
            result : data
         })
    }
    catch(err)
    {
        console.log(err)
         res.status(500).json({
            status : false,
            message: "Some Error Caused",
            err : err
         })
    }
}    