const teachFunctions = require('./teachFunctions')

exports.appendToList = async(stdId,source, dest) => {
  for(let i=0;i<source.length;i++)
  {
    if(!dest.includes(source[i])) 
    {
        dest.push(source[i]);

        try{
            await teachFunctions.teachFavListUpate(source[i],stdId);
        }
        catch(err)
        {
            console.log(err);
        }

    }
  }

  return dest;
}

exports.remFrList = async(stdId,source,dest) => {
  for(let i=0;i<source.length;i++)
  {
    if(dest.includes(source[i]))
    {
      //Removing the Selected Id from the Std Fav List
      for(let j=0;j<dest.length;j++)
      {
        if(dest[j]===source[i]) dest.splice(j,1);
      }

      //Removing this Particular stdId from the selcet teacher array and decreasing the count
      try{
           await teachFunctions.remFrTeachList(source[i],stdId);
      }
      catch(err)
      {
        console.log(err);
      }
    }
  }

  return dest;
}