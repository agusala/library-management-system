import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Home } from "./pages/Home"
import { PrivateRoute } from './components/PrivateRoute';
import { MisLibros } from './pages/MisLibros';
import { Login } from "./pages/Login"
import { Registrer } from "./pages/Register"

const theme = createTheme();

function App(){
  return(
    <ThemeProvider theme ={theme} >
      <CssBaseline>
        <AuthProvider >
          <BrowserRouter>
          <Navbar/>
          <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Registrer/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/mis-libros" element={<PrivateRoute><MisLibros/></PrivateRoute>}/>
          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </CssBaseline>
    </ThemeProvider>
  )
} 
export default App;