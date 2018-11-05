var express = require('express');
var router  = express.Router();
var jwt     = require('jsonwebtoken');

var user          = require('../models/user')
var chat          = require('../models/chat')
var channel       = require('../models/channel')
var channel_user  = require('../models/channel_user')
var key           = require('../config/key.json')
var sequelize     = require('../config/connection')

router.get('/',(req, res) => {
  res.send('api listen')
})
//GET USER
router.get('/user',(req, res)=>{
  user.findAll().then(result =>{
    // const today = new Date()
    // const dd    = today.getDate()
    // const mm    = today.getMonth()
    // const yy    = today.getFullYear()
    // console.log('get user', dd, mm, yy)
    res.json(result)
  })
})
//GET CHAT
router.get('/chat',(req, res)=>{
  chat.findAll().then(result =>{
    res.json(result)
  })
})
//GET CHANNEL BY CH_ID
// router.get('/chat/ch=:channel', (req, res) => {
//   chat.findAll({where:{channel_id: req.params.channel}}).then(result => {
//     res.json(result)
//   })
// })
router.get('/chat/ch=:channel', (req, res) => {
  sequelize.sequelize.query("select chat.id,user.name,chat.channel_id, chat.user_id, chat.message,chat.image_url,chat.createdAt, chat.updatedAt from chat inner join user on chat.user_id = user.id where channel_id ="+req.params.channel+""
  ,).spread(result => {
    res.json(result)
    })
})
//GET CHANNEL
router.get('/channel',(req, res)=>{
  channel.findAll().then(result =>{
    res.json(result)
  })
})
//GET DATACHAT
router.get('/dataChat/:id',(req, res, next)=>{
  sequelize.sequelize.query("select channel.id, channel_user.user_id, channel.name, channel.type, chat.message, chat.image_url from channel inner join channel_user on channel.id = channel_user.channel_id inner join chat on channel.id = chat.channel_id where channel.id ="+req.params.id+""
  ,).spread(result =>{
    // res.json(result)
    if (result == '') {
      next
        user.findAll()
       .then(hasil=>{
         res.json(hasil)
      })
    }else{
      res.json(result)
    }
  })
})
//get chatlist
router.get('/chatlist/ch=:channel', (req, res) => {
  sequelize.sequelize.query("select channel.id,channel.type, channel.name from channel inner join user on channel.id = user.id where channel.id ="+req.params.channel+""
  ,).spread(result => {
      res.json(result)
    })
})
router.get('/chatlist', (req, res) => {
  sequelize.sequelize.query("select channel.id,channel.type, channel.name from channel inner join user on channel.id = user.id"
  ,).spread(result => {
      res.json(result)
    })
})

//create user
router.post('/user',(req, res)=>{
  const phone_number = req.body.phone_number
  const name = req.body.name
  const profile_picture_url = req.body.profile_picture_url
  user.create({
    phone_number: phone_number,
    name: name,
    profile_picture_url: profile_picture_url
  })
  .then(user =>{
    res.json(user)
  })
  .catch(err =>{
    user.findOne({where:{phone_number}})
    .then(hasil =>{
      res.json(hasil)
    })
    // res.json( err.errors)
  })
})
// login with jwt
router.post('/login',(req, res)=>{
  var phone_number = req.body.phone_number
  user.findOne({where :{phone_number}})
  .then(user =>{
    var token = jwt.sign({'phone_number': req.body.phone_number}, key.secret,{expiresIn: 60 * 60})
    if (user == null) {
      res.json('invalid data')
    } else{
      res.json((token))
    }
  })
})
// post chat
router.post('/sendChat', (req, res)=>{
  sequelize.sequelize.query("").spread(result =>{
    
  })
})
// edit data profile user
router.put('/user/:id',(req, res)=>{
  var id = req.params.id
  user.update({
    phone_number : req.body.phone_number,
    name : req.body.name,
    profile_picture_url : req.body.profile_picture_url
  },{
    where:{
      id
    }
  })
  .then(result =>{
    res.json('updated')
  })
} )

module.exports = router