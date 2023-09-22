// @ts-nocheck
'use client'
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import Header from "../Header/header";
import { useEffect, useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FaqGraph from "./FaqGraph";
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface Faq {
  faqId: number;
  question: string;
  answer: string;
  category: string;
}

const OneFaqForm = ({faqId} : any) => {
  const fetcher = (url: any) => axios.get(url).then((res: {data: any;}) => res.data)
  const { data: categories, error: errorCategories, isLoading: isLoadingCategories } = useSWR('/api/faqs/categories', fetcher)
  const {data: faq, error, isLoading} = useSWR(`/api/faqs/${faqId.id}`, fetcher)
  const route = useRouter()
  useEffect(() => {
    if(faq) {
      formik.setValues({
        id : faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        newCategory: '',
      })
    }
  }, [faq]);

  const formik = useFormik({
    initialValues: {
      id : faq?.id || '',
      question: faq?.question || '',
      answer: faq?.answer || '',
      category: faq?.category || '',
      newCategory: '',
    },
    validationSchema,
    onSubmit: async (values) => {
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
        try {
          const response = await axios.put(`/api/faqs`, values);
          if (response.status === 200) {
            toast.success('FAQ editado exitosamente');
            mutate('/api/faqs');
            route.push('/admin/faqs')
          }
        } catch (error) {
          toast.error('Error al editar FAQ');
        }
        formik.resetForm();
    },
  });


  return (
    <Box m="20px" >
    <Header title="FAQ" subtitle="Administrar Pregunta Frecuente" />
    <form onSubmit={formik.handleSubmit} className="p-4">
      <div className="p-4">
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
      <Button variant="outlined" type='submit' color="success" disabled={!formik.isValid}>
        Guardar Edición
      </Button>
    </div>
    </form>
    <FaqGraph />
  </Box>
);
}

const validationSchema = Yup.object({
  question: Yup.string().required('La Pregunta es obligatoria').min(5,'La Pregunta debe superar los 5 caracteres').max(200, 'La Pregunta no puede superar los 200 caracteres.'),
  answer: Yup.string().required('La Respuesta es obligatoria').max(500, 'La Respuesta no puede superar los 500 caracteres').min(5,'La Respuesta debe superar los 5 caracteres.'),
});

export default OneFaqForm ;