'use client'
import Header from '../../../../components/Header/header';
import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import { tokens } from "../../../../theme";
import { useTheme } from "@mui/material/styles";
import { Visibility as VisibilityIcon, Delete as  DeleteIcon, Edit as EditIcon, Class as ClassIcon, Person as PersonIcon, Grade as GradeIcon, SchoolSharp as SchoolSharpIcon, Close as CloseIcon} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Loading from "../../MyCourses/loading";
import useSWR, { mutate } from "swr";
import { useState } from 'react';
import { set } from 'date-fns';
import "./studentsCourse.css"
export default function StudentsCourses({params} : any) {

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

  const getCellStyleByEstado = (nota: number) => {
    if (Number.isNaN(nota)) {
      return 'sin-nota-cell'; // Clase CSS para celda sin nota
    }
  
    return nota >= 7 ? 'aprobado-cell' : 'desaprobado-cell'; // Clases CSS para celdas aprobadas y desaprobadas
  };
  const fetcherEnrollment = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
  const { data, error, isLoading } = useSWR(`/api/enrollmentCourse/${params}`, fetcherEnrollment)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [gradeStudent, setGradeStudent] = useState<string>('');
  const [enrollmentId, setEnrollmentId] = useState<string>('')
  const [editGradeStudent, setEditGradeStudent] = useState<any>(null);

  const { data: session, status } = useSession() 

//   if (status === "unauthenticated") {
//     alert("No has iniciado sesión");
//     router.push('/')
//   }
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
    const handleClose = () =>  {
      setOpen(false);
      setGradeStudent('');
      setEditGradeStudent('');
      setEnrollmentId('');
    };
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
  
function handleGrade(enrollment_id: any): void {
  const selectedEnrollment = data.find(
    (enrollment : any) => enrollment.enrollment_id === enrollment_id
  );
  const studentGrade = selectedEnrollment;
  const studentGradeNumber = selectedEnrollment?.grade?.[0]?.value || '';

  setEnrollmentId(enrollment_id);
  setGradeStudent(studentGradeNumber);
  setEditGradeStudent(studentGrade);
  handleOpen();
}
console.log('enmrollmentid',enrollmentId)
console.log('gradeStudent',gradeStudent)
console.log('editGradeStudent',editGradeStudent);


function handleAddGradeStudent() {
  const gradeStudentNumber = Number(gradeStudent);
  const enrollmentStudentid = Number(enrollmentId);

  if (!gradeStudentNumber) return toast.error('Ingrese una nota');
  if (gradeStudentNumber > 10 || gradeStudentNumber < 0)
    return toast.error('Ingrese una nota entre 0 y 10');

  setLoading(true);
  console.log('1enrollmentStudentid',enrollmentStudentid)
  console.log('1gradeStudentNumber',gradeStudentNumber)
  console.log('1editGradeStudent',editGradeStudent);
  if (editGradeStudent.grade.length > 0) {
    console.log('entre')
    axios
      .put('/api/grade', {
        value: gradeStudentNumber,
        grade_id: editGradeStudent.grade[0].grade_id,
      })
      .then((response) => {
        setGradeStudent('');
        handleClose();
        toast.success('Nota actualizada con éxito');
        mutate(`/api/enrollmentCourse/${params}`);
      })
      .catch((error) => {
        toast.error('Error al actualizar la nota');
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    axios
      .post('/api/grade', {
        grade: gradeStudentNumber,
        enrollment_id: enrollmentStudentid,
      })
      .then((response) => {
        setGradeStudent('');
        handleClose();
        toast.success('Nota agregada con éxito');
        mutate(`/api/enrollmentCourse/${params}`);
      })
      .catch((error) => {
        toast.error('Error al agregar nota');
      })
      .finally(() => {
        setLoading(false);
      });
  }
}


  const getEstadoByNota = (nota: string | null | undefined) => {
    if (nota === null || nota === undefined) {
      return 'No tiene nota';
    }
    const notaNumber = Number(nota);
    return notaNumber >= 7 ? 'Aprobado' : 'Desaprobado';
  };

  const columns : GridColDef[] = [
    { field: "user_id", headerName: "Alumno ID", flex: 0.5},
    { 
        field: 'Nombre Completo',
        headerName: 'Nombre Completo', 
        description: 'Esta columna no se puede ordenar',
        sortable: false,
        width: 160,
        flex : 1,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.usser.first_name || ''} ${params.row.usser.last_name || ''}`,
      },

      {
        field: 'email',
        headerName: 'Email',
        width: 160,
        flex : 1,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.usser.email}`,
      },
      {
        field: 'Telefono',
        headerName: 'Telefono',
        width: 160,
        flex : 1,
        // flex: 1,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.usser.phone_number}`,
      },
      {
        field: 'DNI',
        headerName: 'DNI',
        width: 160,
        flex : 1,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.usser.dni}`,
      },
      {
        field: 'Nota',
        headerName: 'Nota',
        width: 160,
        flex : 1,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.grade[0]?.value || ''}`,
      },
      {
        field: 'Estado',
        headerName: 'Estado',
        width: 160,
        flex: 1,
        valueGetter: (params: GridValueGetterParams) => {
          const nota = params.row.grade[0]?.value;
          return getEstadoByNota(nota);
        },
        // Propiedad cellClassName para asignar estilos en línea a las celdas
        cellClassName: (params: GridCellParams) => {
          const nota = params.row.grade[0]?.value;
          return getCellStyleByEstado(Number(nota));
        },
      },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 0.5,
      renderCell: (params: GridCellParams) => (
        <>

          <IconButton
            onClick={() => handleGrade(params.row.enrollment_id)}
            color="secondary"
          >
            <SchoolSharpIcon />
          </IconButton>

          <IconButton
            onClick={() => handleDeleteClick(params.row.course_id)}
            color="warning"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  if (error) return <div>failed to load</div>

 

  return (
    <Box m="20px">
      <Header
        title="Alumnos inscriptos en el Curso"
        subtitle="Lista de alumnos"
      />
      <Modal open={open} onClose={handleClose} >
      <Box sx={modalStyle}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h4" className="pb-5 text-center flex-1">
            Otorgar/Editar nota del estudiante
          </Typography>
          <Typography variant="h5" className="pb-5 text-center flex-1">
            <strong>De 0 al 10</strong>
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
              <>
                <TextField
                  type='number'
                  label="Nota del estudiante en el curso"
                  variant="filled"
                  
                  onChange={(e) => setGradeStudent(e.target.value)}
                  value={gradeStudent}
                />
              </>

            <Button
              variant="contained"
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold"
              onClick={handleAddGradeStudent}
              color="primary"
            >
             Agregar
            </Button>
          </Box>
        </Box>
      </Modal>
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
          rows={data}
          columns={columns}
          // slots={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.user_id}
        />}        
      </Box>
    </Box>
  );
};

