'use client'
import { Box, Button, Input, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from '../Header/header'
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const Form = ({ user }: any) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState(
    user?.files && user.files[0]
      ? `/Users/ProfilePicture/${user.files[0].name}`
      : '/images/defaultProfile.jpg'
  );
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const handleFormSubmit = async (values: any) => {
    console.log(values);
    try {
      const res = await axios.put(`/api/users/userProfile`, { values });
      console.log(res);

      if (res.status === 200) {
        console.log("Usuario actualizado con éxito");
        toast.success("Usuario actualizado con éxito");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el usuario");
    }
  };

  const { data: session, status } = useSession()
  if (status === "unauthenticated") {
    alert("No has iniciado sesión");
    router.push('/')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    console.log(file);
    try {
      const data = new FormData();
      data.set("file", file);
      data.set('id', user?.user_id)
      const res = await fetch("/api/users/userProfile", {
        method: "POST",
        body: data,
      });
      console.log(res);
      console.log(res.ok)
      if (res.ok) {
        console.log("File uploaded successfully");
        toast.success("Foto de perfil actualizado correctamente");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la foto de perfil");
    }
  };

  const onChange = (e: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result as string);
      }
    };

    if (e.target.files) {
      setAvatar(e.target.files[0]);
      setFile(e.target.files[0])
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const initialValues = {
    user_id: user?.user_id as number,
    firstName: user?.first_name as string,
    lastName: user?.last_name as string,
    email: user?.email as string,
    password: '',
    phone_number: user?.phone_number as number,
    emergency_contact: user?.emergency_contact as number,
    address: user?.address as string,
    date_of__birth: user?.date_of__birth.substr(0, 10),
    gender: user?.gender as string,
    dni: user?.dni as number,
  };

  return (
    <Box m="20px">
      <Header title="Mi Perfil" subtitle="Editar mi Perfil" />

      <form onSubmit={handleSubmit}>
        <div className="mb-4 col">
          <div className="mb-4 flex flex-col items-center md:flex-row">
            <div className="flex items-center justify-center flex-col mb-4 space-x-3 mt-4 cursor-pointer md:w-1/5 lg:w-1/4">
              <p className="text-lg font-semibold mb-2">Avatar</p>
              <label htmlFor="avatarInput" className="relative cursor-pointer">
                <div
                  className="w-40 h-40 rounded-full bg-center bg-cover relative"
                  style={{
                    backgroundImage: `url(${avatarPreview})`,
                  }}
                  onClick={onChange}
                >
                  <div className="absolute inset-0 bg-black opacity-30 rounded-full transition-opacity  hover:opacity-100"></div>
                  <div className="absolute inset-0 flex items-center justify-center w-full h-full text-white opacity-0 hover:opacity-100">
                    Cambiar Imagen
                  </div>
                </div>
              </label>
              <Button
                variant="outlined"
                color="warning" 
                className="mt-2"
                type='submit'
                // onClick={handleSaveChanges}
              >
                Guardar Foto de Perfil
              </Button>
            </div>
            <div className="md:w-2/3 lg:w-80">
              <input
                className="form-control block w-full px-2 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mt-6"
                type="file"
                id="avatarInput"
                onChange={onChange}
                style={{ display: 'none' }}
              />
            </div>
        </div>
      </div>
      </form>
      

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        enableReinitialize={true}
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
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Primer nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Segundo nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dirección/Domicilio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de Nacimiento"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date_of__birth}
                name="date_of__birth"
                error={!!touched.date_of__birth && !!errors.date_of__birth}
                // helperText={touched.date_of__birth && errors.date_of__birth}
                sx={{ gridColumn: "span 4" }}
              />
               <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Numero de Telefono"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone_number}
                name="phone_number"
                error={!!touched.phone_number && !!errors.phone_number}
                helperText={touched.phone_number && errors.phone_number}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Contacto de Emergencia"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.emergency_contact}
                name="emergency_contact"
                error={!!touched.emergency_contact && !!errors.emergency_contact}
                helperText={touched.emergency_contact && errors.emergency_contact}
                sx={{ gridColumn: "span 4" }}
              />
                <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Genero"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.gender}
                name="gender"
                error={!!touched.gender && !!errors.gender}
                helperText={touched.gender && errors.gender}
                sx={{ gridColumn: "span 4" }}
              />
                <TextField
                fullWidth
                variant="filled"
                type="number"
                label="D.N.I"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dni}
                name="dni"
                error={!!touched.dni && !!errors.dni}
                helperText={touched.dni && errors.dni}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password" // Cambiado a tipo contraseña
                label="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            

            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="outlined" disabled={!user}>
                Guardar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("Este campo es requerido"),
    lastName: yup.string().required("Este campo es requerido"),
    email: yup.string().email("Email inválido").required("Este campo es requerido"),
    phone_number: yup
      .string()
      .matches(phoneRegExp, "Número de teléfono inválido")
      .required("Este campo es requerido"),
    address: yup.string().required("Este campo es requerido"),
    date_of__birth: yup.date().required("Este campo es requerido"),
    emergency_contact: yup
      .string()
      .matches(phoneRegExp, "Número de contacto de emergencia inválido")
      .required("Este campo es requerido"),
    gender: yup.string().required("Este campo es requerido"),
    dni: yup.number().required("Este campo es requerido"),
  // ... otras reglas de validación ...
  });

export default Form;