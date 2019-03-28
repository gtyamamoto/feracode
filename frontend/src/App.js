import React, { Component } from 'react';

class App extends Component {
  state = {
    message:''
  }
  componentDidMount =  async ()=>{
    const fetchserver = await fetch('/api');
    this.setState({message: await fetchserver.text()})
  }
  render() {
    return (
      <div className="container">
      <h3 className="p-3 my-2">Diapers List</h3>
        <div className="row text-center">
        <p>Test</p>
        </div>
      </div>
    );
  }
}

export default App;
