import * as React from 'react';
import './App.css';

const logo = require('./logo.svg');

const Foo = () => (
  <>
    <span>a</span>
    <span>b</span>
  </>
);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Reat</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Foo />
      </div>
    );
  }
}

export default App;
