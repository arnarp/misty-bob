import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './Routes';
import './App.css';

export class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <>
          <Routes />
        </>
      </BrowserRouter>
    );
  }
}
