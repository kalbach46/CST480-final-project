import Cookies from 'js-cookie';

export default function Home() {
    return (
        <div>
            {Cookies.get('loggedIn')==='true'?
           <p>HOME</p>
           : <a href='/'>Login</a>}
        </div>
    )
}