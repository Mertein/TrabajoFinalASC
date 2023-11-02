// @ts-nocheck
'use client'
import * as React from 'react';
import { DataGrid, GridCellParams, GridColDef, GridToolbar, GridValueGetterParams, esES } from '@mui/x-data-grid';
import {Chip, Box, Button, FormControl, IconButton,  InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography ,OutlinedInput, Theme} from '@mui/material';
import {useTheme} from '@mui/system';
import * as yup from 'yup';
import { Delete, Edit } from '@mui/icons-material';
import Loading from '@/app/(views)/instructor/MyCourses/loading';
import Header from '@/app/components/Header/header';
import { tokens } from '@/app/theme';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';
import { format} from 'date-fns';
import { useEffect, useState } from 'react';
import { Close as CloseIcon } from "@mui/icons-material";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

 function Users ({roles} : any) {
  const fetcher = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
  const { data, error, isLoading } = useSWR('/api/users', fetcher)
  const [loading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [userRol, setUserRol] =  useState<string[]>([]);
  const [rolesID, setRolesID] =  useState<string[]>([]);
  const [editUserRol, setEditUserRol] =  useState<string[]>([]);
  const [user, setUser] = useState({
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      date_of__birth:'',
      address:'',
      phone_number:'',
      emergency_contact:'',
      // gender:'',
      dni: '',
      roles: [],
  });
  const [editingUser, setEditingUser] = useState(null);
  const [editUser, setEditUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    date_of__birth: '',
    address:'',
    phone_number:'',
    emergency_contact:'',
    // gender:'',
    dni: '',
    roles: [],    
  });
  const theme = useTheme();
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  const handleChange = (event: SelectChangeEvent<typeof userRol>) => {
    const {
      target: { value },
    } = event;
    setUserRol(
      typeof value === 'string' ? value.split(',') : value,
    );
    setUser({ ...user, roles: [value] });
  };
  const roleMap = {
    Student: 1,
    Instructor: 2,
    Admin: 3,
  };
  const handleEditChange = (event: SelectChangeEvent<typeof editUserRol>) => {
    const {
      target: { value },
    } = event;
    setEditUserRol(
      typeof value === 'string' ? value.split(',') : value,
    );
    const selectedRoles = typeof value === 'string' ? value.split(',') : value;
    const numericRoles = selectedRoles.map((role) => roleMap[role]);
    setRolesID(numericRoles);
    setEditUser({ ...editUser, roles: [value]});
  };
  const handleEditClick = (id: number): void => {
    const selectedUser = data.find((user: { user_id: number }) => user.user_id === id);
    if (selectedUser) {
      setEditingUser(selectedUser);
  
      // Convertir la fecha de nacimiento al formato legible antes de establecerla en el estado
      const formattedDateOfBirth = format(new Date(selectedUser.date_of__birth), 'yyyy-MM-dd');
      
      setEditUser({ ...selectedUser, date_of__birth: formattedDateOfBirth });
      setEditUserRol(selectedUser.roles);
      handleOpen();
    }
  };
  
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () =>  {
    setOpen(false);
    setUserRol([]);
    setEditUserRol([]);
    setEditingUser(null);
    setFormErrors({});
    setEditUser(
      {
        email: '',
        first_name: '',
        last_name: '',
        date_of__birth: '',
        address:'',
        phone_number:'',
        emergency_contact:'',
        // gender:'',
        dni: '',
        roles: [],      
      }
    );
    setUser (
      {
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        date_of__birth:'',
        address:'',
        phone_number:'',
        emergency_contact:'',
        // gender:'',
        dni: '',
        roles: [],
      }
    )
  };

  useEffect(() => {
    const selectedRoles = typeof editUserRol === 'string' ? value.split(',') : editUserRol ;
    const numericRoles = selectedRoles.map((role) => roleMap[role]);
    setRolesID(numericRoles);
  }, [editUserRol]);

  const handleDeleteClick =  (id: number ): void => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    setIsLoading(true);
    if (confirmed) {
      axios.delete(`/api/users/${id}`, {

      }).then(() => {
        toast.success('Usuario Eliminado con Exito');
        mutate('/api/users');
      })
        .catch((error) => {
          toast.error('Error al eliminar el usuario');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const handleEditUser = async () => {
  
    const isValid = await checkoutEditSchema.isValid(editUser);
      if (isValid) {
      setIsLoading(true);
      axios.put('/api/users', {
        data: {
          user: editUser,
          rolesLength : editUserRol.length,
          rolesID: rolesID,
        }
      }).then((response) => {
          setEditingUser(null);
          setEditUser({
        email: '',
        first_name: '',
        last_name: '',
        date_of__birth:'',
        address:'',
        phone_number:'',
        emergency_contact:'',
        // gender:'',
        dni: '',
        roles: [],       
      });
          handleClose();
          toast.success('Usuario actualizado con éxito');
          // Invalidar la caché y realizar una nueva solicitud para obtener los datos actualizados
          mutate('/api/users');
        })
        .catch((error) => {
          toast.error('Error al actualizar el usuario');
        })
        .finally(() => {
          setIsLoading(false);
        });
        setFormErrors({});
      } else {
          try {
            await checkoutEditSchema.validate(editUser, { abortEarly: false });
          } catch (errors) {
            const errorMessages = errors.inner.map((error) => error.message);
            console.log('Errores de validación edicion:', errorMessages);
            // Puedes mostrar estos mensajes de error al usuario
            const newFormErrors = {};
            errors.inner.forEach((error) => {
              newFormErrors[error.path] = error.message;
            });
            setFormErrors(newFormErrors);
          }
    }
  }




  const handleAddClick = async () => {
    const isValid = await checkoutSchema.isValid(user);
    if (isValid) {
      setIsLoading(true);
      axios
        .post('/api/users', { user })
        .then((response) => {
          setUser({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        date_of__birth:'',
        address:'',
        phone_number:'',
        emergency_contact:'',
        // gender:'',
        dni: '',
        roles: [],    
      });
          handleClose();
          toast.success('Usuario registrado con éxito');
          mutate('/api/users');
        })
        .catch((error) => {
          toast.error('Error a registrar usuario');
        })
        .finally(() => {
          setIsLoading(false);
        });
        setFormErrors({});
      } else {
        try {
          await checkoutSchema.validate(user, { abortEarly: false });
        } catch (errors) {
          const errorMessages = errors.inner.map((error) => error.message);
          console.log('Errores de validación creacion:', errorMessages);
          // Puedes mostrar estos mensajes de error al usuario
          const newFormErrors = {};
          errors.inner.forEach((error) => {
            newFormErrors[error.path] = error.message;
          });
          setFormErrors(newFormErrors);
        }
    }
  };

  const roleColors = {
    Admin: 'red',
    Student: 'green',
    Instructor: 'blue',
  };

  const getRoleCellStyle = (role: string) => {
    const color = roleColors[role];
    return {
      border: `2px solid ${color}`,
      backgroundColor: `${color}Light`,
      padding: '4px',
      borderRadius: '4px',
      fontWeight: 'bold',
    };
  };

   
  const columns: GridColDef[] = [
    { field: 'user_id', headerName: 'ID', width: 70,  flex : 1,},
    { 
      field: 'Nombre Completo',
      headerName: 'Nombre Completo', 
      description: 'Esta columna no se puede ordenar',
      sortable: false,
      width: 160,
      flex : 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.first_name || ''} ${params.row.last_name || ''}`,
    },
    {field: 'email', headerName: 'Email', width: 200},
    {field: 'phone_number', headerName: 'Telefono', width: 160, flex : 1,},
    {field: 'address', headerName: 'Direccion', width: 200},
    {field: 'age', headerName: 'Edad', width: 160, flex : 1,},

    { 
      field: 'created_at', 
      headerName: 'Registrado', 
      flex : 1,
      valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.created_at), 'HH:mm:ss  dd/MM/yyyy'),
    },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 250,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const roles = params.value as string[];

        return (
          <Box>
            {roles.map((role) => (
              <Chip
                key={role}
                label={role}
                size="small"
                style={getRoleCellStyle(role)}
              />
            ))}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex : 1,
      
      renderCell: (params: GridCellParams)  => (
        
        <>
          <IconButton
            onClick={() => handleDeleteClick(params.row.user_id)}
            color="secondary"
            
          >
            <Delete />
          </IconButton>
  
          <IconButton
            onClick={() => handleEditClick(params.row.user_id)}
          >
            <Edit />
          </IconButton>
          
        </>
        
      ),
    },
  ];
    return (
    <Box m="20px">
      <Header
       title="Usuarios"
       subtitle="Lista de Usuarios registrados en el sistema"
      />
      <Button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleOpen}
        color="success"
        disabled={false}
        size="medium"
        variant="contained"
      >
        Agregar Usuario
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h4" component="h2" className="pb-5 text-center flex-1">
            {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
          </Typography>
          
          <Box display="flex" flexDirection="column" alignItems="center">
          {editingUser && (
            <>
            <TextField
                 fullWidth
                 variant="filled"
                 type="text"
                 label="Nombre"
                 onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                 value={editUser.first_name}
                 name="first_name"
                 error={!!formErrors.first_name}
                 helperText={formErrors.first_name}
                
               />
               <TextField
                 fullWidth
                 variant="filled"
                 type="text"
                 label="Apellido"
                 onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                 value={editUser.last_name}
                 name="last_name"
                 error={!!formErrors.last_name}
                 helperText={formErrors.last_name}
               />
               <TextField
                 fullWidth
                 variant="filled"
                 type="text"
                 label="Email"
                 onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                 value={editUser.email}
                 name="email"
                 error={!!formErrors.email}
                 helperText={formErrors.email}
               />
               <TextField
                 fullWidth
                 variant="filled"
                 type="text"
                 label="Dirección/Domicilio"
                 onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                 value={editUser.address}
                 name="address"
                 error={!!formErrors.address}
                 helperText={formErrors.address}
                 sx={{ gridColumn: "span 4" }}
               />
               <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de Nacimiento"
                onChange={(e) => {
                  setEditUser({ ...editUser, date_of__birth: e.target.value });
                }}
                value={editUser.date_of__birth || ''}
                name="date_of__birth"
                error={!!formErrors.date_of__birth}
                helperText={formErrors.date_of__birth}
                />
               
                <TextField
                 fullWidth
                 variant="filled"
                 type="number"
                 label="Numero de Telefono"
                 onChange={(e) => setEditUser({ ...editUser, phone_number: e.target.value })}
                 value={editUser.phone_number}
                 name="phone_number"
                 error={!!formErrors.phone_number}
                 helperText={formErrors.phone_number}
               />
               <TextField
                 fullWidth
                 variant="filled"
                 type="number"
                 label="Contacto/Nro de emergencia"
                 onChange={(e) => setEditUser({ ...editUser, emergency_contact: e.target.value })}
                 value={editUser.emergency_contact}
                 name="emergency_contact"
                 error={!!formErrors.emergency_contact}
                 helperText={formErrors.emergency_contact}
               />
                 {/* <TextField
                 fullWidth
                 variant="filled"
                 type="text"
                 label="Genero"
                 onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
                 value={editUser.gender}
                 name="gender"
               /> */}
                 <TextField
                 fullWidth
                 variant="filled"
                 type="number"
                 label="D.N.I"
                 onChange={(e) => setEditUser({ ...editUser, dni: e.target.value })}
                 value={editUser.dni}
                 name="dni"
                 error={!!formErrors.dni}
                 helperText={formErrors.dni}
               />
                 <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Roles</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={editUserRol}
                  onChange={handleEditChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {roles.map((rol) => (
                    <MenuItem
                      key={rol.rol_id}
                      value={rol.rol_name}
                      style={getStyles(rol, editUserRol, theme)}
                    >
                      {rol.rol_name}
                   
                    </MenuItem>
                  ))}
                </Select>
             </FormControl>
             </>
          )}
          {!editingUser && (
            <>
           <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Primer nombre"
                onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                value={user.first_name}
                name="first_name"
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
               
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Segundo nombre"
                onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                value={user.last_name}
                name="last_name"
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                value={user.email}
                name="email"
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Contraseña"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                value={user.password}
                name="password"
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dirección/Domicilio"
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                value={user.address}
                name="address"
                error={!!formErrors.address}
                helperText={formErrors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de Nacimiento"
                onChange={(e) => setUser({ ...user, date_of__birth: e.target.value })}
                value={user.date_of__birth}
                name="date_of__birth"
                error={!!formErrors.date_of__birth}
                helperText={formErrors.date_of__birth}
              />
               <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Numero de Telefono"
                onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                value={user.phone_number}
                name="phone_number"
                error={!!formErrors.phone_number}
                helperText={formErrors.phone_number}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Contacto/Nro de emergencia"
                onChange={(e) => setUser({ ...user, emergency_contact: e.target.value })}
                value={user.emergency_contact}
                name="emergency_contact"
                error={!!formErrors.emergency_contact}
                helperText={formErrors.emergency_contact}
              />
                {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Genero"
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                value={user.gender}
                name="address2"
              /> */}
                <TextField
                fullWidth
                variant="filled"
                type="number"
                label="D.N.I"
                onChange={(e) => setUser({ ...user, dni: e.target.value })}
                value={user.dni}
                name="dni"
                error={!!formErrors.dni}
                helperText={formErrors.dni}
              />
               <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Roles</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={userRol}
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {roles.map((rol) => (
                    <MenuItem
                      key={rol.rol_id}
                      value={rol.rol_name}
                      style={getStyles(rol, userRol, theme)}
                    >
                      {rol.rol_name}
                   
                    </MenuItem>
                  ))}
                </Select>
             </FormControl>
            
            </>
          )}
          <Button
            variant="contained"
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold"
            onClick={editingUser ? handleEditUser : handleAddClick}
            color="primary"
          >
            {editingUser ? 'Editar' : 'Agregar'}
          </Button>
          </Box>
        </Box>
      </Modal>
      <Box
        m="40px 0 0 0"
        
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Loading /> {/* Muestra el componente Loading */}
          </Box>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            getRowId={(row) => row.user_id}
            autoHeight={true}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            slotProps={{
              pagination: {
                labelRowsPerPage: ('Filas por página'),
                labelDisplayedRows: ({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
              }
            }}
          />
        )} 
      </Box>
    </Box>
  );
}
const checkoutSchema = yup.object().shape({
  first_name: yup.string().required("El nombre es obligatorio").min(3, "El nombre debe tener al menos 3 caracteres").max(25, "El nombre debe tener como maximo 25 caracteres"),
  last_name: yup.string().required("El apellido es obligatorio").min(3, "El apellido debe tener al menos 3 caracteres").max(20, "El apellido debe tener como maximo 20 caracteres"),
  email: yup.string().email("Ingrese un correo electrónico válido, por ej: ejemplo@ejemplo.com").required("El correo electrónico es obligatorio").max(30, "El correo debe tener como maximo 30 caracteres"),
  password: yup.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(20, "La contraseña debe tener como maximo 20 caracteres").required("La contraseña es obligatoria"),
  address: yup.string().required("La dirección es obligatoria").min(5, "La dirección debe tener al menos 5 caracteres").max(50, "La dirección debe tener como maximo 50 caracteres"),
  date_of__birth: yup.string().required("La fecha de nacimiento es obligatoria"),
  phone_number: yup.string().required("El numero de telefono es obligatorio").min(7, "El numero de telefono debe tener al menos 7 digitos").max(13, "El numero de telefono debe tener como maximo 13 digitos"),
  dni: yup.string().required("El DNI es obligatorio").min(7, "El DNI debe tener al menos 7 digitos").max(12, "El DNI debe tener como maximo 12 digitos"),
  // emergency_contact: yup.string().required("El numero de contacto es obligatorio"),
  // Agrega más campos y reglas de validación según tus necesidades
});

const checkoutEditSchema = yup.object().shape({
  first_name: yup.string().min(3, "El nombre debe tener al menos 3 caracteres").max(25, "El nombre debe tener como máximo 25 caracteres"),
  last_name: yup.string().min(3, "El apellido debe tener al menos 3 caracteres").max(20, "El apellido debe tener como máximo 20 caracteres"),
  email: yup.string().email("Ingrese un correo electrónico válido, por ejemplo: ejemplo@ejemplo.com").max(30, "El correo debe tener como máximo 30 caracteres"),
  address: yup.string().min(5, "La dirección debe tener al menos 5 caracteres").max(50, "La dirección debe tener como máximo 50 caracteres"),
  date_of_birth: yup.string(),
  phone_number: yup.string().min(7, "El número de teléfono debe tener al menos 7 dígitos").max(13, "El número de teléfono debe tener como máximo 13 dígitos"),
  dni: yup.string().min(7, "El DNI debe tener al menos 7 dígitos").max(12, "El DNI debe tener como máximo 12 dígitos"),
});


export default Users;