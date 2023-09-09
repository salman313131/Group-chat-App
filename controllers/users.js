const User = require('../modal/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
        const salt=10
        const hashedPassword = await bcrypt.hash(password,salt)
        await User.create({name:name,email:email,number:number,password:hashedPassword})
        res.status(201).json({success:true})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,error:error})
    }
}

exports.getUser = async(req,res,next)=>{
    const {email,password} = req.body
    try {
        const user = await User.findOne({where:{email:email}})
        if(!user){
            return res.status(404).json({success:false,message:'No person with this email id'})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({success:false,message:'Wrong Password'})
        }
        const tokenData = {userId:user.id}
        const accessToken = jwt.sign(tokenData,process.env.JWT_TOKEN)
        res.status(200).json({success:true,message:'Successful',token:accessToken,name:user.name})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:'Server side error'})
    }
}