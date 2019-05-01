import React, { Component } from "react";

import "./viewreport.css" 
import CanvasJSReact from './canvasjs.react';

const axios = require("axios");
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class ViewReport extends Component {

  constructor(props) {
    super(props);
    this.state={
        quesans1:[],
        showEmotion:false,
        options:[],
        ferImages:[],
        facescores:[],
        FERS:[],
        breaks:[],
        updatedferimages:false,
        quesans3:[],
        serscores:[],
        seropts:[],
        sersenti:[],
        sersentiopts:[],
        showquesscore:[],
        faceset:false,
        ss:[],

        sentianswer:[],
        answerlist:[],
        showsentiment:false,
        sentimentvalue:[],
        iscore:[],
        images:[],


        showchatscore:false,
        chatscore:[],
        chatdata:[]
    }
  }
componentDidUpdate(prevProps, prevState){
    if (prevState.updatedferimages !== this.state.updatedferimages) {
        
        if (this.state.FERS.length) {
            this.divideit();
            // var x=this.state.FERS.splice(0,2);
            }
      }
      if (prevState.faceset !== this.state.faceset) {
        console.log("haaaaaaaaa");
        if (this.state.facescores.length) {
            this.callres();
            // var x=this.state.FERS.splice(0,2);
            }
      }

}
// callres=()=>{
//     var f=this.state.facescores;
//     var ss=this.state.ss;
//     var l,i;
//     var first,second,arr,fs=[],ss=[];
//     var maxione, maxitwo;
//     var findface={
//         0: -4,
//         1: -5,
//         2: -2,
//         3: 10,
//         4: -1,
//         5: 2,
//         6: 5
//     }
//         for(i=0;i<f.length;i++)
//         {
//             arr=f[i];
//             first=Math.max.apply(null, arr)
//             maxione = arr.indexOf(first);
//             second= this.secondMax(arr);
//             maxitwo=arr.indexOf(second);
//             fs.push(findface[maxione]+findface[maxitwo])

//         }
//         console.log("print karne k liye ....", fs)
//         l=JSON.parse(localStorage.getItem("sersenti")).sersenti;
//         var confs=[],certs=[],res=[],conf,cert,s;
//         console.log()
//         for(i=0;i<l.length;i++)
//         {
//             arr=l[i];
//             conf=arr[0];
//             confs.push(conf);
//             cert=arr[1];
//             certs.push(cert);
//             s="FACE Emotion: "+fs[i]+"\nSPEECH Emotion: "+ss[i]+"\n Confidence: "+confs[i]+"\n Ceratinity: "+certs[i];
//             res.push(s);
//         }
//         this.setState({showquesscore:res});
// }
divideit=()=>{
    var p= this.state.FERS;
    var breaks= this.state.breaks;
    var q,ll=[],i=0;
    for(var j=0;j<breaks.length;j++){
        q=breaks[j];
        var l=[];
        for(;i<q;i++)
        {
            l.push(p[i]);
        }
        ll.push(l);
        i=q;
    }
    console.log("ye h l of ll",ll)
    this.setState({
        FERS:ll
    });
    // const me=this;
    fetch("http://localhost:8000/FindEmotionFace/",
    {
        method: 'post',
        headers: new Headers({'content-type': 'application/json'}),
        "withCredentials":true,
        "mode":"cors"   
        
    }).then(response => {
        return response.json()
    }).then((data) => {

        var opt=[],x,z;
        for (var i=0;i<data.length;i++)
        {
            x=data[i];
            z= {
                title: {
                    text: "Your Emotion Flow"
                },
                axisY:{
                        minimum: 0,
                        maximum: 100,
                        interval: 20
                      },
                height:200,
                width:300,
                data: [
                {
                    type: "column",
                    dataPoints: [
                        { label: "Angry",  y:  x[0] },
                        { label: "Disgust", y: x[1]  },
                        { label: "Fear", y: x[2]  },
                        { label: "Happy",  y: x[3]  },
                        { label: "Sad",  y: x[4]  },
                        { label: "Surprised",  y: x[5]  },
                        { label: "Neutral",  y: x[6]  }
                    ]
                }
                ]

            }
            opt.push(z);
        }
        var breaks= this.state.breaks;
        ll=[];
        i=0;
        for(var j=0;j<breaks.length;j++)
        {
            q=breaks[j];
            l=[];
            for(;i<q;i++)
            {
                l.push(opt[i]);
            }
            ll.push(l);
            i=q;
        }
        console.log("aaya",data);
        this.setState({
            facescores:data,
            options:ll
            // showEmotion:true
        },()=>{
            console.log("hua tha kabhi")
            var findspeech={
                0:5,1:3,2:10,3:-1,4:-4,5:-5,6:-2
            }
            var l=JSON.parse(localStorage.getItem("ser")).ser;
            var first,second,arr,fs=[],ss=[];
            var maxione, maxitwo;
            if(l)
            {
                this.setState({
                    serscores:l
                })
            var opt=[],x,z;
                for (var i=0;i<l.length;i++)
                {
                    x=l[i];
                    z= {
                        title: {
                            text: "Your Speech Emotion Flow"
                        },
                        axisY:{
                                minimum: 0,
                                maximum: 100,
                                interval: 20
                              },
                        height:200,
                        width:300,
                        data: [
                        {
                            type: "column",
                            dataPoints: [
                                { label: "Neutral",  y:  x[0] },
                                { label: "Calm", y: x[1]  },
                                { label: "Happy", y: x[2]  },
                                { label: "Sad",  y: x[3]  },
                                { label: "Angry",  y: x[4]  },
                                { label: "Fear",  y: x[5]  },
                                { label: "Disgust",  y: x[6]  }
                            ]
                        }
                        ]
                    }
                    opt.push(z);
                }
                this.setState({
                    seropts:opt
                })
                for(i=0;i<l.length;i++)
                {
                    arr=l[i];
                    first=Math.max.apply(null, arr)
                    maxione = arr.indexOf(first);
                    second= this.secondMax(arr);
                    maxitwo=arr.indexOf(second);
                    ss.push(findspeech[maxione]+findspeech[maxitwo])
                }
                console.log("dtyuggvddvyyguihj.......",ss)
            }
            var f=this.state.facescores;
            var findface={
                0: -4,
                1: -5,
                2: -2,
                3: 10,
                4: -1,
                5: 2,
                6: 5
            }
                for(i=0;i<f.length;i++)
                {
                    arr=f[i];
                    first=Math.max.apply(null, arr)
                    maxione = arr.indexOf(first);
                    second= this.secondMax(arr);
                    maxitwo=arr.indexOf(second);
                    fs.push(findface[maxione]+findface[maxitwo])
                }
                var breaks= this.state.breaks;
                ll=[]
                j=0
                for(i=0;i<breaks.length;i++)
                {
                    x=breaks[i];
                    l=0;
                    for(;j<x;j++)
                    {
                        l=l+fs[j];
                    }
                    ll.push(l);
                    j=q;
                    
                }
                fs=ll;
                console.log("print karne k liye ....", fs)
                l=JSON.parse(localStorage.getItem("sersenti")).sersenti;
                var confs=[],certs=[],res=[],conf,cert,s;
                console.log()
                for(i=0;i<l.length;i++)
                {
                    arr=l[i];
                    conf=arr[0];
                    confs.push(conf);
                    cert=arr[1];
                    certs.push(cert);
                    s="FER: "+fs[i]+"\nSER: "+ss[i]+"\nConfidence: "+confs[i]+"\nCertainity: "+certs[i];
                    res.push(s);
                }
                this.setState({
                    showquesscore:res,
                    showEmotion:true
                });



            // this.setState({
            //     faceset:true,
            //     showEmotion:true
            // });
        });
        console.log("aaya...",this.state.options);
        

    }).catch(err=>{
        console.log(err);
    })

}
changeit=()=>{
    this.setState({
        FERS:this.state.ferImages,
       updatedferimages:true
   });
}
secondMax = (arr)=>{ 
    var max = Math.max.apply(null, arr), // get the max of the array
        maxi = arr.indexOf(max);
    arr[maxi] = -Infinity; // replace max in the array with -infinity
    var secondMax = Math.max.apply(null, arr); // get the new max 
    arr[maxi] = max;
    return secondMax;
};
FirstPhase=()=>{
    const me = this;
    var testname= JSON.parse(localStorage.getItem("testname")).testname;
    var breaks= JSON.parse(localStorage.getItem("breaks")).breaks;
    this.setState({breaks:breaks});
    axios.get(`http://localhost:8889/findtest1/${testname}`)
            .then((response) => {
                console.log(response.data.response);
                this.setState({
                    quesans1:response.data.response
                });
            }).catch((error) => {
        });
        axios.get(`http://localhost:8889/findferimages/`)
        .then((response) => {
            console.log(response.data.response);
            // me.setState({
            //     ferImages:response.data.response
            // });
            // let images=me.state.ferImages;
            let images= response.data.response;
            console.log("before",images);
            var imagesshow = [];
            images.map((value,key)=>{
                //console.log("image ka naam", value);
                let url =`http://localhost:8889/getferimage/${value}`; 
                fetch(url).then((res)=>res.blob()
                ).then((res)=>{
                    //console.log(res);
                    imagesshow.push(res);
                    me.setState({
                        ferImages:imagesshow
                    });
                    if(imagesshow.length>=breaks[breaks.length-1])
                    {
                        this.setState({
                            ferImages:imagesshow
                        },()=>{
                            console.log("......eeeee");
                            this.changeit();
                        });
                    }
                }).catch((error)=>{
                    console.log(error);

                });   
            });
             
            console.log("true fase",this.state.updatedferimages);    
            console.log("after",this.state.ferImages);
          
        }).catch((error) => {
    });
    
    
        // console.log("print karne k liye ....", ss)
        // this.setState({
        //     ss:ss
        // });
    
        
        
        // var sp=this.state.serscores;
        
        
        
}
SecondPhase=()=>{
const me = this;
var testname= JSON.parse(localStorage.getItem("testname")).testname;
axios.get(`http://localhost:8889/findimages/${testname}`)
            .then((response) => {
                console.log(response.data.response);
                this.setState({
                    images:response.data.response
                });
                let images=this.state.images;
                console.log("before",images);
                let imagesshow = [];
                images.map((value,key)=>{
                    //console.log("image ka naam", value);
                    let url =`http://localhost:8889/getimage/${testname}/${value}`; 
                    fetch(url).then((res)=>res.blob()
                    ).catch((error)=>{
                        console.log(error);

                    }).then((res)=>{
                        //console.log(res);
                    imagesshow.push(res);
                    this.setState({
                        images:imagesshow
                    });});
                    
                    
                });
                this.setState({
                    images:imagesshow
                });
                console.log("after",this.state.images);
                // if(this.state.images.length>0)
                // {
                //     this.setState({
                //         showtest: 1
                //     });
                // }
                //console.log("state image",this.state.images);
                
            }).catch((error) => {
        });


fetch("http://localhost:8889/getSentimentAnswer/",
        {
            method: 'post',
            headers: new Headers({'content-type': 'application/json'}),
            "withCredentials":true,
            "mode":"cors"   
        }).then(response=>{
            return response.json()
        }).then(data=>{
            console.log(data);
            me.setState({sentianswer:data});
            var y;
            data = me.state.sentianswer;
            var l=[]
            for (var i=0;i<data.length;i++)
            {
                var value=data[i];
                l.push(Object.values(value)[0])
            }
            me.setState({answerlist:l});
                fetch("http://localhost:8000/FindSentiment/",
                    {
                        method: 'post',
                        headers: new Headers({'content-type': 'application/json'}),
                        "withCredentials":true,
                        "mode":"cors",
                        body: JSON.stringify({
                            "answers": l
                        })
                    }).then(response => {
                        return response.json();
                    }).then(data=>{
                        console.log("dataadatadatata",data)
                        y=me.state.iscore;
                        // y.push(data)
                        me.setState({
                            iscore: data
                        });
                        y=[]
                        for(var i=0;i<this.state.iscore.length;i++)
                        {
                            var iscore=this.state.iscore[i];
                            let s="";
                            s=s+" Negative: "+(iscore[0]*100).toFixed(2)+"/n Neutral: "+(iscore[1]*100).toFixed(2)+"/n Positive: "+ (iscore[2]*100).toFixed(2);
                            y.push(s)
                        }
                        
                        me.setState({
                            sentimentvalue:y,
                            showsentiment:true
                        });
                        // console.log(me.state.sentimentvalue);
                        // console.log(this.state.sentimentvalue);

                    }).catch(err=>{
                        console.log(err);
                    });

        }).catch(err=>{
            console.log(err);
        });
}

ThirdPhase=()=>{
    fetch("http://localhost:8889/getResultsThree/",
                    {
                        method: 'post',
                        headers: new Headers({'content-type': 'application/json'}),
                        "withCredentials":true,
                        "mode":"cors",
                    }).then(response => {
                        return response.json();
                    }).then(data=>{
                        console.log("dataadatadatata",data.response);
                        console.log("ye lo",data.response[1]);
                        var x=data.response;
                        console.log("legth",Object.keys(x).length);
                        var chatques=[],chatexp=[],chatact=[],chatdif=[],chatscore=[],chatbot=[]
                        for (var i=0;i<Object.keys(x).length;i++)
                        {
                            console.log("ttjukjn xghfevrv...")
                            console.log(x[i].ques);
                            chatques.push(x[i].ques);
                            chatexp.push(x[i].exp);
                            chatact.push(x[i].act);
                            chatdif.push(x[i].dif);
                            chatscore.push(""+x[i].score+" / "+(10*x[i].dif));
                        }
                        chatbot.push(chatques);
                        chatbot.push(chatexp);
                        chatbot.push(chatact);
                        chatbot.push(chatdif);
                        chatbot.push(chatscore);
                        this.setState({
                            chatdata:x,
                            chatscore:chatbot},
                            ()=>{
                                if(this.state.chatscore.length)
                                this.setState({showchatscore:true});
                            }
                        );
                        console.log(this.state.chatdata);
                        console.log(this.state.chatscore);

                    }).catch(err=>{
                        console.log(err);
                    })
}

combineResult=()=>{


}

  render() {
   const {quesans1,
    showEmotion,
    options,
    ferImages,
    facescores,
    FERS,
    breaks,
    updatedferimages,
    quesans3,
    serscores,
    seropts,
    sersenti,
    sersentiopts,
    showquesscore,
    faceset,sentianswer,
    answerlist,
    showsentiment,
    sentimentvalue,
    iscore,
    images,
    showchatscore,
    chatscore,
    chatdata} = this.state;

    
    return (
      <div>
              <div className="row">
                  <div className="flex">
                      <div className="card14" >
                          <div className="card1-body4">
                              <h4 className="card1-title4">Facial and Speech Emotion Recognition</h4>
                              <div className="card1-text4">
                                {
                                    (showEmotion)?(
                                        <div className="display2">
                                            <table>
                                            <colgroup>
                                                <col style={{width:"18%"}}/>
                                                <col style={{width:"20%"}}/>
                                                <col style={{width:"25%"}}/>
                                                <col style={{width:"25%"}}/>
                                                <col style={{width:"12%"}}/>
                                            </colgroup> 
                                            <tbody>
                                            <tr>
                                                <th>Questions</th>
                                                <th>FacialExpressions</th>
                                                <th>Your FER Scores</th>
                                                <th>Your SER/Sentiment Scores</th>
                                                <th>overall score for question</th>
                                            </tr>
                                            {quesans1.map((value,key)=>{
                                                console.log("i m going bananas ",value,key);
                                                const emoImageArray = FERS[key];
                                                const emoChartArray = options[key];
                                                const sValueArray = showquesscore[key].split('\n');
                                                return (
                                                    <tr className="emoanalysisRow" key ={key}>
                                                        <td>
                                                            <span>{value['question']}</span>
                                                        </td>
                                                        <td className="imageTableCell">
                                                        {emoImageArray.map((val,key) => (
                                                                <img alt="pic" style={{
                                                                    width:"250px",
                                                                    height:"200px",
                                                                    marginBottom: "10px"
                                                                }}src={URL.createObjectURL(val)} name={val} key={key} />
                                                            ))
                                                        }    
                                                        </td>    
                                                        <td className="chartTableCell">
                                                        {emoChartArray.map(val => (
                                                                <CanvasJSChart options = {val} />
                                                            ))
                                                        }
                                                        </td>
                                                        <td className="chartTableCell">
                                                        <CanvasJSChart options ={seropts[key]}/>
                                                        </td>
                                                        <td className="scoreTableCell"> 
                                                        {sValueArray.map(val => (
                                                                <span>{val}</span>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                )
                                                })
                                            }
                                            </tbody>
                                            </table>
                                        </div>
                                    ):  (<div></div> 
                                        )
                                }
                            </div>
                              <div className="Unfold">
                                      <button className="showResult" name="capture" onClick={this.FirstPhase}>Unfold</button>
                                      
                              </div>
                          </div>
                      </div>
                      <div className="card4" >
                          <div className="card-body4">
                              <h4 className="card-title4">Sentiment Analysis of Image Based Description</h4>
                              <div className="card-text4">
                                {
                                    (showsentiment)?(
                                        <div className="display2">
                                            <table>
                                            <tbody>
                                            <tr>
                                                <th>Image</th>
                                                <th>Your Response</th>
                                                <th>Your Scores</th>
                                            </tr>
                                            {images.map((value,key)=>{
                                                console.log("i m going bananas ",value,key);
                                                const sentimentValueArray = sentimentvalue[key].split("/n");
                                                return (
                                                    <tr className="analysisRow" key ={key}>
                                                        <td><img alt="pic" style={{
                                                            width:"100px",
                                                            height:"100px"
                                                            }}src={URL.createObjectURL(value)} name={value} id={"img"+key} /></td>
                                                        <td>
                                                            <span>{answerlist[key]}</span>
                                                        </td>
                                                        <td className="scoreTableCell">
                                                            {sentimentValueArray.map(val => (
                                                                <span>{val}</span>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                )
                                                })
                                            }
                                            </tbody>
                                            </table>
                                        </div>
                                    ):  (<div></div> 
                                        )
                                }
                            </div>
                            <div className=" Unfold">
                                    <button className="showResult" name="capture" onClick={this.SecondPhase}>Unfold</button>
                                    
                            </div>
                            
                          </div>
                      </div>
                  </div>
              </div>
              <div className="row">
                  <div className="flex">
                      <div className="card4" >
                          <div className="card-body4">
                              <h4 className="card-title4">Automated ChatBot</h4>
                              <div className="card-text4">
                                  {
                                      (showchatscore)?(
                                          <div>
                                              <div className="display2">
                                                    <table>
                                                        <colgroup>
                                                            <col style={{width:"25%"}}/>
                                                            <col style={{width:"25%"}}/>
                                                            <col style={{width:"25%"}}/>
                                                            <col style={{width:"10%"}}/>
                                                            <col style={{width:"15%"}}/>
                                                        </colgroup> 
                                                    <tbody>
                                                    <tr>
                                                        <th>Question</th>
                                                        <th>Expected Response</th>
                                                        <th>Your Response</th>
                                                        <th>Difficulty</th>
                                                        <th>Your Scores</th>
                                                    </tr>
                                                    {
                                                        chatscore.map((value,key)=>{
                                                            console.log("value",value);
                                                            return (
                                                                <tr className="chatbot-con" key ={key}>
                                                                    <td className="chatbot">{chatscore[0][key]}</td>
                                                                    <td className="chatbot">{chatscore[1][key]}</td>
                                                                    <td className="chatbot">{chatscore[2][key]}</td>
                                                                    <td className="chatbot1">{chatscore[3][key]}</td>
                                                                    <td className="chatbot1">{chatscore[4][key]}</td>
                                                                </tr>
                                                                )
                                                        })
                                                    }
                                                    </tbody>
                                                    </table>
                                                </div>
                                          </div>

                                      ):(<div></div>)
                                  }
                              </div>
                              <div className=" Unfold">
                                      <button className="showResult" name="capture" onClick={this.ThirdPhase}>Unfold</button>
                                      
                              </div>
                          </div>
                      </div>
                      <div className="card4" >
                          <div className="card-body4">
                              <h4 className="card-title4">Combined Results</h4>
                              <div>
                                  {/* <p className="displayques">{qid+1}. {this.state.quesans1[this.state.qid].question} </p> */}
                              </div>
                              <div className=" Unfold">
                                      <button className="showResult" name="capture" onClick={this.combineResult}>Unfold</button>
                                      
                              </div>
                            
                          </div>
                      </div>
                  </div>
              </div>
      </div>
    );
  }
}
 
export default ViewReport;