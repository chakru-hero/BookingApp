import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect,setRedirect] = useState(false);

    const {setUser} = useContext(UserContext);

    async function handleLoginSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        try {
            const response = await axios.post('/login',{email, password});
            setUser(response.data);
            if( (response).status==200){
              setRedirect(true);
            }
        }
        catch (e) {
            alert('Login Failed');
        }
           
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input type="email" placeholder="your@email.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                    ></input>
                    <input type="password" placeholder="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                    ></input>
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">Don't have an account yet? <Link to={'/register'} className="underline text-black">Register now </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}