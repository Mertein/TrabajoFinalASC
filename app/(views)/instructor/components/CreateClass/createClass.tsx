'use client'
import {FormControlLabel,  Box, Button, CardMedia, FormControl, InputLabel, TextField, Select, MenuItem, Autocomplete, Fab, Input, Checkbox, FormHelperText, IconButton} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Form, Formik } from "formik";
import { ChangeEvent, FormEvent, useState} from "react";
import * as yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import Header from "../../../../components/Header/header";
import { useSession } from "next-auth/react";
import {Close as CloseIcon, Description} from '@mui/icons-material';





interface CreateClass {  
  description_class: string;
  course_id: number;
  isVirtual: boolean;
  start_time: string;
  end_time: string;
}


const ClassForm =  () => {
  const { data: session } = useSession();

  if (session) {
    // El usuario ha iniciado sesión, puedes acceder a session.user.id
    // const userId = session.user.id;
    // console.log(userId);
    // console.log(session);
    // Resto de tu lógica con el ID del usuario...
  }
  const [file, setFile] = useState<File | undefined>();
  const isNonMobile = useMediaQuery("(min-width:600px)");
 
  const handleFormSubmit =  (data: any) : any  => {
    let error = 0;
    // if(schedule.day_of_week === '' || schedule.start_time === '' || schedule.end_time === ''){
    //   error =+ 1;
    // };

    // if (error > 0) {
    //   error = 0;
    //   return toast.error('Debe completar todos los campos de horario');
    // }
    // data.schedule = schedule;
    axios.post('/api/CreateClass', data)
    .then(() => {
      toast.success('Curso Creado con Exito');
    })
    .catch((error) => {
      toast.error('Error al crear el curso');
    });

  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/certificate", {
        method: "POST",
        body: data,
      });
      console.log(res);

      if (res.ok) {
        console.log("File uploaded successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files?.[0]);
  };


const initialValues: CreateClass = {
  description_class: "",
  course_id: 0,
  isVirtual: false,
  start_time: "",
  end_time: "",
};
  return (
    
    <Box m="20px" >
      <Header title="Crear Clase" subtitle="Cree una nueva clase para el curso" />
  
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              flexDirection="column"

              gap="50px"
              
              gridTemplateColumns="repeat(, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                multiline
                rows={4}
                type="text"
                label="Descripción de la Clase"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description_class}
                name="description_class"
                error={!!touched.description_class && !!errors.description_class}
                helperText={touched.description_class && errors.description_class}
                size="medium"
                sx={{ gridColumn: "span 4", width: '500px' }}
              />
                <Box>
                <FormControl fullWidth  variant="filled" sx={{  mr: 2, maxWidth: "150px" }}>
                <TextField
                fullWidth
                variant="filled"
                type="time"
                label="Horario de inicio de la Clase"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.start_time}
                name="start_time"
                error={!!touched.start_time && !!errors.start_time}
                helperText={touched.start_time && errors.start_time}
              />
               </FormControl>
               <FormControl fullWidth  variant="filled" sx={{  mr: 2, maxWidth: "150px" }}>
              <TextField
                fullWidth
                variant="filled"
                type="time"
                label="Horario de finalización de la Clase"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.end_time}
                name="end_time"
                error={!!touched.end_time && !!errors.end_time}
                helperText={touched.end_time && errors.end_time}
              />      
               </FormControl>
               <FormControlLabel
                  control={
                    <Checkbox
                      color="success"
                      checked={values.isVirtual}
                      onChange={handleChange}
                      name="isVirtual"
                    />
                  }
                  label="Es Virtual?"
                  labelPlacement="start"
                />
              </Box>
              
              <Box>
              <h1 className="text-3xl text-left my-4">Cargar Power Points</h1>
                <form onSubmit={handleSubmit}>
                  <input
                    type="file"
                    multiple={true}
                    className="bg-zinc-900 text-zinc-100 p-2 rounded block mb-2"
                    onChange={handleFileChange}
                  />
              <h1 className="text-3xl text-left my-4">Cargar Videos</h1>
                  <input
                    type="file"
                    multiple={true}
                    className="bg-zinc-900 text-zinc-100 p-2 rounded block mb-2"
                    onChange={handleFileChange}
                  />

                  {/* <button
                    className="bg-green-900 text-zinc-100 p-2 rounded block w-full disabled:opacity-50"
                    disabled={!file}
                  >
                    Cargar
                  </button> */}
                </form>
              </Box>

            </Box>
            <Box display="flex" justifyContent="flex-start" mt="50px">
              <Button  type="submit" color="secondary"   >
                Crear Clase
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};




const checkoutSchema = yup.object().shape({
  description_class: yup.string().required("La descripción de la Clase es requerida"),
  start_time: yup.string().required("La Hora de inicio es requerida"),
  end_time: yup.string().required("La Hora de finalización es requerida"),
  course_id: yup.number().required("El ID de usuario es requerido"),
  isVirtual: yup.boolean().required("El modo de la clase es requerido"),
});

export default ClassForm;