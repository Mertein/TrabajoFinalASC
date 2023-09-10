'use client'
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import Header from "../Header/header";
import question from "../Question/question";
import { useEffect, useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FaqGraph from "./FaqGraph";

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
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const route = useRouter()
  useEffect(() => {
    if(faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setSelectedCategory(faq.category);
    }
  }, [faq]);

  const handleSubmit = async () => {
    try {

      const dataToSend = {
        id: faqId.id,
        category: selectedCategory || newCategory,
        question: question,
        answer: answer
      };
      const response = await axios.put(`/api/faqs`, dataToSend);
      if(response.status === 200){
        toast.success('FAQ agregado exitosamente');
        mutate('/api/faqs');
        route.push('/admin/faqs')
      };
    } catch (error) {
      toast.error('Error al agregar FAQ');
    }
  };
  console.log('Datos',faq)

  return (
    <Box m="20px" >
    <Header title="FAQ" subtitle="Administrar Pregunta Frecuente" />
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
          options={categories.map((category: { category: any; }) => category.category)}
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
        "Guardar Edición" 
      </Button>
    </div>
    <FaqGraph />
  </Box>
);
}
 
export default OneFaqForm ;