import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './Routes';
import './App.css';

const logo = require('./logo.svg');

export class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
          <Routes />
        </div>
      </BrowserRouter>
    );
  }
}
