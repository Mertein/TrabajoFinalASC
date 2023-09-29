'use client'
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams, esES} from '@mui/x-data-grid';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField, Typography} from '@mui/material';
import {useTheme} from '@mui/system';
import Header from '@/app/components/Header/header';
import { tokens } from '@/app/theme';
import { Close as CloseIcon } from "@mui/icons-material";
import { format } from "date-fns";


function Auditoria({ data }: { data: any }) {
  const [selectedTable, setSelectedTable] = useState("courseHist");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [filteredData, setFilteredData] = useState(data[selectedTable]);
  const [operationFilter, setOperationFilter] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
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
  ];

  const handleRowClick = (params: any) => {
  const cOperation = params.row.c_operation;
  let actionLabel = cOperation;

  if (cOperation === 'U') {
    actionLabel = 'Actualización';
  } else if (cOperation === 'D') {
    actionLabel = 'Borrado';
  }
  setSelectedRowData({...params.row, c_operation: actionLabel});
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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const idFieldMapping: Record<string, string> = {
    courseHist: 'course_id_hist',
    branchOfficeHist: 'branch_id_hist',
    categoryHist: 'category_id_hist',
    enrollmentHist: 'enrollment_id_hist',
    fileHist: 'id_hist',
    gradeHist: 'grade_id_hist',
    paymentHist: 'payment_id_hist',
    schedulesHist: 'schedule_id_hist',
    userRolHist: 'user_rol_id',
  };

  const getColumnsForTable = (table: string): GridColDef[] => {
    switch (table) {
      case "courseHist":
        return [
          { field: 'course_id_hist', headerName: 'ID', width: 100 },
          { field: 'course_id', headerName: 'ID de Curso', width: 100 },
          { field: 'course_name', headerName: 'Nombre del Curso', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const cOperation = params.row.c_operation;
            if (cOperation === 'U') {
              return 'Actualización';
            } else if (cOperation === 'D') {
              return 'Borrado';
            }
            return '';
          }},
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          { field: 'start_date', headerName: 'Fecha Inicio', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const startDate = params.row.start_date;
            if (startDate) {
              return format(new Date(startDate), 'HH:mm:ss dd/MM/yyyy');
            }
            return ''; // O un valor predeterminado si start_date es nulo
          },},
          { field: 'end_date', headerName: 'Fecha Fin', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const endDate = params.row.end_date;
            if (endDate) {
              return format(new Date(endDate), 'HH:mm:ss dd/MM/yyyy');
            }
            return ''; // O un valor predeterminado si start_date es nulo
          },},
        ];
      case "categoryHist":
        return [
          {field : 'category_id_hist', headerName: 'ID', width: 100},
          { field: 'category_id', headerName: 'ID de Categoría', width: 100 },
          { field: 'category_name', headerName: 'Nombre de la Categoría', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const cOperation = params.row.c_operation;
            if (cOperation === 'U') {
              return 'Actualización';
            } else if (cOperation === 'D') {
              return 'Borrado';
            }
            return '';
          }},
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
        ];

      case "branchOfficeHist":
        return [
          {field : 'branch_id_hist', headerName: 'ID', width: 100}, 
          { field: 'branch_id', headerName: 'ID de Sucursal', width: 100 },
          { field: 'branch_name', headerName: 'Nombre de la Sucursal', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const cOperation = params.row.c_operation;
            if (cOperation === 'U') {
              return 'Actualización';
            } else if (cOperation === 'D') {
              return 'Borrado';
            }
            return '';
          }},
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
        ];
      case "enrollmentHist":
        return [
          {field : 'enrollment_id_hist', headerName: 'ID', width: 100},
          { field: 'enrollment_id', headerName: 'ID de Inscripción', width: 100 },
          { field: 'c_operation', headerName: 'Accion', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const cOperation = params.row.c_operation;
            if (cOperation === 'U') {
              return 'Actualización';
            } else if (cOperation === 'D') {
              return 'Borrado';
            }
            return '';
          }},
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
          {field: 'completion_status', headerName: 'Completado', flex: 1},
          {field: 'payment_status', headerName: 'Estado de Pago', flex: 1},
          {field: 'enrollment_date', headerName: 'Fecha de Inscripción', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.created_at), 'HH:mm:ss  dd/MM/yyyy'),},
          {field: 'user_id', headerName: 'ID de Usuario', flex: 1},
          {field: 'course_id', headerName: 'ID de Curso', flex: 1},
          {field: 'feedback', headerName: 'Feedback', flex: 1},
        ];
      case "fileHist":
        return [
          { field: 'id_hist', headerName: 'ID de Archivo', width: 100 },
          { field: 'name', headerName: 'Nombre del Archivo', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const cOperation = params.row.c_operation;
            if (cOperation === 'U') {
              return 'Actualización';
            } else if (cOperation === 'D') {
              return 'Borrado';
            }
            return '';
          }},
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
        ];
      case "gradeHist":
        return [
          {field : 'grade_id_hist', headerName: 'ID', width: 100},
          { field: 'grade_id', headerName: 'ID de Calificación', width: 100 },
          { field: 'grade', headerName: 'Calificación', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const cOperation = params.row.c_operation;
            if (cOperation === 'U') {
              return 'Actualización';
            } else if (cOperation === 'D') {
              return 'Borrado';
            }
            return '';
          }},
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
        ];
      case "paymentHist":
        return [
          {field : 'payment_id_hist', headerName: 'ID', width: 100},
          { field: 'payment_id', headerName: 'ID de Pago', width: 100 },
          { field: 'payment_date', headerName: 'Fecha de Pago', flex: 1 },
          { field: 'payment_amount', headerName: 'Monto', flex: 1 },
          { field: 'payment_method', headerName: 'Método de Pago', flex: 1 },
          { field: 'payment_status', headerName: 'Estado de Pago', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const cOperation = params.row.c_operation;
            if (cOperation === 'U') {
              return 'Actualización';
            } else if (cOperation === 'D') {
              return 'Borrado';
            }
            return '';
          }},
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
        ];
      case "schedulesHist":
        return [
          {field : 'schedule_id_hist', headerName: 'ID', width: 100},
          { field: 'schedule_id', headerName: 'ID de Horario', width: 100 },
          { field: 'start_time', headerName: 'Hora de Inicio', flex: 1 },
          { field: 'end_time', headerName: 'Hora de Fin', flex: 1 },
          { field: 'c_operation', headerName: 'Accion', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const cOperation = params.row.c_operation;
            if (cOperation === 'U') {
              return 'Actualización';
            } else if (cOperation === 'D') {
              return 'Borrado';
            }
            return '';
          }},
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
        ];
      case "userRolHist":
        return [
          {field : 'user_rol_id', headerName: 'ID', width: 100},
          { field: 'user_id_hist', headerName: 'ID de Usuario', width: 100 },
          { field: 'rol_id_hist', headerName: 'ID de Rol', width: 100 },
          { field: 'c_operation', headerName: 'Accion', flex: 1, valueGetter: (params: GridValueGetterParams) => {
            const cOperation = params.row.c_operation;
            if (cOperation === 'U') {
              return 'Actualización';
            } else if (cOperation === 'D') {
              return 'Borrado';
            }
            return '';
          }},
          { field: 'd_operation', headerName: 'Fecha de Operación', flex: 1, valueGetter: (params : GridValueGetterParams) => format(new Date(params.row.d_operation), 'HH:mm:ss  dd/MM/yyyy'),},
          { field: 'c_user_operation', headerName: 'Usuario', flex: 1 },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    // Actualizar los datos filtrados cuando cambian las fechas, la tabla seleccionada o el tipo de operación
    const filtered = data[selectedTable].filter((item: any) => {
      const itemCreatedAt = new Date(item.created_at).getTime();
      const filterStartDate = startDate ? new Date(startDate).getTime() : Number.MIN_VALUE;
      const filterEndDate = endDate ? new Date(endDate).getTime() : Number.MAX_VALUE;
      const isOperationMatch = !operationFilter || item.c_operation === operationFilter;
      return itemCreatedAt >= filterStartDate && itemCreatedAt <= filterEndDate && isOperationMatch;
    });
  
    setFilteredData(filtered);
  }, [startDate, endDate, selectedTable, operationFilter]);
  


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
    <FormControl variant="filled" sx={{ mt: 2, mr: 1}}>
      <InputLabel htmlFor="table-select">Tabla</InputLabel>
      <Select
        value={selectedTable}
        onChange={(event) => setSelectedTable(event.target.value)}
        label="Tabla"
        variant="filled"
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
    <TextField
        label="Fecha de Inicio"
        type="date"
        variant='filled'
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ mt: 2, width: 200 }} 
      />
      <TextField
        label="Fecha de Fin"
        type="date"
        variant='filled'
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ mt: 2, ml: 1, width: 200 }}   
      />
      <FormControl variant="filled" sx={{ mt: 2, ml: 1, width: 200}}>
        <InputLabel htmlFor="operation-select">Tipo de Operación</InputLabel>
        <Select
          value={operationFilter}
          onChange={(event) => setOperationFilter(event.target.value as string)}
          label="Tipo de Operación"
          variant="filled"
          inputProps={{
            name: "operation",
            id: "operation-select",
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="U">Actualización</MenuItem>
          <MenuItem value="D">Borrado</MenuItem>
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
          slots={{
            toolbar: GridToolbar,
          }}
          getRowId={(row) => row[idFieldMapping[selectedTable]]}
          autoHeight={true}
          onRowClick={handleRowClick} 
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

export default Auditoria;



