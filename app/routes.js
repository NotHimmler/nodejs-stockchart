var Tickers = require('./tickers');
var Path = require('path');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('home');
    });

    app.get('/get_tickers', function(req, res){
        res.send(Tickers.tickers);
    });

    app.get('/get_data/:ticker', function(req,res){
        var ticker = req.params.ticker;
        var pathname = Path.join(__dirname,'../public/json',ticker+".json");
        res.sendFile(pathname);
    })
}