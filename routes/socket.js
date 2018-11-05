var chat = require('../models/chat')

exports = module.exports = (io) =>{
  //socket
  io.on('connection', (socket) => {
    console.log('user Connected');
    socket.on('SEND_MESSAGE', (data) => {
      chat.create({
        channel_id: data.channel_id,
        user_id: data.user_id,
        message: data.message,
        image_url: data.image_url,
      })
      console.log(data)
      io.emit('RECEIVE_MESSAGE', data);
    });
    // socket.on('disconnect'), ()=>{
    //   console.log('user disconected');
    // }
  });
}