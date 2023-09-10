'use client'
import React, { useEffect, useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
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

  useEffect(() => {
    // Cuando se proporciona un FAQ para editar, rellena los campos con sus valores
    if (editingFaq) {
      setQuestion(editingFaq.question);
      setAnswer(editingFaq.answer);
      setSelectedCategory(editingFaq.category);
    }
  }, [editingFaq]);

  const handleSubmit = () => {
    if (editingFaq) {
      handleSaveEdit({ id: editingFaq.id, question, answer, category: selectedCategory || newCategory });
    } else {
      // Estás agregando una nueva FAQ
      onSubmit({ id: 0, question, answer, category: selectedCategory || newCategory });
    }
    // Restablece los campos después de enviar
    setQuestion('');
    setAnswer('');
    setSelectedCategory('');
    setNewCategory('');
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
    />
    <Button variant="outlined" color="success" onClick={handleSubmit}>
      {editingFaq ? "Guardar Edición" : "Agregar FAQ"} {/* Cambia el texto del botón según el modo */}
    </Button>
    <Button variant="outlined" color="error" onClick={handleCancel}>
      Cancelar
    </Button>

  </div>
);
};

export default FaqForm;
