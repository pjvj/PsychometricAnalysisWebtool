import React,{Component} from 'react';
import {Image} from 'react-bootstrap';

const axios = require("axios");

export default class CreateTest extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            phase1:[{question:"",answer:""}],
            images:[],
            phase3:[{question:"",answer:"",difficulty:""}],
        }
    }
    handleChange=(e)=>{
        console.log(e.target.name);
        
        let phase  = this.state.phase1;
        let name = e.target.name;
        let ph = this.state.phase3;
        if(name.split('question').length>1)
        {
            let index = parseInt(name.split('question')[1]);
            phase[index].question=e.target.value;
            
        }
        else if(name.split('answer').length>1)
        {
            let index = parseInt(name.split('answer')[1]);
            phase[index].answer=e.target.value;
            
        }else if(name.split('phq').length>1)
        {
            let index = parseInt(name.split('phq')[1]);
            ph[index].question=e.target.value;
            
        }
        else if(name.split('pha').length>1)
        {
            let index = parseInt(name.split('pha')[1]);
            ph[index].answer=e.target.value;
            
        }
        else if(name.split('difficulty').length>1)
        {
            let index = parseInt(name.split('difficulty')[1]);
            ph[index].difficulty=e.target.value;
            
        }
        else if(name.split("php").length>1)
        {
            ph.push({question:'',answer:'',difficulty:''});
           
        }
        else if(name.split('phd').length>1)
        {
            let index = parseInt(name.split('phd')[1]);
            ph.splice(index,1);
            
        }
        else if(name.split("add").length>1)
        {
            phase.push({question:'',answer:''});
           
        }
        else if(name.split('delete').length>1)
        {
            let index = parseInt(name.split('delete')[1]);
            phase.splice(index,1);
            
        }
        this.setState({
            phase1:phase,
            phase3: ph
        });
        
    }
    uploadFile = (e)=>{
        const files = Array.from(e.target.files);
        console.log(files);
        let images = this.state.images;
        console.log(images);
        images.push(...files);
        console.log(images);
        this.setState({
            images:images
        });
       
    }
    uploadQuesAns=(e)=>{
        let data={ 
            data1:this.state.phase1,
            data2:this.state.phase3,
        };
        
        console.log(data);
        console.log(this.state.phase1);
        var config = {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        var   testname= document.getElementById("testname").value;
        axios.post(`http://localhost:8889/uploadtest/${testname}`,data,config)
            .then((response) => {
                console.log("The test is successfully uploaded");
            }).catch((error) => {
        });
        data  = new FormData();
        var files= this.state.images;
        for(let k=0;k<files.length;k++)
        {
            data.append('imgUploader',files[k]);
        }
        config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },   
        };
        axios.post(`http://localhost:8889/upload/${testname}`,data,config)
            .then((response) => {
                alert("The test is successfully uploaded");
            }).catch((error) => {
        });

    }
    render()
    {
        return(
        
        <div >
            
            <div className="testcred">
            <input className="testinput" id="testname" placeholder="Test Name"></input>
            </div>
            <div className="test1" style={{    backgroundColor: "lightblue"}}>
                <p style={{fontFamily: "Consolas",fontSize:"30px"}}>
                You can add question and their expected answer for the first phase of test here.</p>
            <button className="addbutton" name="add" onClick={this.handleChange}>Add Row</button>
            <table className="tableques">
                <tbody>
                {this.state.phase1.map((value,key)=>{
                    return (
                    <tr key ={key}>
                        <td ><input  className="quesans" name={"question"+key} placeholder="Question" value={value.question} onChange={this.handleChange} /></td>
                        <td ><input  className="quesans" name={"answer"+key} placeholder="Answer" value ={value.answer} onChange={this.handleChange}/></td>
                        <td><button className="deletebutton" name={"delete"+key} onClick={this.handleChange}>Delete</button></td>
                    </tr>)
                })}
                </tbody>
            </table>
            </div>
            <div className="test2" style={{ backgroundColor: "moccasin"}}>
            <p style={{fontFamily: "Consolas", fontSize:"30px"}}>
            You can add images for the second phase of test here.</p>
            <input className="addbutton" type="file" name="imgUploader"  onChange={this.uploadFile} multiple/>
            </div>
            {this.state.images&&this.state.images.length>0
            &&this.state.images.map((value,key)=>{
                return (<Image key={key+1} style={{
                    width:"50px",
                    height:"50px"
                }}src={URL.createObjectURL(value)} name={"img"+key} roundedCircle />)
            })}
            <div className="test1" style={{    backgroundColor: "lightblue"}}>
                <p style={{fontFamily: "Consolas",fontSize:"30px"}}>
                You can add question, their expected answer and difficulty for the third phase of test here.</p>
            <button className="addbutton" name="php" onClick={this.handleChange}>Add Row</button>
            <table className="tableques">
                <tbody>
                {this.state.phase3.map((value,key)=>{
                    return (
                    <tr key ={key}>
                        <td ><input  className="quesans" name={"phq"+key} placeholder="Question" value={value.question} onChange={this.handleChange} /></td>
                        <td ><input  className="quesans" name={"pha"+key} placeholder="Answer" value ={value.answer} onChange={this.handleChange}/></td>
                        <td ><input  className="difficulty" name={"difficulty"+key} placeholder="Difficulty" value ={value.difficulty} onChange={this.handleChange}/></td>
                        <td><button className="deletebutton" name={"phd"+key} onClick={this.handleChange}>Delete</button></td>
                    </tr>)
                })}
                </tbody>
            </table>
            </div>
            <div className="submitdiv">
            <button className="addbutton" name="Submittest" onClick={this.uploadQuesAns}>Submit test</button>
            </div>
        </div>);
    }

}