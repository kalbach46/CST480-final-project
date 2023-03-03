import Cookies from 'js-cookie';

export default function Game() {
    return (
        <div>
            {Cookies.get('loggedIn')==='true'?
           <p>GAME</p>
           : <a href='/'>Login</a>}
        </div>
    )
}