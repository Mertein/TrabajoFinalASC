'use client'
import { useState } from "react";
import { DataGrid, GridCellParams, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Button, IconButton, Input, Modal, TextField, Typography} from '@mui/material';
import {useTheme} from '@mui/system';
import { Delete, Edit } from '@mui/icons-material';
import Loading from '@/app/(views)/instructor/MyCourses/loading';
import Header from '@/app/components/Header/header';
import { tokens } from '@/app/theme';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';
import { format} from 'date-fns';
import { Close as CloseIcon } from "@mui/icons-material";

 function Categories () {

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
  
  const fetcher = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
  const { data, error, isLoading } = useSWR('/api/getCategories', fetcher)
  const [loading, setIsLoading] = useState(false);
  const [category_name, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [editImgUrl, setEditImgUrl] = useState('');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () =>  {
  setOpen(false);
  setCategoryName('');
  setEditingCategory(null);
  setEditCategoryName('');
  setImgUrl('');
  setEditImgUrl('');
  };

  const { data: session, status } = useSession() 

  if (status === "unauthenticated") {
    alert("No has iniciado sesión");
    router.push('/')
  }


  const handleDeleteClick =  (id: number ): void => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta categoria?');
    setIsLoading(true);
    if (confirmed) {
      axios.delete(`/api/getCategories/${id}`, {
       
      }).then(() => {
        toast.success('Categoría Eliminado con Exito');
        mutate('/api/getCategories');
      })
        .catch((error) => {
          toast.error('Error al eliminar la categoría');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const handleEditCategory = () => {
    setIsLoading(true);
    axios.put('/api/getCategories', {
      data: {
        category_id: editingCategory.category_id,
        category_name: editCategoryName,
        file_category: editImgUrl,
      }
    }).then((response) => {
        setEditingCategory(null);
        setEditCategoryName('');
        setEditImgUrl('');
        handleClose();
        toast.success('Categoría actualizada con éxito');
        // Invalidar la caché y realizar una nueva solicitud para obtener los datos actualizados
        mutate('/api/getCategories');
      })
      .catch((error) => {
        toast.error('Error al actualizar la categoría');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handleEditClick = (id: number): void => {
    const selectedCategory = data.find((category: { category_id: number; }) => category.category_id === id);
    if (selectedCategory) {
      setEditingCategory(selectedCategory);
      setEditCategoryName(selectedCategory.category_name);
      setEditImgUrl(selectedCategory.file_category);
      handleOpen();
    }
  };

  const handleAddClick = () => {
    setIsLoading(true);
    // if (!file) return;
    axios
      .post('/api/getCategories', { category_name, imgUrl })
      .then((response) => {
        setCategoryName('');
        setImgUrl('');
        handleClose();
        toast.success('Categoría agregada con éxito');
        // Invalidar la caché y realizar una nueva solicitud para obtener los datos actualizados
        mutate('/api/getCategories');
      })
      .catch((error) => {
        toast.error('Error al agregar la categoría');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files?.[0]) return;
  //   setFile(e.target.files?.[0]);
  //   console.log(file);
  // };
  
  // const handleFileEditChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files?.[0]) return;
  //   setEditFile(e.target.files?.[0]);
  //   console.log(file);
  // };
  



   
  const columns: GridColDef[] = [
    { field: 'category_id', headerName: 'ID', width: 70,  flex : 1,},
    { 
      field: 'category_name', 
      headerName: 'Nombre Categoria', 
      flex : 1,
    },
    { 
      field: 'created_at', 
      headerName: 'Fecha y hora de Creación', 
      flex : 1,
      valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.created_at), 'HH:mm:ss  dd/MM/yyyy'),
    },
    { 
      field: 'updated_at', 
      headerName: 'Fecha y hora de Actualización', 
      flex : 1,
      valueGetter: (params : GridValueGetterParams)  => params.row.updated_at ?  format(new Date(params.row.updated_at), 'HH:mm:ss  dd/MM/yyyy') : 'N/A',
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex : 1,
      
      renderCell: (params: GridCellParams) => (
        <>
          <IconButton
            onClick={() => handleDeleteClick(params.row.category_id)}
            color="secondary"
          >
            <Delete />
          </IconButton>
  
          <IconButton
            onClick={() => handleEditClick(params.row.category_id)}
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
        title="Mis Categorias"
        subtitle="Lista de mis categorias creados"
      />
      <Button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleOpen}
        color="success"
        disabled={false}
        size="medium"
        variant="contained"
      >
        Agregar Categoría
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h4" component="h2" className="pb-5 text-center flex-1">
            {editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
          {editingCategory && (
            <>
              <TextField
                label="Nombre Categoría"
                variant="filled"
                onChange={(e) => setEditCategoryName(e.target.value)}
                value={editCategoryName}
              />
              <TextField
                label="Url Imagen Categoría"
                variant="filled"
                onChange={(e) => setEditImgUrl(e.target.value)}
                value={editImgUrl}
              />
            </>
          )}
          {!editingCategory && (
            <>
              <TextField
                label="Nombre Categoría"
                variant="filled"
                onChange={(e) => setCategoryName(e.target.value)}
                value={category_name}
              />
              <TextField
                label="Url Imagen Categoría"
                variant="filled"
                onChange={(e) => setImgUrl(e.target.value)}
                value={imgUrl}
              />
            </>
          )}
          <Button
            variant="contained"
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold"
            onClick={editingCategory ? handleEditCategory : handleAddClick}
            color="primary"
          >
            {editingCategory ? 'Editar' : 'Agregar'}
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
    components={{ Toolbar: GridToolbar }}
    getRowId={(row) => row.category_id}
    autoHeight={true}
  />
)} 
      </Box>
    </Box>
  );

}

export default Categories;




