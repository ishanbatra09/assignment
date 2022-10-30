const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Importing the Models
const Teacher = require('../models/teacher');

exports.signupController = async(req,res,next) => {
    
    const {firstName, lastName , phoneNum,subject ,email, userName} = req.body;
    if(userName && email && phoneNum && firstName)
    {
    
    let error;
    try {
        const emailExists = await Teacher.findOne({ email });
        const phoneNumExists = await Teacher.findOne({ phoneNum });
        const userNameExists = await Teacher.findOne({ userName });

        if(emailExists && phoneNumExists && userNameExists) {
            error = "Email Or Phone Number already exists";
            throw new Error("Email Or Phone Number already exists");
        }
        else if(emailExists) {
            error = "Email already exists";
            throw new Error("Email already exists");
        }
        else if(phoneNumExists)
        {
            error = "PhoneNum Already exists";
            throw new Error("PhoneNum Already exists");
        }
        else if(userNameExists)
        {
            error = "userName Already Taken By SomeOne";
            throw new Error("userName Already Taken By Someone");
        }
    } catch(err) {
        console.error(err);
        // const message = err;
                
        return res.status(409).json({

            //409--conflict or 422 -- Unproccessable
                status : "false",
                error : error
            })
    }

    bcrypt.hash(req.body.pass,5,(err,hash)=>{
        if(err)
        {
            return res.status(500).json({
                status : false,
                err : err
            });
        }
        else {
           const user = new Teacher({
               _id : new mongoose.Types.ObjectId(),
               firstName : firstName,
               lastName :  lastName,
               phoneNum : phoneNum,
               subject : subject,
               userName : userName,
               email : email,
               pass : hash,
            });
            
            
            user.save().then(result => {
 
                //console.log(result); 
                res.status(201).json({
                     status: true,
                     message : "Teacher Account Created 🎉🎉",
     })
 
 }).catch(err => {
         res.status(500).json({
             status : false,
             message : "Some Error Caused while Creating Teacher Account",
             error : err.errors
         })
     })
    }})
}
else
{
    res.status(400).json({
        status : false,
        message : "Not Given the Complete Data"
    })
}
}

exports.login = (req,res,next)=>{
    if(req.body.userName && req.body.password)
    {
    Teacher.find({userName: req.body.userName})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                status : false,
                message: 'Please Check userName or Password!'
            })
        }
        
        //if everything perfect
        bcrypt.compare(req.body.password,user[0].pass,(err,result)=>{
            if(err)
            {
                return res.status(401).json({
                    status : false,
                    message: 'Please Check userName or Password!'
                })
            }
            if(result)
            {
                const token = jwt.sign(
                    {
                        _id : user[0]._id,
                        userName : user[0].userName
                    },
                 //Now, we need to provide the key
                 process.env.JWT_KEY,
                 {
                     //Now provide other options like expire in
                     expiresIn : "1h"
                 }

                );

                return res.status(200).json({
                    status : true,
                    message : "Authenctication Successfull!",
                    token : token
                })
            }
            return res.status(500).json({
                status: false,
                message: 'Internal Error'
            })
        })

    })
    .catch(
        err=>{
            res.status(500).json({
                
            })
        }
    )
    }
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data"
        })
    }
}

exports.getUserDetails =  (req,res,next)=>
{
    const _id = req.params.uid;
    //console.log(_id);
    if(_id){
    Teacher.findOne({_id: _id}).select('-pass')
    .exec()
    .then(
       user => {
           // console.log(user);
            res.status(200).json({
                status : true,
                message : "Got the User!",
                data : user
            })
         }
    ).catch(err => {
        res.status(404).json({
                    status : false,
                    message : "Not Found",
                    error : err
    })
})
    }
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data"
        })
    }

}