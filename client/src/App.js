import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import less from 'less';

import io from 'socket.io-client'
let socket = io(`http://ec2-52-28-6-186.eu-central-1.compute.amazonaws.com:3004`)

class App extends Component {
  constructor() {
    super();

    socket.on(`news`, data => {
      console.log(data);
      console.log('from socket');
    })

    socket.on(`css`, data => {
      console.log(data);
      console.log('from socket css');
    })

    this.state = {
      inputCSS: `
body {
    background-color: linen;
}

h1 {
    color: maroon;
    margin-left: 40px;
} `,
      inputHTML: `<div>
        you can start here
</div>`,
      outputCSS: ''
    };
  }

  onBlur (event) {
     console.log(event.target.value);
     this.tryToCompile(event.target.value);
  }

  onBlurHtml (event) {
     this.sendInfoHtml(event.target.value);
  }

  handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      this.tryToCompile(event.target.value);
    }
  }

  tryToCompile(css) {
    try {
      less.render(css, (e, output) => {
        this.setState({
          outputCSS: output.css
        });
        this.sendInfo(output.css);
      });
    } catch (e) {
      console.log('less isnt valid');
    }
  }

  sendInfoHtml(html) {
    fetch("http://ec2-52-28-6-186.eu-central-1.compute.amazonaws.com:3004/api/html", {
      method: "POST",
      body: html
    }).then(res => console.log(res));
  }

  sendInfo(css) {
    fetch("http://ec2-52-28-6-186.eu-central-1.compute.amazonaws.com:3004/api/compile", {
      method: "POST",
      body: css
    }).then(res => console.log(res));;
  }
  // <style>{this.state.outputCSS}</style>
  render() {
    const jStyle = {
      width: '100%',
      height: '200px'
    };
    return (
      <div className="App">
        <textarea style={jStyle}
            onBlur={this.onBlur.bind(this)}
            onKeyPress={this.handleKeyPress}
        >
        {this.state.inputCSS}
        </textarea>

        <textarea style={jStyle}
            onBlur={this.onBlurHtml.bind(this)}
            onKeyPress={this.handleKeyPressHtml}
        >
        {this.state.inputHTML}
        </textarea>

        <pre>{this.state.outputCSS}</pre>
      </div>
    );
  }
}

export default App;
