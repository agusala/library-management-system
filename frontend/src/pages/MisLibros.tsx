import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { Book } from "../types"
import api from "../services/api"
import { Box, Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material"
import { Add, Delete, Edit } from "@mui/icons-material"
import { BookModal } from "../components/BookModal"

export const MisLibros=()=>{
    const {user} =useAuth()
    const [books, setBooks]=useState<Book[]>([])
    const [page, setPage]=useState(0)
    const [rowsPerPage, setRowsPerPage ]=useState(10)
    const [total, setTotal]=useState(0)
    const [modalOpen,setModalOpen]=useState(false)
    const [editingBook,setEditingBook]=useState<Book|null>(null)
    const [deletConfirm,setDeletConfirm]=useState<Book|null>(null)

    const fetchBooks =async ()=> {
        try{
            const response =await api.get(`/books/?limit=${rowsPerPage}&offset=${page*rowsPerPage}`)
            setBooks(response.data.items)
            setTotal(response.data.total)
            }catch(error){
                console.error("error de carga de libros",error)
            }
        }
    useEffect(()=>{
        fetchBooks()
    },[page,rowsPerPage])
    
    const handleChangePage =(_:unknown,newPage:number)=>{
        setPage(newPage)
    }
    const handleChangeRowsPrePage = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setRowsPerPage(parseInt(event.target.value,10))
        setPage(0)
    }
    const handleOpenAddModal =()=>{
        setEditingBook(null)
        setModalOpen(true)
    }
    const handleOpenEditModal =(book:Book)=>{
        setEditingBook(book)
        setModalOpen(true)
    }
    const handleCloseModal=()=>{
        setModalOpen(false)
        setEditingBook(null)
    }
    const handleSaveBook = async (bookData: { titulo: string; autor: string,fecha_publicacion:string }) => {
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, bookData);
      } else {
        await api.post('/books', bookData);
      }
      handleCloseModal();
      fetchBooks();
    } catch (error) {
      console.error('Error al guardar libro', error);
    }
  };

  const handleDeleteClick = (book: Book) => {
    setDeletConfirm(book);
  };

  const confirmDelete = async () => {
    if (!deletConfirm) return;
    try {
      await api.delete(`/books/${deletConfirm.id}`);
      setDeletConfirm(null);
      fetchBooks();
    } catch (error) {
      console.error('Error al eliminar libro', error);
    }
  };

  const cancelDelete = () => {
    setDeletConfirm(null);
  };
  return(
    <Box sx={{flexGrow:1, p:3}}>
    <Container maxWidth="lg" sx={{mt:4}}>
<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
<Typography variant="h4">
    Mis Libros {user && `Hola ${user.nombre}`}
</Typography>
 <Button variant="contained" startIcon={<Add/>} onClick={handleOpenAddModal}>Agregar Libro</Button>
</Box>
<TableContainer>
    <Table>
        <TableHead>
        <TableRow>    
            <TableCell>Titulo</TableCell>
            <TableCell>Autor</TableCell>
            <TableCell>Fecha de Publicacion</TableCell>
            <TableCell align="right">Acciones</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
            {books.map((book)=>(
                <TableRow key={book.id}>
                    <TableCell>{book.titulo}</TableCell>
                    <TableCell>{book.autor}</TableCell>
                    <TableCell>{new Date(book.fecha_publicacion).toDateString()}</TableCell>
                    <TableCell align="right">
                        <IconButton color="primary" onClick={()=>handleOpenEditModal(book)}><Edit/></IconButton>
                        <IconButton color="error" onClick={()=>handleDeleteClick(book)}><Delete/></IconButton>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={total} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPrePage} labelRowsPerPage="Filas por página"/>
</TableContainer>
<BookModal open={modalOpen} onClose={handleCloseModal} onSave={handleSaveBook} book={editingBook}/>
{deletConfirm && (
    <Box sx={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300,}}>
        <Paper sx={{p:3, maxWidth:400}}>
    <Typography variant="h6" gutterBottom>
        confirmar
    </Typography>
    <Typography>¿Estas seguro que deseas eliminarlo "{deletConfirm?.titulo}"?</Typography>
    <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
        <Button onClick={cancelDelete}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={confirmDelete}>Eliminar</Button>
    </Box>
</Paper>
    </Box>
)}

    </Container>
    </Box>)}