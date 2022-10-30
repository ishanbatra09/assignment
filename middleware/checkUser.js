const Student = require('../models/student')
const Teacher = require('../models/teacher')

const checkUser = {
    student : async(req,res,next)=>{
        try{
            const user = await Student.findOne({ _id : req.params.uid })
            if(user)
            {
                next()
            }
            else
            {
                res.status(400).json({
                    status: false,
                    message: "Given Data Student Not Present!"
                })
            }
        }
        catch(err)
        {
            res.status(400).json({
                status: false,
                message: "Some Error Caused!",
                error: err
            })
        }
    },

    teacher : async(req,res,next)=>{
        try{
            const user = await Teacher.findOne({ _id : req.params.uid })
            if(user)
            {
                next()
            }
            else
            {
                res.status(400).json({
                    status: false,
                    message: "Given Teacher Data Not Present!"
                })
            }
        }
        catch(err)
        {
            res.status(400).json({
                status: false,
                message: "Some Error Caused!",
                error: err
            })
        }
    }
}

module.exports = checkUser;