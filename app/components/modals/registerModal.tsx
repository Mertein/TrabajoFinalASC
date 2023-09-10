'use client';

import axios from "axios";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  FieldValues, 
  SubmitHandler,
  useForm
} from "react-hook-form";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./modal";
import Input from "../Inputs/input";
import Heading from "../Heading/heading";
import Button from "../Button/button";

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
      emergency_contact:'',
      gender:'',
      dni: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/register', data)
    .then(() => {
      toast.success('Registered!');
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
      />
       <Input
        id="first_name"
        label="Primer Nombre"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
       <Input
        id="last_name"
        label="Segundo Nombre"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />  
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="date_of_birth"
        label="Fecha de Nacimiento"
        type="date"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
       <Input
        id="address"
        label="Dirección/Domicilio"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
       <Input
        id="phone_number"
        label="Numero de Telefono"
        type="number"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
       <Input
        id="emergency_contact"
        label="Contacto/Nro de emergencia"
        type="number"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
        <Input
        id="gender"
        label="Genero"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
        <Input
        id="dni"
        label="D.N.I"
        type="number"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button 
        outline 
        label="Continue con Google"
        icon={FcGoogle}
        onClick={() => signIn('google')} 
      />
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
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;