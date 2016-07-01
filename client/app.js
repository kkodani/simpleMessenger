var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var $ = require('jquery');
var _ = require('underscore');

var config = require('./config.js');

firebase.initializeApp(config);
var db = firebase.database();
var allChat = db.ref('db/chatlog');


var SimpleMessenger = React.createClass({


  getInitialState: function() {
    return {
      text: '',
      username: 'Anon',
      room: 'default',
      chatData: {}
    };
  },

  componentDidMount: function() {
    var roomChat = db.ref('db/chatlog/' + this.state.room);
    var that = this;
    roomChat.on('value', function(snapshot) {
      that.setState({chatData: snapshot.val()});
    });
  },

  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleRoomChange: function(e) {
    var that = this;
    this.setState({room: e.target.value, chatData: {}}, function() {
      var roomChat = db.ref('db/chatlog/' + that.state.room);
      roomChat.on('value', function(snapshot) {
        that.setState({chatData: snapshot.val()});
      });
    });
  },

  handleUsernameChange: function(e) {
    this.setState({username: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    // this.state.chatData.push(
    //   <p key={this.state.chatData.length}>
    //     {this.state.username}:
    //     {this.state.text}
    //   </p>
    // );

    var roomChat = db.ref('db/chatlog/' + this.state.room);
    roomChat.push({
      //id: Date.now(),
      username: this.state.username,
      text: this.state.text
    });
    this.setState({text: ''});
    // $.ajax({
    //   url: '/api/sendChat',
    //   dataType: 'json',
    //   type: 'POST',
    //   data: {
    //           text: this.state.text,
    //           username: this.state.username,
    //           room: this.state.room
    //         },
    //   cache: false,
    //   success: function(data) {
    //     this.setState({text: ''});
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(status, err.toString());
    //   }.bind(this)
    // });
  },



  render: function() {

    var chats = _.map(this.state.chatData, function(msg, id) {
      return (
        <p key={id}>
          {msg.username}:
          {msg.text}
        </p>
      );
    }, this);

    return (
      <div>
        <div>
          username
          <input
            type="text"
            placeholder="Userame"
            value={this.state.username}
            onChange={this.handleUsernameChange}
          />
        </div>
        <div>
          room
          <input
            type="text"
            placeholder="Room Name"
            value={this.state.room}
            onChange={this.handleRoomChange}
          />
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <input
            type="text"
            placeholder="Type your message"
            value={this.state.text}
            onChange={this.handleTextChange}
            />
            <button type="submit">Send</button>
          </form>
          <div>
            {chats.reverse()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SimpleMessenger;

ReactDOM.render(
  <SimpleMessenger />,
  document.getElementById('app')
);
