'use client'
import { DataGrid, GridCellParams, GridColDef, GridToolbar, GridValueGetterParams, esES } from '@mui/x-data-grid';
import { Box, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import {ApprovalRounded as ApprovalRoundedIcon, Delete} from '@mui/icons-material';
import styled from '@emotion/styled';
import { useTheme } from '@mui/system';
import Header from '@/app/components/Header/header';
import { tokens } from '@/app/theme';
import {useRouter} from 'next/navigation'
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import { mutate } from 'swr';


const StatusBadge = styled(Typography)(({ theme, completed, courseended }: any) => ({
  display: 'inline-block',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: (() => {
    if (completed >= 7 && courseended) {
      return theme.palette.success.main;
    } else if (completed >= 7 && !courseended) {
      return theme.palette.warning.main;
    } else if (completed < 7 && completed > 0 && courseended) {
      return theme.palette.error.main;
    } else if (completed == 0 && courseended) {
      return theme.palette.grey[500];
    } else if (completed == 0 && !courseended) {
      return theme.palette.warning.main;
    } else {
      return theme.palette.error.main;
    }
  })(),
  color: theme.palette.common.white,
}));

function StudentCertificate({data} : any) {
  const dataWithIds = data.map((item: any, index: any) => ({ ...item, id: index }));
  const router = useRouter()
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(false);

  const  handleGrantCertificate = (enrollmentId: any) => {
    router.push(`/admin/certificate/studentCertificate/${enrollmentId}`)
  };
  
  const columns: GridColDef[] = [
    { field: `id`, headerName: 'Fila ID', width: 70, flex: 1 },
    { field: 'course_id', headerName: 'Curso ID', width: 70, flex: 1 },
    {
      field: 'Nombre Completo Instructor',
      headerName: 'Instructor',
      description: 'Nombre Completo Instructor',
      sortable: false,
      width: 160,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.course.usser.first_name || ''} ${params.row.course.usser.last_name || ''}`,
    },
    {
      field: 'DNI Instructor',
      headerName: 'DNI Instructor',
      width: 160,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.course.usser.dni}`,
    },
    {
      field: 'Categoria Curso',
      headerName: 'Categoria Curso',
      description: 'Categoria Curso',
      sortable: false,
      width: 160,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.course.category_course.category_name}`,
    },
    {
      field: 'Nombre Completo Estudiante',
      headerName: 'Alumno',
      description: 'Nombre Completo Estudiante',
      sortable: false,
      width: 160,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.usser.first_name || ''} ${params.row.usser.last_name || ''}`,
    },
    
    {
      field: 'DNI Alumno',
      headerName: 'DNI Alumno',
      description: 'DNI Alumno',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.usser.dni}`,
    },
    { field: 'completion_status', headerName: 'Estado del Alunno en el Curso', description: 'Estado del Alumno en el Curso', width:180,  renderCell: renderCompletionStatus, valueGetter: (params: GridValueGetterParams) => `${params.row.grade.length > 0  ? params.row.grade[0].value : 0}`
    },
    {
      field: 'certificate_url',
      headerName: 'Certificado',
      width: 150,
      flex: 1,
      renderCell: renderCertificate,
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 100,
      flex: 1,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const completionStatus = params.row.grade.length > 0  ? params.row.grade[0].value : 0;
        const completed = completionStatus >= 7 ? true : false;
        const endDateTimestamp = params.row.course.end_date;
        const endDate = new Date(endDateTimestamp);
        const endDateUTC = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000);
        const courseHasEnded = hasCourseEnded(endDateUTC);
        if (completed && courseHasEnded) {
          return (
            <>
            <IconButton disabled={!completed || !courseHasEnded || params.row.files[0] ? true : false}  color="secondary" onClick={() => handleGrantCertificate(params.row.enrollment_id)}>
              <ApprovalRoundedIcon />
            </IconButton>

            <IconButton className={` ${isLoading ? 'cursor-not-allowed' : ''}`} color='error' disabled={isLoading || params.row.files[0] ? false : true} onClick={() => handleDeleteCertificate(params.row.files[0])}>
              <Delete />
            </IconButton>
            </>
          );
        } else {
          return (
            <IconButton color="error" disabled={params.row.files[0] ? false : true} onClick={() => handleDeleteCertificate(params.row.files[0])}>
            <Delete />
          </IconButton>
          )
        }
      },
    },
  ];

  const hasCourseEnded = (endDate : any) => {
    const currentDate = Date.now(); // Get the current timestamp in milliseconds
    return endDate <= currentDate;
  };

  function renderCompletionStatus(params: GridCellParams) {
    const completionStatus  = params.value as number;
    
    if (data) {
      const endDateTimestamp = data[params.id].course.end_date;
      const endDate = new Date(endDateTimestamp);
      const endDateUTC = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000);
  
      const courseHasEnded = hasCourseEnded(endDateUTC);
      if (completionStatus >= 7 && courseHasEnded) {
        return <StatusBadge completed={completionStatus} courseended={courseHasEnded}>Aprobado</StatusBadge>;
      } else if (completionStatus >= 7 && !courseHasEnded) {
        return <StatusBadge completed={completionStatus} courseended={false}>El curso sigue dictándose</StatusBadge>;
      } else if (completionStatus < 7 && completionStatus > 0 && courseHasEnded) {
        return <StatusBadge completed={completionStatus} courseended={true}>Desaprobado</StatusBadge>;
      } else if (completionStatus == 0 && courseHasEnded) {
        return <StatusBadge completed={completionStatus} courseended={true}>No tiene Nota</StatusBadge>;
      } else if (completionStatus == 0 && !courseHasEnded) {
        return <StatusBadge completed={completionStatus} courseended={false}>El curso sigue dictándose</StatusBadge>;
      }
        else {
        return <StatusBadge completed={completionStatus} courseended={courseHasEnded.toString()}>Desaprobado</StatusBadge>;
      }
    }
    return <StatusBadge completed={false} courseended={false}>Loading...</StatusBadge>;
  }

  function renderCertificate(params: GridCellParams) {
    if(!data[params.id].files[0]) return <StatusBadge completed={0} courseended={true}>No tiene certificado</StatusBadge>;
    const certificateUrl: string | null = params.value as string | null || `${process.env.NEXT_PUBLIC_CDN}/UsersCertificates/${data[params.id].files[0].name}`;
    if (!certificateUrl) {
      return <></>;
    }

    return (
      <div onClick={() => setSelectedCertificate(certificateUrl)}>
        <Image src={`${process.env.NEXT_PUBLIC_CDN}/UsersCertificates/${data[params.id].files[0].name}`} alt="Certificado del Alumno" style={{ cursor: 'pointer' }} width={200} height={200} />
      </div>
    );
  }

  const handleCloseModal = () => {
    setSelectedCertificate(null);
  };

  const handleDeleteCertificate = async (params: GridCellParams) => {
    const confirmed = window.confirm('¿Estás seguro de que desea eliminar el Certificado al Estudiante?');
    if (confirmed) {
      setIsLoading(true);
      try {
        const response = await axios.delete(`/api/certificate/grantStudentCertificate/${params.id}`);
        if(response) {
          toast.success('Se elimino el Certificado correctamente');
          router.refresh();
        }
      } catch (error) {
        toast.error('No se pudo Eliminar el Certificado');
        console.error('Error al eliminar el archivo:', error);
      } finally {
        mutate(`/api/certificate/grantStudentCertificate/${params.id}`);
        setIsLoading(false);
      }
    }
}


  return (
    <Box m="20px">
      <Header
        title="Cursos/Alumnos"
        subtitle="Lista de Alumnos y su estado en los Cursos"
      />
      <Dialog open={!!selectedCertificate} onClose={handleCloseModal} PaperProps={{
        style: {
          maxWidth: '80%', // Adjust the width as needed
        },
        className: 'custom-dialog', // Add a custom class for additional styling if needed
      }}>
        <DialogTitle>Certificado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <img src={selectedCertificate!} alt="Certificado del Alumno" style={{ width: '100%' }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
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
        {/* {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Loading />
          </Box>
        ) : ( */}
          <DataGrid
            rows={dataWithIds}
            columns={columns}
            slots={{
              toolbar: GridToolbar,
            }}
            getRowId={(row) => row.id}
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
      </Box>
    </Box>
  );
}

export default StudentCertificate;
