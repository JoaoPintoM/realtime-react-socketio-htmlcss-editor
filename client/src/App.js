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
}

body > div
{
  width:100px;
  height:100px;
  background:#676470;
  transition:all 0.3s ease;
  margin:auto;
  margin-top: 50px;
  padding-top: 60px;
}
`,
      inputHTML: `
<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <div> Simple as fuck </div>
</body>
</html>
`,
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

    const leftStyle = {
      float: 'left',
      width: '50%'
    }

    return (
      <div className="App">

    <div className="left" style={leftStyle}>
        <AceEditor
        height="800px"
        width="100%"
         mode="css"
         theme="github"
         onChange={this.onChange.bind(this)}
         name="CSSDIV"
         defaultValue={this.state.inputCSS}
         editorProps={{$blockScrolling: true}}
        />
    </div>

    <div className="right">
      <AceEditor
        height="800px"
        width="50%"
       mode="html"
       theme="github"
       onChange={this.onChangeHTML.bind(this)}
       name="HTMLDIV"
       defaultValue={this.state.inputHTML}
       editorProps={{$blockScrolling: true}}
      />
    </div>

        <pre>{this.state.outputCSS}</pre>
      </div>
    );
  }
}

export default App;
