import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

export const Navbar =()=>{
    const{user,logout}=useAuth()
    const navigate = useNavigate()

    const handleLogout=()=>{
        logout();
        navigate("/")
    }
    return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow:1}}>
                    <Button color="inherit" component={RouterLink} to="/"> 
                    Sistema Gestion de Libros 
                    </Button>
                </Typography>
                <Box>
                    {!user?(
                        <Button color="inherit" component={RouterLink} to="/login">
                            Login
                        </Button>
                    ):(<>
                    <Button color="inherit" component={RouterLink} to="/mis-libros">
                    Mis Libros
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Desconectar({user.nombre})
                    </Button>
                    </>)}
                </Box>
            </Toolbar>
        </AppBar>
    )
}