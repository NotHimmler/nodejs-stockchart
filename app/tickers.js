var Tickers = module.exports = {
    tickers: [],

    add: function(ticker) {
        this.tickers.push(ticker);
    },
    remove: function(ticker) {
        var index = tickers.indexOf(ticker);

        if (index >= 0) {
            tickers.splice(index, 1);
        }
    }
}