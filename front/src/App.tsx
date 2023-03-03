import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useEffect, useState} from 'react';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Deck from './Pages/Deck';
import Game from './Pages/Game';
import Register from './Pages/Register';
import './App.css';
import Cookies from 'js-cookie';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if(Cookies.get("loggedIn")==='true'){
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn])

  return (
    <div>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={loggedIn ? <Home/> : <Login setLoggedInState={(state:boolean) => setLoggedIn(state)}/>} />       
            <Route path="/deck" element={loggedIn ? <Deck/> : <Login setLoggedInState={(state:boolean) => setLoggedIn(state)}/>} />
            <Route path="/game" element={loggedIn ? <Game/> : <Login setLoggedInState={(state:boolean) => setLoggedIn(state)}/>} />
            <Route path="/login" element={<Login setLoggedInState={(state:boolean) => setLoggedIn(state)}/>} />       
            <Route path="/register" element={<Register/>} />
          </Routes>
        </div>
      </Router>
    </div>  
  );
}

export default App;
