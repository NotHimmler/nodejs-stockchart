var Tickers = module.exports = {
    tickers: [],

    add: function(ticker) {
        this.tickers.push(ticker);
    },
    remove: function(ticker) {
        var index = this.tickers.indexOf(ticker);

        if (index >= 0) {
            this.tickers.splice(index, 1);
        }
    }
}