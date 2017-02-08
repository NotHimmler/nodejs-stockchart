var express = require('express');
var app = express();
var hbs = require('express-handlebars');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var child = require('child_process');
var Tickers = require('./app/tickers');
var sprintf = require('sprintf').sprintf;

app.engine('hbs', hbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', ('views'));
app.use(express.static('scripts'));
app.use(express.static('public'));
app.use(express.static('bower_components'));

require('./app/routes.js')(app);

app.set('port', process.env.PORT || 8080);

io.on('connection', function(socket) {
    socket.on('add', function(ticker){
        var exec = 'python3 google_finance.py ' +ticker;

        child.exec(exec, function(error, stdout, stderror){
            if(error){
                socket.emit('error', "Error getting stock data");
            } else {
                if(JSON.parse(stdout) == true){
                    Tickers.add(ticker);
                    socket.emit('added',ticker);
                    socket.broadcast.emit('added',ticker);
                }
            }
            
        });
    });

    socket.on('remove', function(ticker){
        Tickers.remove(ticker);
        socket.emit('removed', ticker);
        socket.broadcast.emit('removed',ticker);
    });
});

server.listen(app.get("port"));