'use client'
import React, { useEffect, useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import toast from 'react-hot-toast';
interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FaqFormProps {
  onSubmit: (newFaq: Faq) => void;
  categories: {
    category: string;
  }[];
  editingFaq?: Faq; // Objeto FAQ para el modo de edición opcional
  handleSaveEdit: (newFaq: Faq) => void; // Cambiamos el tipo a Faq | null
  handleCancelEdit: (isCancel: boolean) => void;
}

const FaqForm: React.FC<FaqFormProps> = ({ onSubmit, categories, editingFaq, handleSaveEdit, handleCancelEdit }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [questionError, setQuestionError] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [categoryError, setCategoryError] = useState(''); 
  const [formSubmitted, setFormSubmitted] = useState(false); // Estado para controlar si se ha enviado el formulario

  useEffect(() => {
    // Cuando se proporciona un FAQ para editar, rellena los campos con sus valores
    if (editingFaq) {
      setQuestion(editingFaq.question);
      setAnswer(editingFaq.answer);
      setSelectedCategory(editingFaq.category);
      setNewCategory(''); 
      setQuestionError('');
      setAnswerError('');
      setCategoryError('');
    }
  }, [editingFaq]);

  useEffect(() => {
    const isValid  = question && answer && (selectedCategory || newCategory);
    setIsFormValid(!!isValid);
  }, [question, answer, selectedCategory, newCategory]);

  const validateForm = () => {
    let isValid = true;

    if (question.length > 100) {
      setQuestionError('La Pregunta no puede superar los 100 caracteres.');
      isValid = false;
    } else if (question.length < 5) {
      setQuestionError('La Pregunta debe tener al menos 5 caracteres.');
      isValid = false;
    } else {
      setQuestionError('');
    }

    if (answer.length >= 500) {
      setAnswerError('La Respuesta no puede superar los 500 caracteres.');
      isValid = false;
    } else if (answer.length < 5) {
      setAnswerError('La Respuesta debe tener al menos 5 caracteres.');
      isValid = false;
    } else {
      setAnswerError('');
    }

    if (!selectedCategory && newCategory.length === 0) {
      setCategoryError('Selecciona una Categoría Existente o ingresa una Nueva Categoría.');
      isValid = false;
    } else if (newCategory.length > 50) {
      setCategoryError('La Categoría  no puede superar los 50 caracteres.');
      isValid = false;
    } else if (newCategory.length > 0 && newCategory.length < 3) {
      setCategoryError('La Categoría  debe tener al menos 3 caracteres.');
      isValid = false;
    } else {
      setCategoryError('');
    }

    return isValid;
  };

  const handleSubmit = () => {
    setFormSubmitted(true);
    if (validateForm()) {
      if (editingFaq) {
        handleSaveEdit({ id: editingFaq.id, question, answer, category: selectedCategory || newCategory });
      } else {
        onSubmit({ id: 0, question, answer, category: selectedCategory || newCategory });
      }
      setQuestion('');
      setAnswer('');
      setSelectedCategory('');
      setNewCategory('');
    }
  };

  const handleCancel = () => {
    handleCancelEdit(true);
    setQuestion('');
    setAnswer('');
    setSelectedCategory('');
    setNewCategory('');
  };

  return (
    <div className="p-4">
    <TextField
      label="Pregunta"
      variant="filled"
      fullWidth
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      margin="dense"
      error={formSubmitted && !!questionError} // Mostrar error solo si el formulario se ha enviado
      helperText={formSubmitted && questionError} // Mostrar mensaje de error solo si el formulario se ha enviado
      // Mostrar error solo cuando hay un mensaje de error
    />
    <TextField
      label="Respuesta"
      variant="filled"
      fullWidth
      multiline
      rows={4}
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      margin="dense"
      error={formSubmitted && !!answerError} // Mostrar error solo si el formulario se ha enviado
      helperText={formSubmitted && answerError} // Mostrar mensaje de error solo si el formulario se ha enviado
    />
    {categories && categories.length > 0 && (
      <Autocomplete
        value={selectedCategory}
        onChange={(event, newValue) => setSelectedCategory(newValue || '')}
        options={categories.map(category => category.category)}
        renderInput={(params) => <TextField {...params} label="Categoria Existente" variant='filled' fullWidth margin="dense" />}
        disabled={!!newCategory}
      />
    )}
    <TextField
      label="Nueva Categoria"
      variant="filled"
      fullWidth
      disabled={!!selectedCategory}
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      margin="dense"
      error={formSubmitted && !!categoryError} // Mostrar error solo si el formulario se ha enviado
      helperText={formSubmitted && categoryError} // Mostrar mensaje de error solo si el formulario se ha enviado
    />
    <Button variant="outlined" color="success" onClick={handleSubmit} disabled={!isFormValid}>
      {editingFaq ? "Guardar Edición" : "Agregar FAQ"} {/* Cambia el texto del botón según el modo */}
    </Button>
    <Button variant="outlined" color="error" onClick={handleCancel}>
      Cancelar
    </Button>

  </div>
);
};

export default FaqForm;
