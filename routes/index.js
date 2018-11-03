var express = require('express');
var router = express.Router();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var app = express();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('socket running')
})

// socket io
// io.on('connection', (socket) => {
//   console.log('user connected')
//   socket.on('join', function (userNickname) {
//     console.log(userNickname + ": join chat")
//     socket.broadcast.emit('user joined chat', userNickname + ": has joined chat")
//   });
//   socket.on('message detect', (senderNickname, messageContent) => {
//     //log
//     console.log(senderNickname + ':' + messageContent)
//     let message = { 'message': messageContent, 'senderNickname': senderNickname }
//     socket.emit('message', message)
//   });
//   socket.on('disconnect', () => {
//     console.log('user has left')
//     socket.broadcast.emit('userdiconnet', ' user has left')
//   });
// });
  


module.exports = router;
