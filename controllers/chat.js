const Chat = require('../modal/chat')
const User = require('../modal/user')

exports.getChat = async (req,res,next)=>{
    try {
        res.status(200).json({success:true,name:req.user.name})
    } catch (error) {
        res.status(500).json({success:false,message:'Server Error',error:error})
    }
}

exports.postChat = async (req,res,next)=>{
    const {chat} = req.body
    try {
        await Chat.create({chat:chat,userId:req.user.id})
        res.status(201).json({success:true,name:req.user.name})
    } catch (error) {
        res.status(500).json({success:false,message:'Server Error',error:error})
    }
}

exports.getAll = async (req,res,next)=>{
    try {
        const [users,chats] = await Promise.all([User.findAll(),Chat.findAll()])
        res.status(200).json({users:users,chats:chats})
    } catch (error) {
        response.status(500).json({success:false,error:error})
    }
}