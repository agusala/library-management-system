import React, { createContext,useState,useContext,useEffect, type ReactNode,} from "react"
import api from '../services/api'
import {type User} from '../types'

interface AuthContextType{
    user:User|null
    loading: boolean
    login:(email:string,passwod:string)=>Promise<{success:boolean;message?:string}>
    logout:()=>void
}

const AuthContext = createContext<AuthContextType|undefined>(undefined)

export const useAuth = ()=>{
    const context =useContext(AuthContext)
    if (!context)throw new Error('useAth debe usarce dentro de AuthProvider')
        return context
}

interface AuthProviderProps{
    children:ReactNode
}
export const AuthProvider:React.FC<AuthProviderProps>=({children})=>{
    const [user,setUser]= useState<User|null>(null)
    const [loading, setLoading]=useState(true)

useEffect(()=>{
    const token = localStorage.getItem('token')
    if (token) {
        api.get('/auth/me')
        .then(response=>{
            setUser(response.data)
            localStorage.setItem('user',JSON.stringify(response.data))
        })
        .catch(()=>{
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        })
        .finally(()=>setLoading(false))
    }else{
        setLoading(false)
    }
},[])
const login = async (email:string,password:string)=>{
    try{
        const response =await api.post('/auth/login',{email,password})
        const {access_token}=response.data
        localStorage.setItem('token',access_token)
        const userResponse =await api.get('/auth/me')
        setUser(userResponse.data)
        localStorage.setItem('user',JSON.stringify(userResponse.data))
        return{success:true} 
    }catch(error:any){
        return{
            success:false,
            message:error.response?.data?.detail||'error al  iniciar secion'
        }
    }

}
   const logout=()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }
        return(
        <AuthContext.Provider value={{user,loading,logout,login}}>{children}</AuthContext.Provider>
    )
}