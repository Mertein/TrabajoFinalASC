'use client'
import { useState } from "react";
import { DataGrid, GridCellParams, GridColDef, GridToolbar, GridValueGetterParams, esES } from '@mui/x-data-grid';
import { Box, Button, IconButton, Modal, TextField, Typography} from '@mui/material';
import {useTheme} from '@mui/system';
import { Delete, Edit } from '@mui/icons-material';
import Loading from '@/app/(views)/instructor/MyCourses/loading';
import Header from '@/app/components/Header/header';
import { tokens } from '@/app/theme';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';
import { format} from 'date-fns';
import { Close as CloseIcon } from "@mui/icons-material";
import * as yup from 'yup';

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
  const [formErrors, setFormErrors] = useState({});
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
  setFormErrors({});
  };

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

  const handleEditCategory = async () => {
    const isValid = await checkoutSchema.isValid({
      category_name: editCategoryName,
      file_category: editImgUrl,
    });

    if (isValid) {
      setIsLoading(true);
      axios
        .put('/api/getCategories', {
          data: {
            category_id: editingCategory.category_id,
            category_name: editCategoryName,
            file_category: editImgUrl,
          },
        })
        .then((response) => {
          setEditingCategory(null);
          setEditCategoryName('');
          setEditImgUrl('');
          handleClose();
          toast.success('Categoría actualizada con éxito');
          mutate('/api/getCategories');
        })
        .catch((error) => {
          toast.error('Error al actualizar la categoría');
        })
        .finally(() => {
          setIsLoading(false);
        });
      setFormErrors({});
    } else {
      try {
        await checkoutSchema.validate(
          { category_name: editCategoryName, file_category: editImgUrl },
          { abortEarly: false }
        );
        setFormErrors({});
      } catch (errors) {
        const newFormErrors = {};
        // @ts-ignore
        errors.inner.forEach((error) => {
          // @ts-ignore
          newFormErrors[error.path] = error.message;
        });
        setFormErrors(newFormErrors);
      }
    }
  };

  const handleEditClick = (id: number): void => {
    const selectedCategory = data.find((category: { category_id: number; }) => category.category_id === id);
    if (selectedCategory) {
      setEditingCategory(selectedCategory);
      setEditCategoryName(selectedCategory.category_name);
      setEditImgUrl(selectedCategory.file_category);
      handleOpen();
    }
  };

  const handleAddClick = async () => {
    const isValid = await checkoutSchema.isValid({category_name: category_name, file_category: imgUrl});
    if (isValid) {
      setIsLoading(true);
      axios
        .post('/api/getCategories', { category_name, imgUrl })
        .then((response) => {
          setCategoryName('');
          setImgUrl('');
          handleClose();
          toast.success('Categoría agregada con éxito');
          mutate('/api/getCategories');
        })
        .catch((error) => {
          toast.error('Error al agregar la categoría');
        })
        .finally(() => {
          setIsLoading(false);
        });
        setFormErrors({});
    } else {
      try {
        await checkoutSchema.validate({category_name: category_name, file_category: imgUrl}, { abortEarly: false });
      } catch (errors : any) {
        const errorMessages = errors.inner.map((error : any) => error.message);
        console.log('Errores de validación creacion:', errorMessages);
        // Puedes mostrar estos mensajes de error al usuario
        const newFormErrors = {};
        errors.inner.forEach((error : any) => {
          // @ts-ignore
          newFormErrors[error.path] = error.message;
        });
        setFormErrors(newFormErrors);
      }
    }
  };

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
                name="category_name"
                // @ts-ignore
                error={!!formErrors.category_name}
                // @ts-ignore
                helperText={formErrors.category_name}
              />
              <TextField
                label="Url Imagen Categoría"
                variant="filled"
                onChange={(e) => setEditImgUrl(e.target.value)}
                value={editImgUrl}
                name="file_category"
                // @ts-ignore
                error={!!formErrors.file_category}
                // @ts-ignore
                helperText={formErrors.file_category}
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
                // @ts-ignore
                error={!!formErrors.category_name}
                // @ts-ignore
                helperText={formErrors.category_name}
              />
              <TextField
                label="Url Imagen Categoría"
                variant="filled"
                onChange={(e) => setImgUrl(e.target.value)}
                value={imgUrl}
                name="file_category"
                // @ts-ignore
                error={!!formErrors.file_category}
                // @ts-ignore
                helperText={formErrors.file_category}
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
            <Loading />
          </Box>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            getRowId={(row) => row.category_id}
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
  category_name: yup.string().required("El nombre de la Categoría es obligatorio").min(3, "El nombre debe tener al menos 3 caracteres").max(20, "El nombre debe tener como maximo 25 caracteres"),
  file_category: yup
  .string()
  .required("La URL de la Categoría es obligatoria")
  .max(200, "La URL debe tener como máximo 200 caracteres") 
  .url("La URL debe ser válida"),
});

export default Categories;




