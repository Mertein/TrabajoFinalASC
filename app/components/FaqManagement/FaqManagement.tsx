'use client'
import React, { useEffect, useState } from 'react';
import FaqList from './FaqList';
import FaqForm from './FaqForm';
import axios from 'axios';
import useSWR, { mutate } from "swr";
import toast from 'react-hot-toast';
import { AlertTitle, Box } from '@mui/material';
import Header from '../Header/header';
import FaqGraph from './FaqGraph';

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string; // Adding category property
  // Add more properties as needed
}

const FaqManagement = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [editedFaq, setEditedFaq] = useState<Faq | null>(null);
  
  

  const fetcher = (url: any) => axios.get(url).then((res: { data: any; }) => res.data)
  const { data: faqsCategories, error, isLoading } = useSWR('/api/faqs/categories', fetcher)
  const { data: Faqs, error: errorFaqs, isLoading: isLoadingFaqs } = useSWR('/api/faqs', fetcher)

  useEffect(() => {
    if(Faqs) {
      setFaqs(Faqs);
    }
  }, [Faqs]);

  const handleFaqSubmit = async (newFaq: Faq) => {
    console.log('Creando')
    try {
      const response = await axios.post('/api/faqs', newFaq);
      if(response.status === 200){
        toast.success('FAQ agregado exitosamente');
        mutate('/api/faqs');
        setFaqs([...faqs, newFaq]);
      };
    } catch (error) {
      toast.error('Error al agregar FAQ');
    }
  };

  const handleEditFaq = (faq: Faq) => {
    // Setea el FAQ que se está editando en el estado local o donde lo necesites
    setEditingFaq(faq);
  };

  const handleCancelEdit = (isCancel: boolean) => {
    if(isCancel) {
      console.log('Cancelando')
      setEditingFaq(null);
      setEditedFaq(null);
    }
  };

  const [isConfirmationOpen, setConfirmationOpen] = useState(false); // Estado para controlar la apertura del cuadro de confirmación

  // Función para abrir el cuadro de confirmación
  const openConfirmationDialog = () => {
    setConfirmationOpen(true);
  };

  // Función para cerrar el cuadro de confirmación
  const closeConfirmationDialog = () => {
    setConfirmationOpen(false);
  };

  const handleSaveEdit = async (newFaq: Faq) => {
    console.log('Editando')
    try {
      const response = await axios.put(`/api/faqs`, newFaq);
      if (response.status === 200) {
        const updatedFaqs = faqs.map((faq) =>
          faq.id === newFaq?.id ? newFaq : faq
        );
        setFaqs(updatedFaqs);
        setEditingFaq(null);
        setEditedFaq(null);
        toast.success('FAQ editado exitosamente');
      }
    } catch (error) {
      toast.error('Error al editar FAQ');
    }
  };


  const handleDeleteFaq = async (id: number) => {
    try {
      const response = await axios.delete(`/api/faqs/${id}`);
      if(response.status === 200){
        mutate('/api/faqs');
        toast.success('FAQ eliminado exitosamente');
      };
    } catch (error) {
      toast.error('Error al eliminar FAQ');
    }
  };
  

  return (
    <Box m="20px" >
      <Header title="FAQ" subtitle="Administrar las Preguntas Frecuentes" />
      <FaqForm handleCancelEdit={handleCancelEdit} onSubmit={handleFaqSubmit} handleSaveEdit={handleSaveEdit} categories={faqsCategories}  editingFaq={editingFaq || undefined}  />
      <FaqList faqs={faqs} onEditFaq={handleEditFaq} onDeleteFaq={handleDeleteFaq} />
      <FaqGraph />
    </Box>
  );
};

export default FaqManagement;
