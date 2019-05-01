
import React,{Component} from 'react';
import "./phase3.css"

export default class SendMessageForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
           message: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault()
        // this.props.sendMessage(this.state.message)
        this.setState({
          message: ''
        })
    }

    handleChange(e) {
        this.setState({
          message: e.target.value
        })
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit} className="send-message-form">
            <input
                onChange={this.handleChange}
                value={this.state.message}
                placeholder="Type your message and hit ENTER"
                type="text" />
        </form>
      )
    }
  }