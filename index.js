const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let port = 3000;


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/', (req, res) => {
  res.render('chat.html')
});


app.listen(() => {
  console.log(`Servidor hospedado na porta: ${port}`)
})

let messages = [];


io.on('connection', socket => {

  socket.on('yourIP', ip => {
    console.log(ip)
  })

  console.log(`Socket conectado: ${socket.id}`)

 socket.emit('previousMessages', messages)

 socket.on('DelMessages', resposta => {
  messages = [{ user: 'Server', message: 'Chat limpo.'}];
 })

  socket.on('sendMessage', data => {
    messages.push(data); 
    console.log(data)
    socket.broadcast.emit('receivedMessage', data)
  })
})

server.listen(port);