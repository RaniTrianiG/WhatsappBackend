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
    res.send(result)
    var data = result
    console.log(JSON.stringify(data))
    for (let i = 0; i < result.length; i++) {
      console.log(result[i]['id']) 
    }
    console.log(result['id'])
  })
})
// GET USER BY NUMBER
router.get('/user/num=:phone_number',(req, res) =>{
  var phone_number = req.params.phone_number
  user.findOne({where:{phone_number}})
  .then(result => res.send(result))
})
//GET CHAT
router.get('/chat',(req, res)=>{
  chat.findAll().then(result =>{
    res.json(result)
  })
})
//GET CHANNEL BY CH_ID
router.get('/chat/ch=:channel', (req, res) => {
  sequelize.sequelize.query("select chat.id,user.name,chat.channel_id, \
  chat.user_id, chat.message,chat.image_url,chat.createdAt, chat.updatedAt \
  from chat inner join user on chat.user_id = user.id where channel_id ="+req.params.channel+""
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
  sequelize.sequelize.query("select channel.id, channel_user.user_id, \
  channel.name, channel.type, chat.message, chat.image_url from channel \
  inner join channel_user on channel.id = channel_user.channel_id inner join \
  chat on channel.id = chat.channel_id where channel.id ="+req.params.id+"").
  spread(result =>{
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
  sequelize.sequelize.query("select channel.id,channel.type, channel.name from channel \
  inner join user on channel.id = user.id where channel.id ="+req.params.channel+""
  ,).spread(result => {
      res.json(result)
    })
})
router.get('/chatlist', (req, res) => {
  sequelize.sequelize.query("select channel.id,channel.name, channel.type, \
  group_concat(DISTINCT channel_user.user_id) as user_id, \
  group_concat(chat.message order by chat.message asc limit 1) as \
  message from channel inner join channel_user on channel_user.channel_id = channel.id \
  inner join chat on chat.channel_id = channel.id group by channel.name, channel.id")
  .spread(result => {
      res.json(result)
    })
})
router.get('/chatlist/detail',(req, res )=>{
  chat.findAll({attributes:['channel_id','message','createdAt']})
  .then(result =>{
    res.json(result)
  })
  .catch(err =>{
   res.json(err)
  })
})

//create user
router.post('/user',(req, res)=>{
  var phone_number = req.body.phone_number
  var name = req.body.name
  var profile_picture_url = req.body.profile_picture_url
  user.create({
    phone_number,
    name,
    profile_picture_url
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
// new chat
router.post('/newchat', (req, res, err)=>{
  var name = req.body.name +'_'+ req.body.friend
  channel.create({
    name,
    type:'one_on_one'
  }).then(result =>{
    var channel_id = result['id']
    var my_user_id = req.body.my_user_id
    var from_user_id = req.body.from_user_id
    channel_user.create({channel_id,user_id: my_user_id})
    channel_user.create({channel_id,user_id: from_user_id})
    res.send('created new chat')
  }).catch(err => res.send(err))

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
    res.send('user updated')
  })
})
// Edit Chat message
router.put('/chat/:id',(req, res)=>{
  var message = req.body.message
  var id = req.params.id
  chat.update({message, updatedAt: chat.sequelize.fn('NOW')},{where:{id}})
  .then(()=>{
    res.send('chat edited')
  })
})
// Delete Chat
router.delete('/chat/del=:id',(req, res)=>{
  var id = req.params.id
  chat.destroy({where:{id}})
  .then(()=>{
    res.send('chat deleted')
  })

})

module.exports = router
