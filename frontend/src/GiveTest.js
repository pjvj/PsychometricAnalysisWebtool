import React,{Component} from 'react';
import './givetest.css';
import Phase1 from "./Phase1.js";
import Phase2 from "./Phase2.js";
import Phase3 from "./Phase3.js";
const axios = require("axios");

export default class GiveTest extends Component{
    constructor(props) {
        super(props);
        this.state={
            one:false,
            two:false,
            three:false,
            alltests:[],
            images:[],
            quesans1:[],
            quesans3:[],
            showtest: 0,
            test:"",
            showselect: true
        }
    }
    
    componentWillReceiveProps(nextProps,prevProps)
    {
        console.log("idhar",prevProps.initialData,nextProps.initialData)
        if(prevProps!==nextProps&&nextProps.initialData.length>0)
        {
            this.setState({
                alltests: nextProps.initialData[0]
            });
        }
    }

    // handleChange=(e)=>{
    //     console.log(e.target.name);
    //     let test  = this.state.test;
    //     let name = e.target.name;
    //     if(name.split('testtogive').length>1)
    //     {
    //         test=e.target.value;
    //         this.setState({
    //             test:test
    //         });
    //         console.log("changing name",this.state.test);
    //     }
    //     else
    //     if(name.split('testadmin').length>1)
    //     {
    //         admin=e.target.value;
    //         this.setState({
    //             admin:admin
    //         });
    //     }
    // }  
    
    findTests=()=>{
        var testname=this.state.test;
        localStorage.setItem("testname", JSON.stringify({"testname":testname}));
        this.setState({
            showselect: false,
            showtest:1
        });
        // const config = {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
            
        // };
        axios.get(`http://localhost:8889/findtest1/${testname}`)
            .then((response) => {
                console.log(response.data.response);
                this.setState({
                    quesans1:response.data.response
                });
                if(this.state.quesans1.length>0)
                {
                    this.setState({
                        showtest: 1
                    });
                }
                //alert("The findtest is successful");
            }).catch((error) => {
        });
        axios.get(`http://localhost:8889/findtest3/${testname}`)
            .then((response) => {
                console.log(response.data.response);
                this.setState({
                    quesans3:response.data.response
                });
                if(this.state.quesans3.length>0)
                {
                    this.setState({
                        showtest: 1
                    });
                }
                console.log("third phase m hum aae",this.state.quesans3);
                //alert("The findtest is successful");
            }).catch((error) => {
        });

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
                if(this.state.images.length>0)
                {
                    this.setState({
                        showtest: 1
                    });
                }
                //console.log("state image",this.state.images);
                
            }).catch((error) => {
        });

    }
doSomething=(evt, type)=>{
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(type).style.display = "block";
    evt.currentTarget.className += " active";
}
one=(event)=>{
    this.setState({
        one:true
    });
    this.doSomething(event,'one');
}    
two=(event)=>{
    this.setState({
        two:true
    });
    this.doSomething(event,'two');
}
three=(event)=>{

    this.setState({
        three:true
    });
    console.log("third phase m ",this.state.quesans3);
    this.doSomething(event,'three');
}

    render() {
        console.log("hum aae",this.state.quesans3);
        return(
        <div>
            <div className="hideselect">
            { this.state.showselect ?
                ((this.props.initialData&&this.props.initialData.length>0)?(
                    <div>
                    <select className="selecttest" onChange={(e)=>{this.setState({
                        test:e.target.value
                    })}}>
                        {this.props.initialData.map((value,key)=>{
                            return (<option key={key}>{value}</option>)
                        })}
                    </select>
            <button className="addbutton" name="gototest" onClick={this.findTests}>Go to test</button>
            </div>):(<select>
                <option>No test Found</option>
            </select>)
            ):null}
            </div>
            <div>
            {
                    (this.state.showtest===1)?(
                <div>
                    <div className="tab">
                        <button className="tablinks" eventkey={1} onClick={this.one} >Phase1</button>
                                                
                        <button className="tablinks" eventkey={2} onClick={this.two}>Phase2</button>
                        
                        <button className="tablinks" eventkey={3} onClick={this.three}>Phase3</button>
                    </div>
                        <div id="one" className="tabcontent" >
                            {this.state.one&&(<Phase1 quesans1={this.state.quesans1 }/> )}
                        </div>  
                        <div id="two" className="tabcontent" >
                            {this.state.two&&( <Phase2 images={this.state.images}/>)}
                        </div>  
                        <div id="three" className="tabcontent">
                            {this.state.three&&(<Phase3 quesans3={this.state.quesans3 }/>)}
                        </div>  
                </div>):null}
            </div>
            {/* <div>
                {
                    (this.state.showtest==1)?(<div> <Test    testname={this.state.test} /></div>):
                    (<div></div>) 
                }
            </div> */}
        
        
        </div>
        );
    }
}