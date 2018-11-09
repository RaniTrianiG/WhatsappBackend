var chat = require('../models/chat');

 pesan = io =>{
   io.on('connection',(socket) => {
     console.log('a user connected');
     socket.on('disconnect',() => {
       console.log('user disconnected');
      });
      socket.on('SEND_MESSAGE', (data) => {
      io.emit('RECEIVE_MESSAGE', data);
      chat.create({
        channel_id: data.channel_id,
        user_id: data.user_id,
        message: data.message,
        image_url: data.image_url,
      });
    });
  });
}
module.exports = pesan;