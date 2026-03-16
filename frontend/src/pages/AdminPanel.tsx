import { useEffect, useState } from 'react';
import { Container,Typography,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Tabs,Tab,Box,Button,IconButton,TablePagination,} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import api from '../services/api';
import type { Book, User } from '../types';


export const AdminPanel = () => {
  const [tab, setTab] = useState<0 | 1>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedUserBooks, setSelectedUserBooks] = useState<Book[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/admin/users?limit=${rowsPerPage}&offset=${page * rowsPerPage}`);
      setUsers(response.data.items);
      setTotalUsers(response.data.total)
    } catch (error) {
      console.error('Error al cargar usuarios', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get(`/admin/books?limit=${rowsPerPage}&offset=${page * rowsPerPage}`);
      setBooks(response.data.items);
      setTotalBooks(response.data.total)
    } catch (error) {
      console.error('Error al cargar libros', error);
    }
  };

  const fetchUserBooks = async (userId: number) => {
    try {
      const response = await api.get(`/admin/users/${userId}/books?limit=100&offset=0`);
      setSelectedUserBooks(response.data);
    } catch (error) {
      console.error('Error al cargar libros del usuario', error);
    }
  };

  useEffect(() => {
    if (tab === 0) {
      fetchUsers();
    } else {
      fetchBooks();
    }
  }, [tab, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewUserBooks = (user: User) => {
    setSelectedUser(user);
    fetchUserBooks(user.id);
  };

  const closeUserBooksModal = () => {
    setSelectedUser(null);
    setSelectedUserBooks(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue as 0|1)}>
        <Tab label="Usuarios" />
        <Tab label="Libros" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === 0 && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.nombre}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleViewUserBooks(user)}>
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {selectedUser && (
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1300,
                }}
                onClick={closeUserBooksModal}
              >
                <Paper sx={{ p: 3, maxWidth: 600, maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                  <Typography variant="h6" gutterBottom>
                    Libros de {selectedUser.nombre}
                  </Typography>
                  {selectedUserBooks ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Autor</TableCell>
                            <TableCell>Fecha</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedUserBooks.map((book) => (
                            <TableRow key={book.id}>
                              <TableCell>{book.titulo}</TableCell>
                              <TableCell>{book.autor}</TableCell>
                              <TableCell>{new Date(book.fecha_publicacion).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>Cargando...</Typography>
                  )}
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button onClick={closeUserBooksModal}>Cerrar</Button>
                  </Box>
                </Paper>
              </Box>
            )}
          </>
        )}
        {tab === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Autor</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Propietario ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>{book.titulo}</TableCell>
                    <TableCell>{book.autor}</TableCell>
                    <TableCell>{new Date(book.fecha_publicacion).toLocaleDateString()}</TableCell>
                    <TableCell>{book.owner_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tab  ? totalUsers : totalBooks}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
            />
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};