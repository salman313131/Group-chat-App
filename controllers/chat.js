const Chat = require('../modal/chat')
const { Op } = require('sequelize');
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
        await Chat.create({chat:chat,name:req.user.name,userId:req.user.id})
        res.status(201).json({success:true,name:req.user.name})
    } catch (error) {
        res.status(500).json({success:false,message:'Server Error',error:error})
    }
}

exports.getAll = async (req,res,next)=>{
    const localId = req.params.localId
    console.log(localId)
    let chats;
    try {
        if(localId == -1){
            chats = await Chat.findAll({
                limit:10,
                order:[['createdAt', 'ASC']]
            })
        }
        else{
            chats = await Chat.findAll({
                where: {
                    id: {
                        [Op.gt]: localId,
                        },
                },
            })
        }
        res.status(200).json({chats:chats,currentUser:req.user.id})
    } catch (error) {
        res.status(500).json({success:false,error:error})
    }
}