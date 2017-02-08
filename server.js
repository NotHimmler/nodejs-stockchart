var express = require('express');
var app = express();
var hbs = require('express-handlebars');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.engine('hbs', hbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', ('views'));
app.use(express.static('scripts'));
app.use(express.static('public'));
app.use(express.static('bower_components'));

require('./app/routes.js')(app);

app.set('port', process.env.PORT || 8080);

var numConnected = 0;
var tickers = 10;

io.on('connection', function(socket) {
    console.log('a user connected');
    numConnected++;
    socket.emit('messages', 'Hello from the server! ' + numConnected + " user" + (numConnected > 1 ? "s" : "") + " connected.");
    socket.broadcast.emit('messages', 'User joined! ' + numConnected + " user" + (numConnected > 1 ? "s" : "") + " connected.");

    socket.on("user-message", function(message) {
        socket.broadcast.emit('chat-msg', message);
    })

    socket.on('disconnect', function() {
        numConnected--;
        console.log("user disconnected");
        socket.broadcast.emit("messages", "A User disconnected. " + numConnected + " user" + (numConnected > 1 ? "s" : "") + " remaining.");
    })
});

server.listen(app.get("port"));