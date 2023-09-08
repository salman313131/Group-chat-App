const User = require('../modal/user')
const Group = require('../modal/group')
const Usergroup = require('../modal/usergroup')
const Chat = require('../modal/chat')
const { Op } = require('sequelize');

exports.createGroup = async(req,res,next)=>{
    const {name,members} = req.body
    try {
        const newGroup = await Group.create({name:name,createdby:req.user.name})
        let newMembers = [{userId:req.user.id,groupId:newGroup.id}]
        for(let i=0;i<members.length;i++){
            newMembers.push({userId:members[i],groupId:newGroup.id})
        }
        await Usergroup.bulkCreate(newMembers)
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,error:error})
    }
}

exports.getGroup = async (req,res,next)=>{
    try {
        const groups = await Group.findAll({
            include: {
            model: User,
            through: {
            where: { userId: req.user.id }, 
                },
            },
        })
        res.status(200).json({success:true,groups:groups})
    } catch (error) {
        res.status(500).json({success:false,error:error})
    }
}

exports.getChat = async (req,res,next)=>{
    const groupId = req.query.groupId;
    const lastchatId = req.query.lastchatId;
    let chats;
    try {
        if(lastchatId == -1){
            chats = await Chat.findAll({where:{groupId:groupId},
            limit:10,
            order:[['id','DESC']]
            })
        }else{

            chats = await Chat.findAll({where:{groupId:groupId,id: {
                [Op.gt]: lastchatId,
            }},
            limit:10,
            order:[['id','DESC']]
        })
    }
        res.status(200).json({chats:chats,currentUser:req.user.id})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,error:error})
    }
}