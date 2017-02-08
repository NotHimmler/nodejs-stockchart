var Highcharts = require('highcharts/highstock.js');
var nodata = require('highcharts/modules/no-data-to-display.js');
var $ = require('jquery');

var seriesOptions = [], seriesCounter = 0, names = [];
var location = window.location;

var socket = io.connect('http://' + document.domain + ":" + location.port);

function addName(name){
    var index = names.indexOf(name);

    if(index < 0){
        names.push(name);
    }
}

function removeName(name){
    var index = names.indexOf(name);

    if(index >= 0){
        names.splice(index, 1);
    }
}

var Header = require('./header');

var AddStock = React.createClass({
    getInitialState: function(){
        return ({ticker: ""});
    },

    addStock: function(){
        var context = this;
        if(this.state.ticker != "" && names.indexOf(this.state.ticker) < 0){
            socket.emit('add', this.state.ticker);
        }
    },

    handleChange(event) {
        this.setState({ticker: (ReactDOM.findDOMNode(this.refs.ticker).value)});
    },

    render: function(){
        return (
            <div>
                <input type="text" onChange={this.handleChange} ref="ticker" name="input"></input>
                <button onClick={this.addStock}>Add</button>
            </div>
        )
    }
});

var Ticker = React.createClass({
    getInitialState: function(){
        return ({});
    },

    handleClick: function(){
        socket.emit("remove",this.props.name);
    },

    render: function(){
        return (
            <div className="ticker">
                {this.props.name}
                <button onClick={this.handleClick}>X</button>
            </div>
        )
    }
});

var App = React.createClass({
    getInitialState: function(){
        return ({tickers: []});
    },

    componentDidMount: function(){
        var context = this;
        $.getJSON("http://"+location.host+"/get_tickers", function(data){
            names = data;
            $.each(names, function(i, name){
                context.addTicker(name);
            });

            redrawChart();
        })
    },

    addTicker: function(ticker){
        var tickers = this.state.tickers;
        var tickerAlreadyAdded = false;
        for(var i = 0; i < tickers.length; i++){
            if(tickers[i].props.name === ticker){
                tickerAlreadyAdded = true;
            }
        }

        if(!tickerAlreadyAdded){
            addName(ticker);
            tickers.push(<Ticker name={ticker} removeTicker={this.removeTicker}/>);
            this.setState({tickers: tickers}, function(){
                redrawChart();
            });
        }
    },

    removeTicker: function(ticker){
        var tickers = this.state.tickers;
        var index = 0;
        var tickerFound = false;

        removeName(ticker);

        while(index < tickers.length && !tickerFound){
            if(tickers[index].props.name == ticker){
                tickers.splice(index,1);
                tickerFound = true;
                console.log("Remove Ticker calling redrawChart");
                redrawChart();
            }
            index++;
        }

        this.setState({tickers: tickers});
    },

    render: function() {
        var context = this;
        socket.on('added', function(name){
            context.addTicker(name);
        });

        socket.on('removed', function(name){
            context.removeTicker(name);
        });

        var tickers = this.state.tickers;

        return (
            <div>
                <Header />
                <div className="app-body">
                    <div className="flex-row">
                        <div id="container"></div>
                    </div>
                    <div className="flex-row tickers">
                        {tickers}
                    </div>
                    <div className="flex-row add-ticker">
                        <AddStock addTicker={this.addTicker} />
                    </div>
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <App />, document.getElementById('main')
);

function createChart(){
    Highcharts.stockChart('container', {
        rangeSelecter: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function(){
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },

            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }],
            
            showEmpty: true
        },

        xAxis: {
            showEmpty: true
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    })
}

function redrawChart(){
    seriesCounter = 0;
    seriesOptions = [];

    if(names.length === 0)
        createChart();

    $.each(names, function(i, name){
        $.getJSON('http://'+location.host+'/get_data/'+name, function(data){
            seriesOptions[i] = {
                name: name,
                data: data
            };

            seriesCounter += 1;

            if(seriesCounter === names.length){
                createChart();
            }
        })
    })
}
