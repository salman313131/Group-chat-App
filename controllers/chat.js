const Chat = require('../modal/chat')
const AWS = require('aws-sdk')
const { Op } = require('sequelize');
const User = require('../modal/user')

function uploadToS3(data,filename){
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_USER_KEY,
        secretAccessKey : process.env.AWS_USER_SECRET
    })
    var params={
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve,reject)=>{

        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(s3response.Location)
            }
        })
    })
}

exports.getChat = async (req,res,next)=>{
    try {
        res.status(200).json({success:true,name:req.user.name})
    } catch (error) {
        res.status(500).json({success:false,message:'Server Error',error:error})
    }
}

exports.postChat = async (req,res,next)=>{
    const {chat,groupId} = req.body
    try {
        await Chat.create({chat:chat,name:req.user.name,userId:req.user.id,groupId:groupId})
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

exports.postFiledata = async (req,res,next)=>{
    try {
        const file = req.file;
        const groupId = req.body.group
        if (!file) {
                return res.status(400).send("No file uploaded.");
        }
        const filename = `${new Date()}/${file.originalname}`
        const fileUrl = await uploadToS3(file.buffer,filename)
        await Chat.create({chat:fileUrl,name:req.user.name,filetype:file.mimetype,userId:req.user.id,groupId:groupId})
        res.status(200).json({name:req.user.name,url:fileUrl,type:file.mimetype})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,error:error})
    }
}