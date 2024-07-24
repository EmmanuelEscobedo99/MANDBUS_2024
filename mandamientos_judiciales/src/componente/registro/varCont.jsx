import { createContext, useContext, useState } from "react";


const UseContext = createContext();

export const UserProvider = ({children})=>{
  const [username, setUsername] = useState('')

  const updateUser = (newUsername)=>{
    setUsername(newUsername);
  };


  return (

    <UseContext.Provider value={{username, updateUser}}>
        {children}
    </UseContext.Provider>
  );



};

 export const useUser = ()=>{
    return useContext(UserContext);
 }