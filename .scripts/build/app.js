'use strict';

var socket = io.connect('http://localhost:8080');
socket.on('connect', function (data) {
    socket.emit('join', 'Hello World from client');
});

socket.on('messages', function (data) {
    console.log(data);
});

var App = React.createClass({
    displayName: 'App',

    getInitialState: function getInitialState() {
        return { message: "" };
    },
    componentDidMount: function componentDidMount() {
        socket.on("chat-msg", function (msg) {
            console.log(msg);
        });
    },
    handleMessageChange: function handleMessageChange(e) {
        console.log("message changing");
        this.setState({ message: e.target.value });
    },
    handleSubmit: function handleSubmit(evt) {
        message = document.getElementById("message");

        socket.emit('user-message', message.value);
        message.value = "";
        evt.preventDefault();
        evt.returnValue = false;
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement('div', { id: 'messages' }),
            React.createElement(
                'form',
                { onSubmit: this.handleSubmit },
                React.createElement('textarea', { name: 'message', id: 'message' }),
                React.createElement('br', null),
                React.createElement('input', { type: 'submit', value: 'Send', onChange: this.handleMessageChange })
            )
        );
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('mount'));