'use client';

import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  FieldValues, 
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./modal";
import Input from "../Inputs/input";
import Heading from "../Heading/heading";

const RegisterModal= () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      date_of_birth:'',
      address:'',
      phone_number:'',
      // emergency_contact:'',
      // gender:'',
      dni: '',
    },
    // @ts-ignore
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/register', data)
    .then(() => {
      toast.success('Registrado!');
      registerModal.onClose();
      loginModal.onOpen();
    })
    .catch((error) => {
      toast.error(error);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div className="flex flex-col gap-3">
      <Heading
        title="Bienvenidos a Academia A.L"
        subtitle="Crearse una cuenta!"
      />
       <Input
            id="email"
            label="Email"
            type="email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            helperText="Ingrese su dirección de correo electrónico. Por ejemplo: ejemplo@ejemplo.com"
          />
          <Input
            id="first_name"
            label="Primer Nombre"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            helperText="El nombre debe tener al menos 3 caracteres y como maximo 25 caracteres."
          />
          <Input
            id="last_name"
            label="Segundo Nombre"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            helperText="El apellido debe tener al menos 3 caracteres y como maximo 20 caracteres."
          />
          <Input
            id="password"
            label="Password"
            type="password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            helperText="La contraseña debe tener al menos 8 caracteres."
          />
          <Input
            id="date_of_birth"
            label="Fecha de Nacimiento"
            type="date"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            helperText="Ingrese su fecha de nacimiento."
          />
          <Input
            id="address"
            label="Dirección/Domicilio"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            helperText="La dirección debe tener al menos 5 caracteres y como maximo 50 caracteres."
          />
          <Input
            id="phone_number"
            label="Numero de Telefono"
            type="tel" 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            helperText="Ingrese un número de teléfono válido (Al menos 7 digitos y minimo 13)."
          />
          <Input
            id="dni"
            label="D.N.I"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            helperText="Ingrese un DNI válido (7 a 12 digitos)"
          />
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* <Button 
        outline 
        label="Continue con Google"
        icon={FcGoogle}
        onClick={() => signIn('google')} 
      /> */}
      <div 
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>Ya tiene una cuenta?
          <span 
            onClick={onToggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Iniciar Sesión</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Registrarse"
      actionLabel="Registrarse"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

const schema = yup.object().shape({
  email: yup.string().email("Ingrese un correo electrónico válido").required("El correo electrónico es obligatorio"),
  password: yup.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(20, "La contraseña debe tener como maximo 20 caracteres").required("La contraseña es obligatoria"),
  first_name: yup.string().required("El nombre es obligatorio").min(3, "El nombre debe tener al menos 3 caracteres").max(25, "El nombre debe tener como maximo 25 caracteres"),
  last_name: yup.string().required("El apellido es obligatorio").min(3, "El apellido debe tener al menos 3 caracteres").max(20, "El apellido debe tener como maximo 20 caracteres"),
  date_of_birth: yup.string().required("La fecha de nacimiento es obligatoria"),
  address: yup.string().required("La dirección es obligatoria").min(5, "La dirección debe tener al menos 5 caracteres").max(50, "La dirección debe tener como maximo 50 caracteres"),
  phone_number: yup.string().required("El numero de telefono es obligatorio").min(7, "El numero de telefono debe tener al menos 7 digitos").max(13, "El numero de telefono debe tener como maximo 13 digitos"),
  dni: yup.string().required("El DNI es obligatorio").min(7, "El DNI debe tener al menos 7 digitos").max(12, "El DNI debe tener como maximo 12 digitos"),
  // emergency_contact: yup.string().required("El numero de contacto es obligatorio"),
  // Agrega más campos y reglas de validación según tus necesidades
});

export default RegisterModal;