'use client';

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from 'next-auth/react';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { FcGoogle } from "react-icons/fc";


import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./modal";
import Input from "../Inputs/input";
import Heading from "../Heading/heading";
import Button from "../Button/button";
import { useRouter } from "next/navigation";
import { useRolModal } from "@/app/hooks";

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rolModal = useRolModal();
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
      password: ''
    },
  });
  
  const onSubmit: SubmitHandler<FieldValues> = 
  (data) => {
    setIsLoading(true);

    signIn('credentials', { 
      ...data, 
      redirect: false,
    })
    .then((callback) => {
      setIsLoading(false);
     
      if (callback?.error == null) {
        toast.success('Ha iniciado sesión correctamente');
        router.refresh();
        loginModal.onClose();
        rolModal.onOpen();
      }
      
      if (callback?.error == "Invalid credentials") {
        toast.error(callback.error);
      }
    });
  }

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Que alegria verte de nuevo!"
        subtitle="Inicia sesión en tu cuenta"
      />
      <Input
        id="email"
        label="Email"
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
      <div className="
      text-neutral-500 text-center mt-4 font-light">
        <p>Primera vez usando Academia A.L?
          <span 
            onClick={onToggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Crearse una Cuenta</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Inicio de Sesión"
      actionLabel="Iniciar Sesión"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;