import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import less from 'less';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/css';
import 'brace/theme/github';

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
    background-color: blue;
    color: white;
}

h1 {
    margin-top: 40px;
    color: white;
} `,
      inputHTML: `<div>
  Hello World
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

  onChange (newValue) {
    console.log(newValue)
    this.tryToCompile(newValue);
  }

  onChangeHTML (value) {
    this.sendInfoHtml(value);
  }


  handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      this.tryToCompile(event.target.value);
    }
  }

  tryToCompile(css) {
    console.log('try to compile')
    console.log(css)
    try {
      less.render(css, (e, output) => {
        // this.setState({
        //   outputCSS: output.css
        // });
        this.sendInfo(output.css);
      });
    } catch (e) {
      console.log(e)
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

        <AceEditor
        height="300px"
        width="800px"
         mode="css"
         theme="github"
         onChange={this.onChange.bind(this)}
         name="CSSDIV"
         defaultValue={this.state.inputCSS}
         editorProps={{$blockScrolling: true}}
        />

      <br />
      <br />
      {' '} {' ---------- '}{' '}
      {' '}
      <br />
      <br /><br />


        <AceEditor
          height="300px"
          width="800px"
         mode="html"
         theme="github"
         onChange={this.onChangeHTML.bind(this)}
         name="HTMLDIV"
         defaultValue={this.state.inputHTML}
         editorProps={{$blockScrolling: true}}
        />


        <pre>{this.state.outputCSS}</pre>
      </div>
    );
  }
}

export default App;
