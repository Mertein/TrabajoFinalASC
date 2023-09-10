'use client'
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TableSortLabel, Box } from '@mui/material';
import Header from '@/app/components/Header/header';
import useSWR from 'swr';
import axios from 'axios';

interface FeedbackItem {
  id: number;
  usser: {
    email: string;
    first_name: string;
    last_name: string;
  };
  feedback: string;
  faqs: {
    category: string;
    question: string;
    answer: string;
  };
  isLike: boolean;
}

function Feedback() {
  const fetcher = (url: any) => axios.get(url).then((res: { data: any; }) => res.data)
  const { data: feedback, error, isLoading } = useSWR('/api/feedback', fetcher)
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);


  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('isLike'); //// Inicialmente, ordena por la columna "¿Le sirvió?"

  useEffect(() => {
    // Simula una solicitud al servidor para obtener los feedbacks y establecerlos en el estado.
    // Reemplaza esto con tu lógica de obtención de datos reales.
    if(feedback){
      setFeedbacks(feedback)
    }
  }, [feedback]);

  function handleDeleteFeedback(id: Number) {
    // Implementa la lógica para eliminar un feedback por su ID aquí.
    // Puedes hacer una solicitud al servidor para eliminarlo de la base de datos.
    // Por ejemplo, usando Axios o fetch.
    // Actualiza la URL de la API según tu configuración.
    fetch(`/api/feedback/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Elimina el feedback del estado local.
          setFeedbacks((prevFeedbacks) => prevFeedbacks.filter((feedback) => feedback.id !== id));
        }
      })
      .catch((error) => console.error('Error al eliminar el feedback', error));
  }

  const openFeedbackModal = (feedback: React.SetStateAction<FeedbackItem | null>) => {
    setSelectedFeedback(feedback);
  };

  const closeFeedbackModal = () => {
    setSelectedFeedback(null);
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
  };
  

  const getComparator = (property: string) => {
    return (a: { [x: string]: any; faqs: { category: any; question: any; }; usser: { email: any; }; }, b: { [x: string]: any; faqs: { category: any; question: any; }; usser: { email: any; }; }) => {
      const aValue = property === 'faq.category' ? ((a.faqs.category || '') + '').toLowerCase() : 
                     property === 'faq.question' ? ((a.faqs.question || '') + '').toLowerCase() : 
                     property === 'usser.email' ? ((a.usser.email || '') + '').toLowerCase() :
                     ((a[property] || '') + '').toLowerCase();
  
      const bValue = property === 'faq.category' ? ((b.faqs.category || '') + '').toLowerCase() : 
                     property === 'faq.question' ? ((b.faqs.question || '') + '').toLowerCase() : 
                     property === 'usser.email' ? ((b.usser.email || '') + '').toLowerCase() :
                     ((b[property] || '') + '').toLowerCase();
  
      if (property === 'isLike') {
        if (order === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      } else {
        if (order === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
    };
  };
  

  const sortedFeedbacks = feedbacks.sort(getComparator(orderBy));

  return (
    <Box m="20px">
      <Header title="Feedbacks" subtitle="Administrar interacciones con los feedbacks de los usuarios" />
      <TableContainer component={Paper}>
        <Table aria-label="Feedbacks">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'usser.email'}
                  direction={order}
                  onClick={() => handleSort('usser.email')}
                >
                  Usuario
                </TableSortLabel>
              </TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'faq.category'}
                  direction={order}
                  onClick={() => handleSort('faq.category')}
                >
                  Categoría
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'faq.question'}
                  direction={order}
                  onClick={() => handleSort('faq.question')}
                >
                  Pregunta
                </TableSortLabel>
              </TableCell>
              <TableCell>Respuesta</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'isLike'}
                  direction={order}
                  onClick={() => handleSort('isLike')}
                >
                  ¿Le sirvió?
                </TableSortLabel>
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFeedbacks.map((feedback) => (
              <TableRow key={feedback.id} onClick={() => openFeedbackModal(feedback)} style={{ cursor: 'pointer' }}>
                <TableCell>{feedback.usser.email}</TableCell>
                <TableCell>{feedback.feedback}</TableCell>
                <TableCell>{feedback.faqs.category}</TableCell>
                <TableCell>{feedback.faqs.question}</TableCell>
                <TableCell>{feedback.faqs.answer}</TableCell>
                <TableCell>{feedback.isLike === true ? 'Si' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    className='bg-red-500 hover:bg-red-700'
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFeedback(feedback.id);
                    }}
                  >
                    Eliminar
                  </Button>
                  {/* Agrega más botones de administración si es necesario */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para mostrar información completa */}
      <Dialog open={!!selectedFeedback} onClose={closeFeedbackModal} fullWidth>
        <DialogTitle>Información Completa del Feedback</DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <div>
              <p><strong>Correo del Usuario:</strong> {selectedFeedback.usser.email}</p>
              <p><strong>Nombre del Usuario:</strong> {`${selectedFeedback.usser.first_name} ${selectedFeedback.usser.last_name}`}</p>
              <p><strong>Feedback:</strong> {selectedFeedback.feedback}</p>
              <p><strong>Categoría:</strong> {selectedFeedback.faqs.category}</p>
              <p><strong>Pregunta:</strong> {selectedFeedback.faqs.question}</p>
              <p><strong>Respuesta:</strong> {selectedFeedback.faqs.answer}</p>
              <p><strong>¿Le sirvió?</strong> {selectedFeedback.isLike ? 'Sí' : 'No'}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFeedbackModal} color="info" variant='contained' className='bg-blue-500'>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
  );
}

export default Feedback;