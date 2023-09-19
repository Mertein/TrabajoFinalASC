import React, { useEffect } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
  editingFaq?: Faq;
  handleSaveEdit: (newFaq: Faq) => void;
  handleCancelEdit: (isCancel: boolean) => void;
}

const FaqForm: React.FC<FaqFormProps> = ({ onSubmit, categories, editingFaq, handleSaveEdit, handleCancelEdit }) => {
  const validationSchema = Yup.object({
    question: Yup.string().required('La Pregunta es obligatoria').min(5,'La Pregunta debe superar los 5 caracteres').max(200, 'La Pregunta no puede superar los 200 caracteres.'),
    answer: Yup.string().required('La Respuesta es obligatoria').max(500, 'La Respuesta no puede superar los 500 caracteres').min(5,'La Respuesta debe superar los 5 caracteres.'),
  });

  const formik = useFormik({
    initialValues: {
      question: editingFaq?.question || '',
      answer: editingFaq?.answer || '',
      category: editingFaq?.category || '',
      newCategory: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('values', values)
      if (editingFaq) {
        if(values.newCategory === '' && values.category === '') {
          toast.error('Debe seleccionar una Categoría existente o crear una nueva')
          return;
        }
        if(values.newCategory.length > 50 && values.category === null) {
          toast.error('La nueva Categoría no puede superar los 50 caracteres.')
          return;
        }
        if(values.newCategory.length < 3 && values.category === null) {
          toast.error('La nueva Categoría debe ser mayor a 3 caracteres.');
          return;
        }
        handleSaveEdit({ ...editingFaq, ...values });
        handleCancelEdit(false); // Agregar esta línea para indicar que no se cancela la edición
      } else {
        if(values.newCategory === '' && values.category === '') {
          toast.error('Debe seleccionar una Categoría existente o crear una nueva')
          return;
        }
        console.log(values.category)

        if(values.newCategory.length > 50 && values.category === '') {
          toast.error('La nueva Categoría no puede superar los 50 caracteres.')
          return;
        }
        if(values.newCategory.length < 3 && values.category === '') {
          toast.error('La nueva Categoría debe ser mayor a 3 caracteres.');
          return;
        }
        onSubmit({ id: 0, ...values });
      }
      formik.resetForm();
    },
  });

  useEffect(() => {
    // Cuando se proporciona un FAQ para editar, rellena los campos con sus valores
    if (editingFaq) {
      formik.setValues({ ...editingFaq, newCategory: '' }); // Reiniciar la nueva categoría
    }
  }, [editingFaq]);

  return (
    <form onSubmit={formik.handleSubmit} className="p-4">
      <TextField
        label="Pregunta"
        variant="filled"
        fullWidth
        name="question"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.question}
        margin="dense"
        error={formik.touched.question && formik.errors.question ? true : false}
        helperText={formik.touched.question && formik.errors.question}
      />
      <TextField
        label="Respuesta"
        variant="filled"
        fullWidth
        multiline
        rows={4}
        name="answer"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.answer}
        margin="dense"
        error={formik.touched.answer && formik.errors.answer ? true : false}
        helperText={formik.touched.answer && formik.errors.answer}
      />
      {categories && categories.length > 0 && (
        <Autocomplete
          value={formik.values.category}
          onChange={(_, newValue) => formik.setFieldValue('category', newValue)}
          options={categories.map(category => category.category)}
          renderInput={(params) => <TextField {...params} label="Categoria Existente" variant='filled' fullWidth margin="dense" />}
          disabled={!!formik.values.newCategory}
        />
      )}
      <TextField
        label="Nueva Categoria"
        variant="filled"
        fullWidth
        name="newCategory"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.newCategory}
        margin="dense"
        disabled={!!formik.values.category}
        error={formik.touched.newCategory && formik.errors.newCategory ? true : false}
        helperText={formik.touched.newCategory && formik.errors.newCategory}
      />
      <Button variant="outlined" color="success" type="submit"  disabled={!formik.isValid}
      >
        {editingFaq ? "Guardar Edición" : "Agregar FAQ"}
      </Button>
      <Button variant="outlined" color="error" onClick={() => { formik.resetForm(); handleCancelEdit(true); }}>
        Cancelar
      </Button>
    </form>
  );
};

export default FaqForm;
