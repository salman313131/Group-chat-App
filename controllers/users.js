const User = require('../modal/user')
const bcrypt = require('bcrypt')
exports.addNewUser = async(req,res,next)=>{
    const {name,email,number,password} = req.body
    if(!name || !email || ! number || !password){
        return res.status(400).json({success:false,message:'Data are missing'})
    }
    try {
        const user = await User.findOne({where:{email:email}})
        if(user){
            return res.status(409).json({message:'User Already exist'})
        }
        await User.create({name:name,email:email,number:number,password:password})
        res.status(201).json({success:true})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,error:error})
    }
}