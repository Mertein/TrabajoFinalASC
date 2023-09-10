'use client'
import React from 'react';
import { DataGrid, GridCellParams, GridColDef, GridToolbar} from '@mui/x-data-grid';
import { Box, IconButton, colors } from '@mui/material';
import Loading from '@/app/(views)/instructor/MyCourses/loading';
import {useTheme} from '@mui/system';
import { tokens } from '@/app/theme';
import { Delete, Edit } from '@mui/icons-material';
interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FaqListProps {
  faqs: Faq[];
  onEditFaq: (faq: Faq) => void;
  onDeleteFaq: (id: number) => void;
}

const FaqList: React.FC<FaqListProps> = ({ faqs, onEditFaq, onDeleteFaq }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70, flex: 1 },
    { field: 'question', headerName: 'Pregunta', flex : 1,  },
    { field: 'answer', headerName: 'Respuesta',  flex : 1,  },
    { field: 'category', headerName: 'Categoría',  flex : 1, },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      flex : 1,
      renderCell: (params: GridCellParams) => (
        <>
          <IconButton
            onClick={() => onEditFaq(faqs.find(faq => faq.id === params.row.id) as Faq)}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => onDeleteFaq(params.row.id as number)}
            color="secondary"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box
    m="40px 0 0 0"
    flex={1}
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
        rows={faqs}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        autoHeight={true}
      />
  </Box>
  );
};

export default FaqList;
