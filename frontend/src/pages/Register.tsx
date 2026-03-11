import React, { useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import api from "../services/api"
import { Alert, Box, Button, Container, Paper, TextField, Typography, Link } from "@mui/material"

export const Registrer= ()=>{
    const [nombre, setNombre] =useState("")
    const [email,setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error,setError]=useState("")
    const [success,setSuccess]=useState(false)
    const navigate=useNavigate()

    const handleSubmit =async(e:React.FormEvent)=>{
        e.preventDefault()
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            setError("correo no valido")
            return
        }
        if (password.length<8){
            setError("La contraseña debe tener al menos 8 caracteres")
            return
        }
        setError("")
        try{
            await api.post("/auth/register",{nombre,email,password})
            setSuccess(true)
            setTimeout(()=>navigate("/login"),2000)
        }catch(err:any){
            setError(err.response?.data?.datail || "error al registrarte")
        }
    }
    return(
        <Container maxWidth="sm">
            <Box sx={{mt:8}}>
                <Paper elevation={3} sx={{p:4}}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">Registro</Typography>
                   {success ? (<Alert severity="success">Registro exitoso</Alert>):(
                        <Box component="form" onSubmit={handleSubmit} sx={{mt:2}}>
                            <TextField fullWidth label="Nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} margin="normal" required/>
                            <TextField fullWidth label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} margin="normal" required/>
                            <TextField fullWidth label="Password" value={password} onChange={(e)=>setPassword(e.target.value)} margin="normal" required helperText="minimo 8 caracteres"/>
                                {error && ( <Alert severity="error" sx={{mt:2}}>{error}</Alert>)}
                                <Button type="submit" fullWidth variant="contained" sx={{mt:3}}>Registrarse</Button>
                                <Box sx={{mt:2 ,textAlign:"center"}}>
                                    <Link component={RouterLink} to="/login" variant="body2">Si ya tienes cuenta inicia sesion
                                    </Link>
                                </Box>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    )
}