import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../config/generateToken.js'
import bcrypt from 'bcryptjs'
const registerUser =asyncHandler( async(req,res)=>{
    const {name,email,password,pic} = req.body;

    if(!name || !email || !password){
      res.status(400);
      throw new Error("Please enter all the fields")
    }

    const userExists = await User.findOne({email});
    
    if(userExists){
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,email,password,pic
    })

    if(user){
      res.status(200).json(
        {_id: user._id, 
          name:user.name, 
          email:user.email,
          password:user.password, 
          pic:user.pic,
          token: generateToken(user._id)
        })
    }else{
      res.status(400);
      throw new Error("Failed to create the User");
    }

})

const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    
    const user = await User.findOne({email});

      if(user){
        console.log(password)
        console.log(user.password)
        const valid = await bcrypt.compare(password,user.password);
        console.log(valid);
        if(valid){
          res.status(200).json({_id: user._id, 
            name:user.name, 
            email:user.email,
            password:user.password, 
            pic:user.pic,
            token: generateToken(user._id)
          });
        }else{
          throw new Error("Invalid password");
        }
      }else{
        throw new Error('invalid credentials')
      }
})


const getAllUsers = asyncHandler(async(req,res)=>{
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
})

export {
  registerUser,
  authUser,
  getAllUsers
}