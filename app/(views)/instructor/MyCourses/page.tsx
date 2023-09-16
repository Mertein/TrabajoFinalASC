'use client'
import Header from '../../../components/Header/header';
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef, GridToolbar, GridValueGetterParams } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";
import { Visibility, Delete, Edit, Class, Person } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Loading from "./loading";
import useSWR, { mutate } from "swr";
import { useState } from 'react';

export default function MyCoursesPage() {

  const fetcher = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
  const { data, error, isLoading } = useSWR('/api/getMyCourses', fetcher)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const { data: session, status } = useSession() 

  if (status === "unauthenticated") {
    alert("No has iniciado sesión");
    router.push('/')
  }


  const handleDeleteClick =  (id: number ) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este Curso?');
    if (confirmed) {
      axios.delete(`/api/deleteCourse/${id}`, {
      }).then(() => {
        toast.success('Curso Eliminado con Exito');
        mutate('/api/getMyCourses');
      })
        .catch((error) => {
          toast.error('No se pudo eliminar el curso');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }


  const handleCourseClick = (id: number) => {
    router.push(`/instructor/viewCourses/${id}`)
  }
  
  const handleClassClick = (id: number) => {
    router.push(`/instructor/MyCourses//${id}`)
  }
  
  
function handleSchedule(course_id: any): void {
  router.push(`/instructor/Grades/${course_id}`)
}

const handleEditClick = (id: number) => {
  router.push(`/instructor/modifyCourse/${id}`)
}
  

  const columns : GridColDef[] = [
    { field: "course_id", headerName: "Course ID", flex: 0.5},
    {
      field: "course_name",
      headerName: "Nombre del Curso",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "category_course.category_name",
      headerName: "Categoria",
      flex: 1,
      cellClassName: "name-column--cell",
      valueGetter: (params : GridValueGetterParams) => params.row.category_course.category_name,
    },
    {
      field: "branch_offices.branch_name",
      headerName: "Sucursal",
      flex: 1,
      cellClassName: "name-column--cell",
      valueGetter: (params: GridValueGetterParams) => params.row.branch_offices.branch_name,
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <>

          <IconButton
            onClick={() => handleSchedule(params.row.course_id)}
            color="secondary"
          >
            <Person />
          </IconButton>
         
          
          <IconButton color='warning'
            onClick={() => handleClassClick(params.row.course_id)}
          >
            <Class />
          </IconButton>

          <IconButton
            onClick={() => handleCourseClick(params.row.course_id)}
            color="inherit"
          >
            <Visibility />
          </IconButton>
          
          <IconButton color='info'
            onClick={() => handleEditClick(params.row.course_id)}
          >
            <Edit />
          </IconButton>

          <IconButton
            onClick={() => handleDeleteClick(params.row.course_id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];
  if (error) return <div>failed to load</div>

  return (
    <Box m="20px">
      <Header
        title="Mis Cursos"
        subtitle="Lista de mis cursos creados"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
        {isLoading
          ? <Loading/>: 
          <DataGrid
          density='comfortable'
          rows={data}
          columns={columns}
          slots={{
            toolbar: GridToolbar,
          }}
          getRowId={(row) => row.course_id}
        />}        
      </Box>
    </Box>
  );
};

