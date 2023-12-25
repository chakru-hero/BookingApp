import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";

export type UserContent = {
    user:any,
    setUser:(c:any)=>void,
    ready:boolean
    // setReady:(c:any)=>void
}

export const UserContext = createContext<UserContent>({
    user:null,
    setUser:()=>{},
    ready:false,
    // setReady:()=>{}
});

export function UserContextProvider({children}:{children:ReactNode}){
    const [user,setUser] = useState(null);
    const [ready,setReady] = useState(false);
    useEffect(() => {
        if(!user){
           axios.get('/profile').then(({data})=>{
            setUser(data);   
            setReady(true);  
           });
        }
    },[])
    return (
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
    );
}