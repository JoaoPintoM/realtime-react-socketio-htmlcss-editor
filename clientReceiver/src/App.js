import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client'
let socket = io(`http://ec2-52-28-6-186.eu-central-1.compute.amazonaws.com:3004`)

class App extends Component {
  constructor() {
    super();

    this.state = {
      css: '',
      html: '',
    };

    socket.on(`css`, data => {
      this.setState({
        css: data
      });
    })

    socket.on(`html`, data => {
      this.setState({
        html: data
      });
    })
}
  render() {
    return (
      <div className="App">
        <style>{this.state.css}</style>
        <div dangerouslySetInnerHTML={{__html: this.state.html}} ></div>
      </div>
    );
  }
}

export default App;
