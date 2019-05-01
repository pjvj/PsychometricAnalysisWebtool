import React, { Component } from 'react';
import CreateTest from "./CreateTest";
import GiveTest from "./GiveTest";
import ViewReport from "./ViewReport";
import Home from "./Home";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        tests:[]
    };
    
}
getTests=()=>{
        
  fetch("http://localhost:8889/getTests",
      {
          method: 'post',
          headers: new Headers({'content-type': 'application/json'}),
          "withCredentials":true,
          "mode":"cors",
      }).then(response => {  
      return response.json();
  }).then((res)=>{
    console.log(res);
    this.setState({
        tests:res
    });
}).catch((error)=>{

  });
}
  render() {
    return (
      <HashRouter>
      <div>
          <h1>Psychometric Analysis Tool</h1>
          <ul className="header">
            <li><NavLink exact to="/">Home</NavLink></li>
            <li><NavLink to="/CreateTest">CreateTest</NavLink></li>
            <li><NavLink to="/GiveTest" onClick={this.getTests}>GiveTest</NavLink></li>
            <li><NavLink to="/ViewReport" >ViewReport</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" component={Home}/>
            <Route path="/CreateTest" component={CreateTest}/>
            <Route path="/GiveTest" render={(props) => <GiveTest initialData ={this.state.tests}/>} />
            <Route path="/ViewReport" component={ViewReport}/>
          </div>
      </div>
      </HashRouter>
    );
  }
}

export default App;
