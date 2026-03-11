import {useState} from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import{ Alert, Box, Button, Container, Link, Paper, TextField, Typography } from '@mui/material'

export const Login =()=> {
    const [email, setEmail] =useState('')
    const [password, setPassword] =useState('')
    const [error,setError] =useState('')
    const{login}=useAuth()
    const navigate=useNavigate()

    const handleSubmit =async (e:React.FormEvent)=>{
        e.preventDefault()
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            setError('Correo  no valido')
            return
        }
        setError('')
        const result =await login (email,password)
        if (result.success){
            navigate('/mis-libros')
        }else{
            setError(result.message||'Inicio de sesion fallida')
        }
    }
    return(
        <Container maxWidth="sm">
            <Box sx={{mt:8}}>
                <Paper elevation={3} sx={{p:4}}>
                    <Typography variant='h4' component="h1" gutterBottom align='center'>
                        Iniciar Sesion
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}sx={{mt:2}}>
                        <TextField fullWidth label="Email" type='email' value={email} onChange={(e)=>setEmail(e.target.value)} margin='normal' required></TextField>
                        <TextField fullWidth label="Contraseña" type='password' value={password} onChange={(e)=>setPassword(e.target.value)} margin='normal' required></TextField>
                        {error && (
                            <Alert severity='error' sx={{mt:2}}>{error}</Alert>
                        )}
                        <Button type='submit' fullWidth variant='contained' sx={{mt:3}}>
                            Ingresar
                        </Button>
                    </Box>
                    <Box sx={{mt:2, textAlign:"center"}}>
                        <Link component={RouterLink} to="/register" variant="body2">¿Si no tienes cuenta? registrate</Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}
    