import React,{Component} from 'react';
import './phase2.css';
// const axios = require("axios");


export default class Phase2 extends Component{
    constructor(props) {
        super(props);
        this.state={
           
            images:[],
            imgid:0,
            showtest: 0,
            test:"",
            showselect: true
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.images!==prevState.images){
          return { images: nextProps.images};
       }
       else return null;
     }
    // componentDidUpdate(prevProps, prevState) {
    //     if(prevProps.someValue!==this.props.someValue){
    //       //Perform some operation here
    //       this.setState({someState: someValue});
        
    //     }
    //   }

    // componentWillReceiveProps(nextProps,prevProps)
    // {
    //     console.log("idhar",prevProps.images,nextProps.images);
    //     if(prevProps!==nextProps&&nextProps.images.length>0)
    //     {
    //         this.setState({
    //             images:nextProps.images
    //         });

    //     }
        
    // }

    submitDescription=()=>{
        console.log("submit description k ander",this.state.sentians);
        var answer=this.state.sentians;
        var i= this.state.imgid;
        var ans= "answer"+i;
        var json={}
        json[ans]=answer;
        fetch("http://localhost:8889/saveSentimentAnswer/",
        {
            method: 'post',
            headers: new Headers({'content-type': 'application/json'}),
            "withCredentials":true,
            "mode":"cors",
            body: JSON.stringify(
                json)
            }).then(response=>{
                console.log("ye raha response",response);
            console.log("save ho gaya");
        }).catch(err=>{
            console.log("ye ri err",err);
        })
        
    }
    handleImages=(e)=>{
        let name = e.target.name;
        let ii=this.state.imgid;
        let il=this.state.images.length;
        if(name==='imgprevious')
        {
            if(ii===0)ii=il-1;
            else ii-=1;
            this.setState({
                imgid:ii
            });
        }
        else if(name==='imgnext')
        {
            if(ii===il-1)ii=0;
            else ii+=1;
            this.setState({
                imgid:ii
            });
        }
    }
    handleChangeAnswer=(e)=>{
        let name = e.target.name;
        let test=this.state.sentians;
        if(name.split('sentianswer').length>1)
        {
            test=e.target.value;
            this.setState({
                sentians:test
            });
            //console.log("changing name",this.state.sentians);
        }
        
    }
    render(){
        return(
            <div className="row">
                <div className="flex">
                    <div className="card2">
                        <div className="card-body2">
                            <h4 className="card-title2">Describe Me</h4>
                            <p className="card-text2">You can navigate through images using previous and next buttons</p>
                            <img className="imagesenti" alt="yo" name={"image"+this.state.imgid}  id={"image"+this.state.imgid} src={URL.createObjectURL(this.state.images[this.state.imgid])}/>
                            <div className="queschangerow">
                                <button className="changeimgp" name="imgprevious" onClick={this.handleImages}>Previous</button>
                                <button className="changeimgn" name="imgnext" onClick={this.handleImages}>Next</button>
                            </div>
                        </div>
                    </div>
                        <div className="card2">
                            <div className="card-body2">
                                <h4 className="card-title2">Perception Check</h4>
                                <p className="card-text2">Write a description of the image you see in 10-50 words. </p>
                                <div className="row">
                                    <textarea type="text" className="sentians" id={"sentianswer"+this.state.imgid} style={{
                                        width: "-webkit-fill-available",
                                        height: "365px",
                                        fontSize: "large",
                                        padding:"5px",
                                        fontFamily: "fantasy"
                                    }}
                                    name={"sentianswer"+this.state.imgid} onChange={this.handleChangeAnswer} placeholder="Answer"/>
                                    <button className="addbutton" onClick={this.submitDescription}>SubmitAnswer</button> 
                                </div>
                                {/* <div>
                                    {(this.state.showsentimentscore)&&
                                        <textarea className="imagescore" style={{
                                            display: "table",
                                            width: "-webkit-fill-available",
                                            height: "80px",
                                            marginTop: "15px",
                                            fontSize: "medium",
                                            fontFamily: "monospace"
                                        }}
                                        name={"iscore"+this.state.imgid} placeholder="Score" value ={this.state.sentimentvalue}/>
                                    } 
                                </div> */}
                                {/* <div className="row" style={{
                                        position:"absolute",
                                        right:"47px",
                                        bottom:"41px"
                                    }}>
                                    < button className="addbutton" onClick={this.secondPhase}>Finish Test</button>  
                                </div> */}
                            </div>
                        </div>
                </div>
            </div>
        )
    }
}