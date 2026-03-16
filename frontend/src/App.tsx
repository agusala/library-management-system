import { Box} from "@mui/material"
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Home } from "./pages/Home"
import { PrivateRoute } from './components/PrivateRoute';
import { MisLibros } from './pages/MisLibros';
import { Login } from "./pages/Login"
import { Registrer } from "./pages/Register"
import { AdminPanel } from './pages/AdminPanel';
import { AdminRoute } from './components/AdminRoute';


function App(){
  return(
        <AuthProvider >
          <BrowserRouter>
          <Box sx={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
          <Navbar/>
          <Box sx={{flexGrow:1,display:"flex",alingnItems:"center",justifyContent:"center"}}>
          <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Registrer/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/mis-libros" element={<PrivateRoute><MisLibros/></PrivateRoute>}/>
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>}/>
          </Routes>
          </Box>
          </Box>
          </BrowserRouter>
        </AuthProvider>
  )
} 
export default App;