import React,{Component} from 'react';
import MessageList from './messageList';
// import SendMessageForm from './sendMessageForm';
import "./phase3.css"
// const axios = require("axios");

// const DUMMY_DATA = [
//     {
//       senderId: "computer",
//       text: "who'll win?"
//     },
//     {
//       senderId: "user",
//       text: "I'll win..."
//     }
//   ]
export default class Phase3 extends Component{
    constructor(props) {
        super(props);
        this.state={
            quesans3:[],
            messages: [],
            num:1,
            mess:''
        }
    //     this.handleChange = this.handleChange.bind(this)
    // this.handleSubmit = this.handleSubmit.bind(this)
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.quesans3!==prevState.quesans3){
          return { quesans3: nextProps.quesans3};
       }
       else return [];
     }

    // componentWillReceiveProps(nextProps,prevProps)
    // {
    //     console.log("third phase m hum aae.........");
    //     if(prevProps!==nextProps&&nextProps.quesans3.length>0)
    //     {
    //         this.setState({
    //             quesans3:nextProps.quesans3           
    //         });
    //         console.log("third phase m hum aae",this.state.quesans3);
    //     }
    // }
    handleSubmit=(e)=> {
        e.preventDefault()
        console.log("third phase m hum aae",this.state.quesans3);
        // this.props.sendMessage(this.state.message)
        var message= this.state.mess;
        var m= this.state.messages;
        m.push({
            senderId: "user",
            text: message
        })
        this.setState({
            messages:m
        });
        var i=this.state.num;
        var ll=[]
        console.log("i",i);
        if(i===4)
        {
            ll=this.state.quesans3;
        }
        console.log("ll",ll);
        fetch("http://localhost:8000/ChatterBot/",
    {
        method: 'post',
        headers: new Headers({'content-type': 'application/json'}),
        "withCredentials":true,
        "mode":"cors"  ,
        body: JSON.stringify({
            "text" : message,
            "quesans3": ll
        }) 
        
    }).then((response)=>{
        console.log("messsssss aaayyyaaa",response);
        return response.json();
    })
    .then((data) =>{
        console.log("message aaya",data);
        var m= this.state.messages;
        m.push({
            senderId: "computer",
            text: data
        })
        this.setState({
            messages:m
        });
    }).catch(err=>{
        console.log(err);
    })
        this.setState({
          mess: ''
        });

        i=this.state.num;
        
        this.setState({
            num:i+1
        })

    }

    handleChange=(e)=> {
        this.setState({
          mess: e.target.value
        })
    }

    

    render() {
        return (
            <div className="phase3">
                <div className="card3">
                    <div className="card-body3">
                    <h4 className="card-title3">Automated ChatBot</h4>
                        <p className="card-text3"> You can question and answer here in 10-50 words. </p>
                        {/* <div className="messageform"> */}
                            <form onSubmit={this.handleSubmit} className="send-message-form">
                                <input
                                    onChange={this.handleChange}
                                    value={this.state.mess}
                                    placeholder="Type your message and hit ENTER"
                                    type="text" />
                            </form>
                        {/* </div> */}
                        
                        <div className="messagelist-container" > 
                            <MessageList messages={this.state.messages}/>
                            
                        </div>
                        
                    </div>
                </div>
            </div>
        )
      }
}