import { Container,Box, Typography } from "@mui/material"

export const Home =()=>{
    return (
        <Container maxWidth="md">
            <Box sx={{mt:8 , textAlign:'center'}}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Bievenidos a la App de Gestion de Libros
                </Typography>
                <Typography variant="h5" color="text.secundary" paragraph>
                    Desde el menu Inicia sesion para gestionar tus Libros.  
                </Typography>
            </Box>
        </Container>
    )
}