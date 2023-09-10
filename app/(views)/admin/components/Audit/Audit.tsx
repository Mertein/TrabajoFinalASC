'use client'
import { useState } from "react";
import { DataGrid, GridColDef, GridRowParams, GridToolbar, GridValueGetterParams} from '@mui/x-data-grid';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Table, TableBody, TableCell, TableRow, TextField, Typography} from '@mui/material';
import {useTheme} from '@mui/system';
import Header from '@/app/components/Header/header';
import { tokens } from '@/app/theme';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Close as CloseIcon } from "@mui/icons-material";
import { format } from "date-fns";




function Auditoria({ data }: { data: any }) {
  const [selectedTable, setSelectedTable] = useState("courseHist");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const filteredData = data[selectedTable];
  const tableOptions = [
    { value: 'courseHist', label: 'Historial de Cursos'},
    { value: 'branchOfficeHist', label: 'Historial de Sucursales'},
    { value: "categoryHist", label: "Historial de Categorías" },
    { value: "enrollmentHist", label: "Historial de Inscripciones" },
    { value: "fileHist", label: "Historial de Archivos" },
    { value: "gradeHist", label: "Historial de Calificaciones"},
    { value: "paymentHist", label: "Historial de Pagos"},
    { value: "schedulesHist", label: "Historial de Horarios" },
    { value: "userRolHist", label: "Historial de Roles de Usuario"},
    // ... (agregar más opciones si es necesario)
  ];

  const handleRowClick = (params: any) => {
    console.log(params)
    setSelectedRowData(params.row);
    handleOpen();
  };

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
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: session, status } = useSession() 

  if (status === "unauthenticated") {
    alert("No has iniciado sesión");
    router.push('/')
  }

  const idFieldMapping: Record<string, string> = {
    courseHist: 'course_id_hist',
    branchOfficeHist: 'branch_id_hist',
    categoryHist: 'category_id',
    enrollmentHist: 'enrollment_id',
    fileHist: 'id_hist',
    gradeHist: 'grade_id_hist',
    paymentHist: 'payment_id_hist',
    schedulesHist: 'schedule_id_hist',
    userRolHist: 'user_id_hist',
  };

  const getColumnsForTable = (table: string): GridColDef[] => {
    // Define las columnas correspondientes a la tabla seleccionada
    switch (table) {
      case "courseHist":
        return [
          { field: 'course_id', headerName: 'ID de Curso', width: 100 },
          { field: 'course_name', headerName: 'Nombre del Curso', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1 },
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          { field: 'start_date', headerName: 'Fecha Inicio', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.start_date), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'end_date', headerName: 'Fecha Fin', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.end_date), 'HH:mm:ss  dd/MM/yyyy'),},
          // ... (otras columnas específicas para cursos)
        ];
      case "categoryHist":
        return [
          { field: 'category_id', headerName: 'ID de Categoría', width: 100 },
          { field: 'category_name', headerName: 'Nombre de la Categoría', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1 },
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          // ... (otras columnas específicas para categorías)
        ];

      case "branchOfficeHist":
        return [
          { field: 'branch_id_hist', headerName: 'ID de Sucursal', width: 100 },
          { field: 'branch_name', headerName: 'Nombre de la Sucursal', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1 },
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          // ... (otras columnas específicas para sucursales)
        ];
      case "enrollmentHist":
        return [
          { field: 'enrollment_id', headerName: 'ID de Inscripción', width: 100 },
          { field: 'c_operation', headerName: 'Accion', flex: 1 },
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          // ... (otras columnas específicas para inscripciones)
        ];
      case "fileHist":
        return [
          { field: 'id_hist', headerName: 'ID de Archivo', width: 100 },
          { field: 'file_name', headerName: 'Nombre del Archivo', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1 },
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          // ... (otras columnas específicas para archivos)
        ];
      case "gradeHist":
        return [
          { field: 'grade_id', headerName: 'ID de Calificación', width: 100 },
          { field: 'grade', headerName: 'Calificación', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1 },
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          // ... (otras columnas específicas para calificaciones)
        ];
      case "paymentHist":
        return [
          { field: 'payment_id', headerName: 'ID de Pago', width: 100 },
          { field: 'payment_date', headerName: 'Fecha de Pago', flex: 1 },
          { field: 'payment_amount', headerName: 'Monto', flex: 1 },
          { field: 'payment_method', headerName: 'Método de Pago', flex: 1 },
          { field: 'payment_status', headerName: 'Estado de Pago', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1 },
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          // ... (otras columnas específicas para pagos)
        ];
      case "schedulesHist":
        return [
          { field: 'schedule_id', headerName: 'ID de Horario', width: 100 },
          { field: 'schedule_start_time', headerName: 'Hora de Inicio', flex: 1 },
          { field: 'schedule_end_time', headerName: 'Hora de Fin', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1 },
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          // ... (otras columnas específicas para horarios)
        ];
      case "userRolHist":
        return [
          { field: 'user_id_hist', headerName: 'ID de Usuario', width: 100 },
          { field: 'rol_id_hist', headerName: 'ID de Rol', width: 100 },
          { field: 'rol_name', headerName: 'Nombre de Rol', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1 },
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
        ];
      default:
        return [];
    }
  };

  const columns: GridColDef[]= getColumnsForTable(selectedTable);
    return (
    <Box m="20px">
      <Header
        title="Auditoria"
        subtitle="Historial de cambios en la base de datos"
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: '50%' }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedRowData && (
            <Box p={2}>
              <Typography variant="h5">Detalles de la fila seleccionada:</Typography>
              {Object.entries(selectedRowData).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key}:</strong> {String(value)}
                </Typography>
              ))}
            </Box>
          )}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Button
              variant="contained"
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold"
              color="primary"
              onClick={handleClose}
            >
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    <FormControl variant="outlined" sx={{ m: 2 }}>
      <InputLabel htmlFor="table-select">Tabla</InputLabel>
      <Select
        value={selectedTable}
        onChange={(event) => setSelectedTable(event.target.value)}
        label="Tabla"
        inputProps={{
          name: "table",
          id: "table-select",
        }}
      >
        {tableOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
  </FormControl>
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
   <DataGrid
          rows={filteredData}
          columns={columns}
          components={{
            Toolbar: GridToolbar,
          }}
          getRowId={(row) => row[idFieldMapping[selectedTable]]}
          autoHeight={true}
          onRowClick={handleRowClick} // Agregar el manejador de clic en fila
        />
      </Box>
    </Box>
  );

}

export default Auditoria;



