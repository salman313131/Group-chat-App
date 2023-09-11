const User = require('../modal/user')
const Group = require('../modal/group')
const Usergroup = require('../modal/usergroup')
const Chat = require('../modal/chat')
const { Op } = require('sequelize');

exports.createGroup = async(req,res,next)=>{
    const {name} = req.body
    try {
        const newGroup = await Group.create({name:name,createdby:req.user.name})
        let newMember = {userId:req.user.id,groupId:newGroup.id,admin:true}
        await Usergroup.create(newMember)
        res.status(200).json(newGroup)
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,error:error})
    }
}

exports.getGroup = async (req,res,next)=>{
    try {
         const user = await User.findByPk(req.user.id);
            if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const groups = await user.getGroups();
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
        const isAdmin = await Usergroup.findOne({where:{userId:req.user.id,groupId:groupId}})
        res.status(200).json({chats:chats,currentUser:req.user.id,admin:isAdmin.admin})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,error:error})
    }
}

exports.addUser = async(req,res,next)=>{
    const {attrName,attrValue,groupId} = req.body;
    try {
        const user = await User.findOne({where:{[attrName]:attrValue}})
        if(!user){
            return res.status(401).json({success:false,message:'User not found'})
        }
        await Usergroup.create({admin:false,userId:user.id,groupId:groupId})
        res.status(200).json({id:Usergroup.id,name:user.name})
    } catch (error) {
        res.status(500).json({success:false,error:error})
    }
}

exports.getAllUser = async (req,res,next)=>{
    try {
        const groupId = req.params.groupId;
        const groupData = await Usergroup.findAll({where:{groupId:groupId},attributes:['id','userId','admin']})
        const newgroupData= groupData.filter(item=>item.userId!=req.user.id)
        const idArray = newgroupData.map(item => item.userId);
        const userData = await User.findAll({where:{
            id: {
            [Op.or]: idArray,
        },
        },attributes:['id','name']})
        const sendArray = newgroupData.map(item => {
            const matchedItem = userData.find(user => user.id === item.userId);
                        return {
                    id: item.id,
                    name: matchedItem ? matchedItem.name : null,
                    admin: item.admin,
        };
            });
        res.status(200).json(sendArray)
    } catch (error) {
        res.status(500).json({success:false,error:error})
    }

}

exports.deleteGroupMember = async (req,res,next)=>{
    const id = req.params.id
    try {
        await Usergroup.destroy({where:{id:id}})
        res.status(204).json({success:true})
    } catch (error) {
        res.status(500).json({success:false,error:error})
    }
}

exports.updateAdmin = async (req,res,next)=>{
    const {id} = req.body
    try {
        await Usergroup.update({admin:true},{where:{id:id}})
        res.status(200).json({suceess:true})
    } catch (error) {
        res.status(500).json({success:false,error:error})
    }
}