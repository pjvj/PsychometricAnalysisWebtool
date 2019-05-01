import React,{Component} from 'react';
import "./phase3.css"
export default class MessageList extends Component {
    render() {

        return (
            <ul className="message-list">
                {this.props.messages.map((message, index) => {
                    return (

                      <li  key={message.id} className={(index%2===0 ? "user":"computer")}>
                        <div>{message.senderId}</div>
                        <div>{message.text}</div>
                      </li>
                    )
                })}
            </ul>
        )



    //   return (
    //     // <div className="messagelist">
    //     <ul className="message-list">                 
    //         {this.props.messages.map((message,index) => {
    //             return (
                
    //                  <li key={message.id} classname={(index%2===0 ? "computer":"user")}>
    //                 {/* <li key={message.id} classname="message"> */}
    //                 {/* <div classname={(message.index%2===0)?"computer":"user"}> */}
    //                     <div>{message.senderId}</div>
    //                     <div>{message.text}</div>
    //                 </li>
    //             )}
    //         )}
    //    </ul>
    // //    </div>
    //   )
    }
  }