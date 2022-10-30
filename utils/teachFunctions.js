//Importing Required Modules
const mongoose = require('mongoose');

//Importing Models
const teachFavList = require('../models/teachFavList');


exports.teachFavListUpate = async(teachID,stdId)=> {
    try{
        const data = await teachFavList.findOne({teachId: teachID});
        if(data)
        {
           let stdIdsList = data.stdIdsList;
           stdIdsList.push(stdId)

           let countNum = data.likes;
           countNum++;
           
          // console.log(teachID,stdIdsList,countNum)
           await teachFavList.findOneAndUpdate({teachId:teachID},{
            $set : {
               stdIdsList : stdIdsList,
               likes : countNum
            }
           })

        }
        else
        {
            let stdIdsList = new Array();
            stdIdsList.push(stdId);

            let countNum = 1;

            const insertNewFavList = new teachFavList({
                _id : new mongoose.Types.ObjectId(),
                teachId : teachID,
                stdIdsList : stdIdsList,
                likes : countNum
            })

            insertNewFavList.save().then(
                result => {
                   console.log(result);
                }
            ).catch(err => {
                console.log(err);
            })
        }
    }
    catch(err)
    {console.log(err)
    }
}

exports.remFrTeachList = async(teachID,stdId) => {
   try
   {
    const data = await teachFavList.findOne({teachId: teachID});
    if(data)
    {
        let stdIdsList = data.stdIdsList;
        
        for(let i=0;i<stdIdsList.length;i++)
        {
          if(stdIdsList[i]===stdId) stdIdsList.splice(i,1);
        }

        let countNum = data.likes;
        countNum--;

        await teachFavList.findOneAndUpdate({stdId:stdId},{
            $set : {
               stdIdsList : stdIdsList,
               likes : countNum
            }
           })
    }
    else
    {
        console.log(teachID," => this teacherId don't have any favList");
    }    
   }
   catch(err)
   {
        console.log(err)
   }
}