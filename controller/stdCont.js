const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Importing the Models
const Student = require('../models/student');
const stdFavList = require('../models/stdFavList');

//Importing helper functions
const helper = require('../utils/functions')
const teachFunctions = require('../utils/teachFunctions')

exports.signupController = async(req,res,next) => {
    
    const {firstName , lastName, userName , email, phoneNum} = req.body;
    if(userName && email && phoneNum && firstName)
    {
    
    let error;
    try {
        const emailExists = await Student.findOne({ email });
        const phoneNumExists = await Student.findOne({ phoneNum });
        const userNameExists = await Student.findOne({ userName });

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

           const user = new Student({
               _id : new mongoose.Types.ObjectId(),
               firstName : firstName,
               lastName :  lastName,
               phoneNum : phoneNum,
               userName : userName,
               email : email,
               pass : hash,
            });
            
            
            user.save().then(result => {
 
                //console.log(result); 
                res.status(201).json({
                     status: true,
                     message : "Student Account Created 🎉🎉",
     })
 
 }).catch(err => {
         res.status(500).json({
             status : false,
             message : "Some Error Caused while Creating Student Account",
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
    Student.find({userName: req.body.userName})
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
    Student.findOne({_id: _id}).select('-pass')
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

exports.addToFavList = async(req,res,next) =>{
    const teachIds = req.body.teachIds;
    const uid = req.params.uid;

    if(typeof teachIds !== undefined && teachIds.length > 0)
    {
        try{
            const data = await stdFavList.findOne({stdId: uid});
            //console.log(data)

            if(data)
            {
               let favTeacherList = data.favTeacherList;
               favTeacherList = await helper.appendToList(uid,teachIds,favTeacherList)
               
               await stdFavList.findOneAndUpdate({stdId:uid},{
                $set : {
                    favTeacherList : favTeacherList
                }
               })

               stdFavList.findOne({stdId : uid}).exec().
               then( result=>{
                    res.status(200).json({
                        status: true,
                        message : "Fav List Updated!",
                        data : result
                    })}
            ).catch(err=>{
                res.status(500).json(
                    {
                        status : false,
                        message : "Some Error Caused During Fetching New Data",
                        error : err
                    }
                )})
   
            }
            else
            {
                for(let i=0;i<teachIds.length;i++)
                {
                    try{
                        await teachFunctions.teachFavListUpate(teachIds[i],uid)
                    }
                    catch(err)
                    {
                       console.log(err)
                    }
                }
                const insertNewFavList = new stdFavList({
                    _id : new mongoose.Types.ObjectId(),
                    stdId : uid,
                    favTeacherList : teachIds
                })

                insertNewFavList.save().then(
                    result => {
                        res.status(200).json({
                            status: true,
                            message : "Fav List Created!",
                            data : result
                        })
                    }
                ).catch(err => {
                    res.status(500).json({
                        status: true,
                        message : "Some Error Caused While Adding new Fav List!",
                        data : err
                    })
                })
            }
        }
        catch(err)
        {
            return res.status(500).json({
                    status : "false",
                    message : "Some Error Caused!",
                    err : err
                })
        }
        
    }
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data"
        })
    }
}

exports.remFrFavList = async(req,res,next) => {
    const teachIds = req.body.teachIds;
    const uid = req.params.uid;

    if(typeof teachIds !== undefined && teachIds.length > 0)
    {
        try{
            const data = await stdFavList.findOne({stdId: uid});
            if(data)
            {
                let favTeacherList = data.favTeacherList;
                favTeacherList = await helper.remFrList(uid,teachIds,favTeacherList)

                await stdFavList.findOneAndUpdate({stdId:uid},{
                    $set : {
                        favTeacherList :  favTeacherList
                    }
                })

                stdFavList.findOne({stdId : uid}).exec().
               then( result=>{
                    res.status(200).json({
                        status: true,
                        message : "Fav List Updated!",
                        data : result
                    })}
            ).catch(err=>{
                res.status(500).json(
                    {
                        status : false,
                        message : "Some Error Caused During Fetching New Data",
                        error : err
                    }
                )})

            }
            else
            {
                res.status(400).json({
                    status : false,
                    message : "Selected User don't have any Fav List."
                })
            }
        }
        catch(err)
        {
            return res.status(500).json({
                status : "false",
                message : "Some Error Caused!",
                err : err
            })
        }
    }
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data"
        })
    }
    
}

exports.getFavList = async(req,res,next) => {
    const uid = req.params.uid;

    if(uid)
    {
      try{
        const data = await stdFavList.findOne({stdId:uid});
        if(data)
        {
            res.status(200).json({
                status : true,
                message : "Got the Fav List!",
                favList : data.favTeacherList
            })
        }
        else
        {
            res.status(400).json({
                status : false,
                message : "Given User Detail Don't have any fav list"
            })
        }
      }
      catch(err)
      {
        res.status(500).json({
            status : false,
            message  :  "Some Error Caused while Searching",
            err : err
        })
      }
    }
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data"
        })
    }
}