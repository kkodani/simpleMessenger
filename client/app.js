var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');


var SimpleMessenger = React.createClass({


  getInitialState: function() {
    return {
      text: '',
      friends: [<p key="0">BOB</p>],
      chatData: []
    };
  },

  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.state.chatData.push(<p key={this.state.chatData.length}>{this.state.text}</p>);
    $.ajax({
      url: '/api/sendChat',
      dataType: 'json',
      type: 'POST',
      data: {text: this.state.text},
      cache: false,
      success: function(data) {
        this.setState({text: ''});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },



  render: function() {

    return (
      <div>
        <div>
          friends list
          {this.state.friends}
        </div>
        <div>
          <div>
            chat area
            {this.state.chatData}
          </div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Type your message"
              value={this.state.text}
              onChange={this.handleTextChange}
            />
          <button type="submit">Send</button>
        </form>
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
