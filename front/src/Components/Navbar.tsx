import {useEffect, useState} from 'react';
import {useNavigate, NavigateFunction} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {AppBar, Button, Toolbar, Box} from '@mui/material';

export default function Navbar(){
    const [currentUser, setCurrentUser] = useState<string>('');
    let navigate:NavigateFunction = useNavigate();

    function handleLogout(){
        Cookies.set("loggedIn", "false");
        navigate('/login');
    }

    useEffect(() => {
      const getCurrentUser = async () => {
        axios.get('/api/accountManager/user')
        .then((result) => {
          setCurrentUser(result.data.username)
        })
      };
      getCurrentUser();
    }, [])

    return (
    <AppBar position="sticky" style={{marginBottom:'20px', background: '#d3d3d3'}}>
        <Toolbar>
        <Box display='flex' flexGrow={1}>
            <Button href="/">Home</Button>
            <Button href="/deck">Deck</Button>
            <Button href="/game">Play</Button>
        </Box>
        {currentUser==''?
        <Button href="/login">Login</Button>:
        <div style={{color:"blue"}}>
            {currentUser}
            <Button onClick={() => {handleLogout()}}>Logout</Button>
        </div>
        }
        </Toolbar>
    </AppBar>
    )
}