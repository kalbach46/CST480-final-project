import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Deck from './Pages/Deck';
import Game from './Pages/Game';
import Register from './Pages/Register';
import {AppBar, Button, Toolbar} from '@mui/material';
import './App.css';

function App() {
  return (
    <div>
      <AppBar position="sticky" style={{marginBottom:'20px', background: '#f0f0f0'}}>
        <Toolbar>
          <Button href="/">Login</Button>
          <Button href="/home">Home</Button>
          <Button href="/deck">Deck</Button>
          <Button href="/game">Play</Button>
        </Toolbar>
      </AppBar>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />       
            <Route path="/home" element={<Home />} />       
            <Route path="/deck" element={<Deck />} />
            <Route path="/game" element={<Game />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </div>  
  );
}

export default App;
