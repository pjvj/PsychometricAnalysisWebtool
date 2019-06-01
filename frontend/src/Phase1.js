        import React,{Component} from 'react';
        import Webcam from "react-webcam";
        // import { ReactMic } from 'react-mic';
         import  ReactMicRecord  from 'react-mic-record';
        // import Recorder from 'recorder-js';
        import "./phase1.css"
     //   import { saveAs } from 'file-saver';
        // const fs = require('fs');
        const axios = require("axios");
        var FileSaver = require('file-saver');
        // var h=1;
        // const audioContext =  new (window.AudioContext || window.webkitAudioContext)();
        
        // const recorder = new Recorder(audioContext, {
        // onAnalysed: data =>
        //     console.log(data),
        // });
        export default class Phase1 extends Component{
            constructor(props) {
                super(props);
                this.state={
                    
                    refresh:1,
                    record:false,
                    quesans1:this.props.quesans1,
                    qid:0,
                    showtest: 0,
                    test:"",
                    showselect: true,
                    isRec: false,
                    blob:null,
                    noofcaptures:0,
                    breakpoints:[],
                    speechtext:""

                }
                this.onStop = this.onStop.bind(this)
            }
            setRef = webcam => {
                this.webcam = webcam;
              };

            captureOne=()=>{
                this.setState({
                    singleCapture:true
                });
                this.capture();
            }
            capture = () => {
                const imageSrc = this.webcam.getScreenshot();
                let y=this.state.noofcaptures;
                this.setState({
                    noofcaptures:y+1
                });
                console.log("image taken",this.state.noofcaptures);
                var dataURI=imageSrc;
                var byteString = atob(dataURI.split(',')[1]);
                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
                // write the bytes of the string to an ArrayBuffer
                var ab = new ArrayBuffer(byteString.length);
                // create a view into the buffer
                var ia = new Uint8Array(ab);
                // set the bytes of the buffer to the correct values
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                // write the ArrayBuffer to a blob, and you're done
                var blob = new Blob([ab], {type: mimeString});
                var file = new File([blob], "imagefer"+this.state.noofcaptures+".png", {type: "image/png", lastModified: Date.now()});
                var data = new FormData();
                data.append('imgUploader',file);
                var config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }  
                };
                axios.post(`http://localhost:8889/uploadfer/`,data,config)
                    .then((response) => {
                        console.log("The fer image is successfully uploaded");
                    }).catch((error) => {
                });
                
            }
            
            onData(recordedBlob) {
                
                 console.log('chunk of real-time data is: ', recordedBlob);
            }
            
            onStop(recordedBlob) {
                console.log('recordedBlob is: ', recordedBlob);
                // localStorage.setItem("audioblob", JSON.stringify({"audioblob":recordedBlob}));   
                FileSaver.saveAs(recordedBlob.blobURL, "rec"+(this.state.qid+1)+".webm");
                // () =>{
                
                var x=9000000000;
                while(x--);
                fetch("http://localhost:8000/FindEmotionSpeech/",
                    {
                        method: 'post',
                        headers: new Headers({'content-type': 'application/json'}),
                        "withCredentials":true,
                        "mode":"cors",   
                        body: JSON.stringify({"filenumber":""+(this.state.qid+1)})
                    }
                    ).then(response => {
                        return response.json()
                    }).then(response=>{
                        console.log("iske ander aaya hai.....")
                        console.log(response);
                        // console.log("hhhhhhhhh",h)
                        var l=JSON.parse(localStorage.getItem("ser"));
                        if(this.state.qid+1===1)
                        {
                            var x=[]
                            x.push(response);
                            localStorage.setItem("ser", JSON.stringify({"ser":x}));
                        
                        }
                        else
                        {
                            var x=l.ser;
                            x.push(response);
                            localStorage.setItem("ser", JSON.stringify({"ser":x})); 
                        }
                        var me = this;
                        fetch("http://localhost:8000/RecordFindSentiment/",
                        {
                            method: 'post',
                            headers: new Headers({'content-type': 'application/json'}),
                            "withCredentials":true,
                            "mode":"cors",
                        }).then(response => {
                            return response.json();
                        }).then(data=>{
                            console.log("dataadatadatata",data);
                            localStorage.setItem("sersenti", JSON.stringify({"sersenti":data[0]})); 
                            me.setState({speechtext: data[1][data[1].length-1]},
                                ()=>{
                                    // var h=this.state.refresh;
                                    // h=h+1;
                                    // this.setState({refresh:h});
                                });
                               
                            localStorage.setItem("speechtext", JSON.stringify({"speechtext":data[1]})); 
                            console.log(me.state.speechtext);
                            
                        }).catch(err=>{
                            console.log(err);
                        });
                            
                    }).catch(err=>{
                        console.log(err);
                    });
                    
                    var h=this.state.refresh;
                                    h=h+1;
                                    this.setState({refresh:h});
                // })
            }

            Recording=(e)=>{
                let name = e.target.name;
                let y=this.state.audionum;
                //var myVar;
                if(name==='startrec')
                {
                    this.setState({
                        record:true,
                        audionum:y+1
                    });
                this.myVar = setInterval(this.capture, 4000);
                setTimeout(()=> { clearInterval( this.myVar ); }, 13000);
                console.log("chalu ho gaya");
                }
                else if(name==='stoprec')
                {
                    let r=this.state.refresh;
                    this.setState({
                        record:false,
                        refresh: r+1
                    });
                    
                    window.clearInterval(this.myVar);
                    console.log("khatam ho gaya");
                    var p= this.state.breakpoints;
                    p.push(this.state.noofcaptures);
                    this.setState({breakpoints:p});
                    localStorage.setItem("breaks", JSON.stringify({"breaks":this.state.breakpoints}));      
                    // var blob= JSON.parse(localStorage.getItem("audioblob")).audioblob;
                    // FileSaver.saveAs(blob.blobURL,"rec"+y+".wav");
      //FER-- s=s+"Angry: "+x[0]+"\nDisgust: "+x[1]+"\nFear: "+x[2]+"\nHappy: "+x[3]+"\nSad: "+x[4]+"\nSurprised: "+x[5]+"\nNeutral: "+x[6];
        //speech emotion-- neutral , calm, happy, sad, angry, fear, disgust
                }
            }       

            handleQuestion=(e)=>{
                let name = e.target.name;
                let qi=this.state.qid;        
                let ql=this.state.quesans1.length;
                if(name==='quesprevious')
                {
                    if(qi===0)qi=ql-1;
                    else qi-=1;
                    this.setState({
                        qid:qi,
                        speechtext:""
                    });
                    
                }
                else if(name==='quesnext')
                {
                    if(qi===ql-1)qi=0;
                    else qi+=1;
                    this.setState({
                        qid:qi,
                        speechtext:""
                    });
                }
            }
            render(){
                const videoConstraints = {
                    width: 600,
                    height: 600,
                    facingMode: "user"
                };
                // const { recording, stream } = this.state;
                return(
                    <div>
                        <div className="row">
                            <div className="flex">
                                <div className="card1" >
                                    <div className="card-body1">
                                        <h4 className="card-title1">Facial and Speech Emotion Recognition</h4>
                                        <p className="card-text1">Answer the questions that follow.You can navigate through questions using previous and next buttons</p>
                                        <div className="videofeed">

                                            <Webcam
                                                style={{
                                                    width:"-webkit-fill-available",float:'left'
                                                }}
                                                audio={false}
                                                height={450}
                                                ref={this.setRef}
                                                screenshotFormat="image/png"
                                                width={400}
                                                videoConstraints={videoConstraints}           
                                            />

                                        </div>
                                    </div>
                                </div>
                                <div className="card" >
                                    <div className="card-body">
                                        <h4 className="card-title">Emotion Recognition Test</h4>
                                        <p className="card-text">Answer the questions that follow by recording your audio. You can navigate through questions using previous and next buttons</p>
                                        <div>
                                            <p className="displayques">{this.state.qid+1}. {this.state.quesans1[this.state.qid].question} </p>
                                        </div>
                                        <div className="queschangerow">
                                            <button className="changequesp" name="quesprevious" onClick={this.handleQuestion}>Previous</button>
                                            <button className="changequesn" name="quesnext" onClick={this.handleQuestion}>Next</button>
                                        </div>
                                        <div className="audio-div">
                                                <ReactMicRecord style={{width:"200px"}}
                                                record={this.state.record}
                                                className="sound-wave"
                                                onStop={this.onStop}
                                                onData={this.onData}
                                                strokeColor="#000000"
                                                backgroundColor="#FF4081" 
                                                />
                                            </div>
                                        <div className="queschangerow">
                                            <button className="startrec" name="startrec" onClick={this.Recording} type="button">StartRecording</button>
                                            <button className="stoprec" name="stoprec" onClick={this.Recording} type="button">StopRecording</button>
                                        </div>
                        
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

        }