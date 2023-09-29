'use client'
import * as React from 'react';
import { DataGrid, GridCellParams, GridColDef, GridToolbar, GridValueGetterParams, esES } from '@mui/x-data-grid';
import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import {useTheme} from '@mui/system';
import { Delete, Edit} from '@mui/icons-material';
import Loading from '@/app/(views)/instructor/MyCourses/loading';
import Header from '@/app/components/Header/header';
import { tokens } from '@/app/theme';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';
import { format} from 'date-fns';
import { useState } from 'react';
import {Close as CloseIcon} from '@mui/icons-material';
import * as yup from 'yup';

function BranchOffices() {
  const modalStyle = {
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
  
  const fetcher = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json());
  const { data, error, isLoading } = useSWR('/api/branchOffices', fetcher);
  const [loading, setIsLoading] = useState(false);
  const [branch_name, setBranchName] = useState('');
  const [branch_address, setBranchAddress] = useState('');
  const [people_capacity, setPeopleCapacity] = useState(0);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [editBranchAdress, setEditBranchAddress] = useState('');
  const [editPeopleCapacity, setEditPeopleCapacity] = useState(0);
  const [editBranchName, setEditBranchName] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () =>  {
    setOpen(false);
    setBranchName('');
    setEditingBranch(null);
    setBranchAddress('');
    setPeopleCapacity(0);
    setFormErrors({});
  };
  const handleDeleteClick = (id: number): void => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta categoría?');
    setIsLoading(true);
    if (confirmed) {
      axios.delete(`/api/branchOffices/${id}`, {
      })
      .then(() => {
        toast.success('Sucursal eliminada con éxito');
        mutate('/api/branchOffices');
      })
      .catch((error) => {
        toast.error('Error al eliminar la Sucursal');
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };

 
const handleEditBranch = async () => {
  setIsLoading(true);

  try {
    await checkoutSchema.validate({
      branch_name: editBranchName,
      branch_address: editBranchAdress,
      people_capacity: editPeopleCapacity,
    }, { abortEarly: false });

    axios.put('/api/branchOffices', {
      data: {
        branch_id: editingBranch?.branch_id,
        branch_name: editBranchName,
        branch_address: editBranchAdress,
        people_capacity: editPeopleCapacity,
      }
    })
    .then((response) => {
      setEditingBranch(null);
      setEditBranchName('');
      handleClose();
      toast.success('Sucursal actualizada con éxito');
      mutate('/api/branchOffices');
    })
    .catch((error) => {
      toast.error('Error al actualizar la Sucursal');
    })
    .finally(() => {
      setIsLoading(false);
    });
  } catch (validationErrors) {
    const errorMessages = {};
    // @ts-ignore
    validationErrors.inner.forEach((error) => {
      // @ts-ignore
      errorMessages[error.path] = error.message;
    });
    setFormErrors(errorMessages);
  }
};

  const handleEditClick = (id: number): void => {
    const selectedBranch = data.find((branch: { branch_id: number }) => branch.branch_id === id);
    if (selectedBranch) {
      setEditingBranch(selectedBranch);
      setEditBranchName(selectedBranch.branch_name);
      setEditBranchAddress(selectedBranch.branch_address);
      setEditPeopleCapacity(selectedBranch.people_capacity);
      handleOpen();
    }
  };

  const handleAddClick = async () => {
    setIsLoading(true);

    try {
      await checkoutSchema.validate({
        branch_name,
        branch_address,
        people_capacity,
      }, { abortEarly: false });
        axios.post('/api/branchOffices', {
        branch_name,
        branch_address,
        people_capacity: people_capacity,
      })
      .then((response) => {
        setBranchName('');
        handleClose();
        toast.success('Sucursal agregada con éxito');
        mutate('/api/branchOffices');
      })
      .catch((error) => {
        toast.error('Error al agregar la Sucursal');
      })
      .finally(() => {
        setIsLoading(false);
      });
    } catch (validationErrors) {
      const errorMessages = {};
      // @ts-ignore
      validationErrors.inner.forEach((error) => {
           // @ts-ignore
        errorMessages[error.path] = error.message;
          // @ts-ignore
      });
      setFormErrors(errorMessages);
    }
  };
  

  const columns: GridColDef[] = [
    { field: 'branch_id', headerName: 'ID', width: 70,  flex: 1 },
    { field: 'branch_name', headerName: 'Nombre Categoria', flex: 1 },
    { field: 'branch_address', headerName: 'Dirección', flex: 1 },
    { field: 'people_capacity', headerName: 'Capacidad de personas', flex: 1 },
    { 
      field: 'created_at', 
      headerName: 'Fecha y hora de Creación', 
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => format(new Date(params.row.created_at), 'HH:mm:ss  dd/MM/yyyy'),
    },
    { 
      field: 'updated_at', 
      headerName: 'Fecha y hora de Actualización', 
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params.row.updated_at ?  format(new Date(params.row.updated_at), 'HH:mm:ss  dd/MM/yyyy') : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <>
          <IconButton
            onClick={() => handleDeleteClick(params.row.branch_id)}
            color="secondary"
          >
            <Delete />
          </IconButton>
  
          <IconButton
            onClick={() => handleEditClick(params.row.branch_id)}
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
        title="Mis Sucursales"
        subtitle="Lista de mis sucursales creadas"
      />
      <Button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleOpen}
        color="success"
        disabled={false}
        size="medium"
        variant="contained"
      >
        Agregar Sucursal
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h4" component="h2" className="pb-5 text-center flex-1">
            {editingBranch ? 'Editar Sucursal' : 'Agregar Sucursal'}
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            {editingBranch && (
              <>
                <TextField
                  label="Nombre Sucursal"
                  variant="filled"
                  onChange={(e) => setEditBranchName(e.target.value)}
                  value={editBranchName}
                     // @ts-ignore
                  error={!!formErrors.branch_name}
                     // @ts-ignore
                  helperText={formErrors.branch_name}
                />
                <TextField
                  label="Dirección Sucursal"
                  variant="filled"
                  onChange={(e) => setEditBranchAddress(e.target.value)}
                  value={editBranchAdress}
                     // @ts-ignore
                  error={!!formErrors.branch_address}
                     // @ts-ignore
                  helperText={formErrors.branch_address}
                />
                <TextField
                  type='number'
                  label="Capacidad de Personas"
                  variant="filled"
                   // @ts-ignore
                  onChange={(e) => setEditPeopleCapacity(e.target.value)}
                  value={editPeopleCapacity}
                     // @ts-ignore
                  error={!!formErrors.people_capacity}
                     // @ts-ignore
                  helperText={formErrors.people_capacity}
                />
              </>
            )}
            {!editingBranch && (
              <>
              <TextField
                label="Nombre Sucursal"
                variant="filled"
                onChange={(e) => setBranchName(e.target.value)}
                value={branch_name}
                   // @ts-ignore
                error={!!formErrors.branch_name}
                   // @ts-ignore
                helperText={formErrors.branch_name}
              />
              <TextField
                  label="Dirección Sucursal"
                  variant="filled"
                  onChange={(e) => setBranchAddress(e.target.value)}
                  value={branch_address}
                     // @ts-ignore
                  error={!!formErrors.branch_address}
                     // @ts-ignore
                  helperText={formErrors.branch_address}
                />
                <TextField
                  type='number'
                  label="Capacidad de Personas"
                  variant="filled"
                   // @ts-ignore
                  onChange={(e) => setPeopleCapacity(e.target.value)}
                  value={people_capacity}
                     // @ts-ignore
                  error={!!formErrors.people_capacity}
                     // @ts-ignore
                  helperText={formErrors.people_capacity}
                />
              </>
            )}
            <Button
              variant="contained"
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold"
              onClick={editingBranch ? handleEditBranch : handleAddClick}
              color="primary"
            >
              {editingBranch ? 'Editar' : 'Agregar'}
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
            <Loading />
          </Box>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            slots={{
              toolbar: GridToolbar,
            }}
            getRowId={(row) => row.branch_id}
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
  branch_name: yup
    .string()
    .required('El nombre de la sucursal es obligatorio')
    .min(3, 'El nombre de la sucursal debe tener al menos 3 caracteres')
    .max(25, 'El nombre de la sucursal no puede tener más de 25 caracteres'),
  branch_address: yup
    .string()
    .required('La dirección de la sucursal es obligatoria')
    .min(5, 'La dirección de la sucursal debe tener al menos 5 caracteres')
    .max(30, 'La dirección de la sucursal no puede tener más de 30 caracteres'),
  people_capacity: yup
    .number()
    .required('La capacidad de personas es obligatoria')
    .positive('La capacidad debe ser un número positivo')
    .integer('La capacidad debe ser un número entero'),
});


export default BranchOffices;
