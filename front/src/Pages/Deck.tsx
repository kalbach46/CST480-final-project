import Cookies from 'js-cookie';

export default function Deck() {
    return (
        <div>
            {Cookies.get('loggedIn')==='true'?
           <p>DECK</p>
           : <a href='/'>Login</a>}
        </div>
    )
}