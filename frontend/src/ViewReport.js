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
        maxface:[],
        maxspeech:[],
        speechtext:[],

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
                width:295,
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
                        width:295,
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
                    ss.push(""+(findspeech[maxione]+findspeech[maxitwo])+" / 15");
                    
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
            var maxfaceDict={
                0: "An angry expression includes eyebrows down and together, glaring or bulging eyes and narrowed lips. It is often related to a response within the range of minor irritation to intense rage. Anger is associated with the fight or flight brain response when a person is introduced to an experience that causes them to feel threatened or in pain. An easily angered person is considered unstable and prone to quick reactions and judgments.",
                1: "A disgusted expression may include a wrinkled nose, raised upper lip, raised cheek and furrowed or raised eyebrows. It is a response associated with things that are unsanitary or offending. This is undesirable for a formal situation and must be contained.",
                2: "The biggest indicator of fear is widened eyes, with the lower eyelids tense as the upper eyelids are raised. Their eyebrows will be raised and pulled together, while the corners of the mouth are stretched and pulled back. Excessive swallowing is also an indicator a person is feeling fearful. Fear is associated with a lack of confidence, being caught doing something a person should not have been doing or feeling threatened in general.",
                3: "A happy expression may include crow's feet wrinkles, raised mouth corners, pushed up cheeks and movement from the muscle that orbits the eye. Happiness on the face is intrinsically positive and is often associated with a state of mind that reflects contentment, satisfaction, pleasure or joy. It also reflects confidence and calm.",
                4: "Sadness is an emotion that is often associated with feelings of disadvantage, loss, and helplessness. Sadness is characterized by a facial expression that causes someone to lower the corners of their mouth, raise the inner portion of their brows, drooping upper eyelids and lose focus in the eyes.",
                5: "Surprise is an instinctual response, as humans are hard-wired to be alert at all times. This emotion always occurs fast, as someone responds to a stimulus that is exciting, novel or unexpected. Although it occurs only briefly, it is very clear. Their mouth will drop, and open, as their eyebrows are raised. Eyes widening are also a sign of surprise, and the entire emotion flicks past in about 1/5th of a second. If it lasts longer than this, it’s a good indication the emotion is being exaggerated or faked entirely.",
                6: "A neutral expression is characterized by an expressionless face with muscles. It reflects stability and confidence. However, if one or both corners of the lip are tightened, the expression may be likened to that of contempt. The microexpressions define the thoughts behind the expression."
            }
            var maxface=[],mm=[];
                for(i=0;i<f.length;i++)
                {
                    arr=f[i];
                    first=Math.max.apply(null, arr)
                    maxione = arr.indexOf(first);
                    second= this.secondMax(arr);
                    maxitwo=arr.indexOf(second);
                    fs.push(findface[maxione]+findface[maxitwo]);
                    mm.push(maxione);
                }
                var breaks= this.state.breaks;
                ll=[]
                j=0
                for(i=0;i<breaks.length;i++)
                {
                    x=breaks[i];
                    l=0;
                    var a=0;
                    for(;j<x;j++)
                    {
                        l=l+fs[j];
                        a=a+1;
                    }
                    maxface.push(maxfaceDict[mm[j-1]])
                    ll.push(""+l+" / "+(a*15));

                    j=x;
                    
                }
                this.setState({maxface:maxface});
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
                    s="Confidence and Certainity scores range: [-1,1] \nFER: "+fs[i]+"\nSER: "+ss[i]+"\nConfidence: "+confs[i]+"\nCertainity: "+certs[i];
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
    var speechtext=JSON.parse(localStorage.getItem("speechtext")).speechtext;
    this.setState({
        speechtext:speechtext
    });
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
                        const x=data.response;
                        console.log("legth",Object.keys(x));
                        var xyz=Object.keys(x);
                        var chatques=[],chatexp=[],chatact=[],chatdif=[],chatscore=[],chatbot=[]
                        for (var i=0;i<Object.keys(x).length;i++)
                        {
                            console.log("ttjukjn xghfevrv...",Object.keys(x).length)
                            console.log(x[xyz[i]].ques);
                            chatques.push(x[xyz[i]].ques);
                            chatexp.push(x[xyz[i]].exp);
                            chatact.push(x[xyz[i]].act);
                            chatdif.push(x[xyz[i]].dif);
                            chatscore.push(""+x[xyz[i]].score+" / "+(10*x[xyz[i]].dif));
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
    maxface,
    faceset,sentianswer,
    speechtext,
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
                                                <th>Question/Your Answer</th>
                                                <th>FacialExpressions</th>
                                                <th>Your FER Scores</th>
                                                <th>Your SER/Sentiment Scores</th>
                                                <th>overall score for question</th>
                                            </tr>
                                            {quesans1.map((value,key)=>{
                                                // console.log("i m going bananas ",value,key);
                                                const emoImageArray = FERS[key];
                                                const emoChartArray = options[key];
                                                const sValueArray = showquesscore[key].split('\n');
                                                return (
                                                    <tr className="emoanalysisRow" key ={key}>
                                                        <td>
                                                            <span>{value['question']}</span>
                                                            <hr/>
                                                            <p>{this.state.speechtext[key]}</p>
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
                                                                <span style={{
                                                                display:"flex",
                                                            flexDirection:"column"}}>{val}</span>
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
                              <p className="description-para"> Attitude can be defined as a response to people, places, things, or events in life. It can be referred to as a person's viewpoint, mindset or beliefs. A person's attitude towards people, places, things, or situations determines the choices that the person make.</p>

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
                                                        <td className="scoreTableCellsenti">
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
                      <div className="card9" >
                          <div className="card-body9">
                              <h4 className="card-title9">Overview</h4>
                                <div className="card-text9">
                                    <div>
                                        <p style={{color: "red"}}> <b>Image Based Sentiment Meaning</b></p>
                                        <p style={{marginBottom:"5px"}}><b>Positive attitude or thinking</b> reflects a healthy way of looking at things and the ability to work past hurdles with a healthy mindset. The associated traits are confidence, cheerfulness, flexibility, determination, and tolerance. On the other hand, an overly positive response to everything may lead to optimism bias, refusal to face reality and lack of realism in approaching situations.</p>

                                        <p style={{marginBottom:"5px"}}>While <b>negative thinking or attitude</b>, in a lot of contexts, reflects pessimism, frustration, resentment, anger and doubt, it is also a trait of people who believe that failure is also a probable possibility and thus, perform risk management. People in negative mood are also shown to produce better quality and persuasive arguments.</p>

                                        <p style={{marginBottom:"5px"}}><b>Neutral attitude</b> is a reflection of complacency, indifference or a possibly healthy combination of positive and negative. It may also show a lack of opinion about a person, object or event.</p>
                                    </div>
                                    <hr/>
                                    <div>
                                        <p style={{color: "red"}}> <b>What Emotion Recognition Say Based on Your Facial Expressions and Speech</b></p>
                                        <p style={{marginBottom:"5px"}}><b>Happy:</b>A happy expression may include crow's feet wrinkles, raised mouth corners, pushed up cheeks and movement from the muscle that orbits the eye. Happiness on the face is intrinsically positive and is often associated with a state of mind that reflects contentment, satisfaction, pleasure or joy. It also reflects confidence and calm.</p>

                                        <p style={{marginBottom:"5px"}}><b>Neutral:</b>A neutral expression is characterized by an expressionless face with muscles. It reflects stability and confidence. However, if one or both corners of the lip are tightened, the expression may be likened to that of contempt. The microexpressions define the thoughts behind the expression.</p>

                                        <p style={{marginBottom:"5px"}}><b>Disgust:</b>A disgusted expression may include a wrinkled nose, raised upper lip, raised cheek and furrowed or raised eyebrows. It is a response associated with things that are unsanitary or offending. This is undesirable for a formal situation and must be contained.</p>
                                        
                                        <p style={{marginBottom:"5px"}}><b>Surprise:</b>Surprise is an instinctual response, as humans are hard-wired to be alert at all times. This emotion always occurs fast, as someone responds to a stimulus that is exciting, novel or unexpected. Although it occurs only briefly, it is very clear. Their mouth will drop, and open, as their eyebrows are raised. Eyes widening are also a sign of surprise, and the entire emotion flicks past in about 1/5th of a second. If it lasts longer than this, it’s a good indication the emotion is being exaggerated or faked entirely.</p>

                                        <p style={{marginBottom:"5px"}}><b>Anger:</b>An angry expression includes eyebrows down and together, glaring or bulging eyes and narrowed lips. It is often related to a response within the range of minor irritation to intense rage. Anger is associated with the fight or flight brain response when a person is introduced to an experience that causes them to feel threatened or in pain. An easily angered person is considered unstable and prone to quick reactions and judgments.</p>

                                        <p style={{marginBottom:"5px"}}><b>Fear:</b>The biggest indicator of fear is widened eyes, with the lower eyelids tense as the upper eyelids are raised. Their eyebrows will be raised and pulled together, while the corners of the mouth are stretched and pulled back. Excessive swallowing is also an indicator a person is feeling fearful. Fear is associated with a lack of confidence, being caught doing something a person should not have been doing or feeling threatened in general.</p>
                                        
                                        <p style={{marginBottom:"5px"}}><b>Sadness:</b>Sadness is an emotion that is often associated with feelings of disadvantage, loss, and helplessness. Sadness is characterized by a facial expression that causes someone to lower the corners of their mouth, raise the inner portion of their brows, drooping upper eyelids and lose focus in the eyes.</p>

                                    </div>
                                    <hr/>
                                    <div className="row"></div>
                                        <div className="col">
                                        <p style={{color: "red"}}> <b>Confident and Unconfident words that gives scores between [-1,1]</b></p>
                                        <p style={{marginBottom:"5px"}}><b>Confident 1 gram words  : </b>absolute, absolutely, affirm, affirmative, affirmed, aim, assert, assertive, assure, assured, assuredly, belief, believe, believed, believing, bold, boldly, calm, can, capable, certain, certainly, certainty, clear, clearly, collected, completely, concluded, conclusive, conclusively, confidence, confident, confidently, conviction, convinced, courage, decide, decided, decidedly, decisive, decisively, definite, definitely, determined, determinedly, direct, directly, doubtless, doubtlessly, downright, ease, easily, easy, encouraged, entrust, faith, fearless, firm, firmly, happy, heartily, unwavering, hopeful, immediately, indisputably, instantly, know, literally, opine, opinion, optimistic, optimistically, outright, particular, particularly, passion, perfect, perfectly, persuade, persuasive, positive, positively, power, questionless, questionlessly, really, resolve, resolved, satisfied, simply, specific, specifically, strength, sure, surely, therefore, thorough, thoroughly, together, undaunted, undeniable, undeniably, undoubtedly, unquestionably, want, will, yeah, yes</p>

                                        <p style={{marginBottom  :"5px"}}><b>Confident 2 gram words  : </b>beyond doubt, by myself, certain belief, certain of, complete confidence, confident of, count on, counted on, counting on, feel certain, feel sure, firm belief, firmly convinced, for certain, for sure, full confidence, fully confident, fully convinced, give confidence, great confidence, great faith, have faith, have trust, high hopes, of course, rest assured, strong belief, strong opinion, strongly believe, sure about, sure thing, with conviction, without doubt</p>

                                        <p style={{marginBottom  :"5px"}}><b>Confident 3 gram words  : </b>can be confident, have no doubt, have confidence in, in the belief, know about that, know for certain, lot of confidence, lot of faith, put faith in, sure of it, sure of that, without a doubt, you got to, you have to</p>

                                        <p style={{marginBottom  :"5px"}}><b>Unconfident 1 gram words  : </b>actual, actually, allegedly, anxiety, anxious, apparently, attempt, bewildered, bother, concern, confused, could, dazed, difficulty, dilemma, doubtful, dubious, fear, guess, guesswork, hesitant, hopefully, hunch, impossible, indecisive, lack, likely, literally, lose, loss, lost, may, misgiving, puzzle, shy, so, still, suspect, suspicion, suspicious, tiresome, um, uncertain, uneasiness, uneasy, unnerving, unpredictable, usually, waver, well, wonder, worried, worrisome, worry, worrying, difficult, disbelief, fail, falter, maybe, mildly, mistrust, need, no, notion, often, perhaps, possibly, quandary, sense, try, quit, sensed, surprised, think, tired, tiring, trouble</p>

                                        <p style={{marginBottom  :"5px"}}><b>Unconfident 2 gram words  : </b>am afraid, cannot decide, funny feeling, give up, good enough, good luck, gut feeling, hang back, i cannot, i think, if only, it appears, it seems, just luck, kind of, little bit, little credit, little faith, mixed up, sort of, what if, not sure, not certain, got lucky, hope to, i feel, i just, no expert, not possible, sneaking suspicion, doubt that</p>

                                        <p style={{marginBottom  :"5px"}}><b>Unconfident 3 gram words  : </b>do you mind, hard to say, it looks like, would you mind, not too sure, not very sure, not very certain, of the impression, not too certain, do not think, if it is, like i said, would it be, do not know, not so sure, not too certain, not so certain</p>

                                        </div>
                                        <hr/>
                                        <div className="col">
                                        <p style={{color: "red"}}> <b>Certain and Uncertain words that gives scores between [-1,1]</b></p>
                                        <p style={{marginBottom:"5px"}}><b>Certain 1 gram words  : </b>absolutely, am, believe, can, cannot, certain, certainly, certainty, clear, clearly, could, decide, determine, doubtless, doubtlessly, obvious, obviously, ought, realise, should, undoubtedly, would, are, is, know, must, never, sure, surely, was, were, will, definitely, definite, positive</p>

                                        <p style={{marginBottom  : "5px"}}><b>Certain 2 gram words  : </b>beyond doubt, certain belief, very sure, want to, will have, certain of, have to, need to, quite sure, no doubt, should have, quite certain, very certain, must be, will be, should be, would be</p>

                                        <p style={{marginBottom  : "5px"}}><b>Certain 3 gram words  : </b>must have to, will have to, without a doubt, would have to, ought to have, should have to, ought to be</p>

                                        <p style={{marginBottom  : "5px"}}><b>Uncertain 1 gram words  : </b>allegedly, apparently, assume, doubt, doubtful, doubtfully, guess, imagine, may, maybe, might, perchance, presume, presuppose, probable, reckon, suppose, supposedly, surmise, uncertain, possible, possibly, probably, seems, unlikely, unsure, shall, think, likely, seemingly, presumably</p>

                                        <p style={{marginBottom  : "5px"}}><b>Uncertain 2 gram words  : </b>can have, could have, it appears, may have, not definite, shall have, would have, cannot decide, might have, must have, it seems, not certain, not decide, not sure, can be, could be, may be, might be, shall be</p>

                                        <p style={{marginBottom  : "5px"}}><b>Uncertain 3 gram words  : </b>could have to, may have to, shall have to, not too sure, as far as, not too certain, not very sure, might have to, not very certain, not so sure, not so certain</p>

                                        </div>
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