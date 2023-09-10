'use client';

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import MenuItem from "./menuItem";
import Avatar from "../Avatar/avatar";
import {useLoginModal, useRegisterModal, useRolModal} from "../../hooks";
import { useSession } from "next-auth/react";
// import useRentModal from "@/app/hooks/useRentModal";
// import { SafeUser } from "@/app/types";

interface UserMenuProps {
  currentUser: null | undefined;
  user?: null
}

const UserMenu: React.FC<UserMenuProps> = ({
  user
}) => {
  const { data, status } = useSession() 
  
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rolModal = useRolModal();
  // const rentModal = useRentModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return ( 
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div 
        onClick={toggleOpen}
        className="
          p-4
          md:py-1
          md:px-2
          border-[10px] 
          border-neutral-500
          flex 
          flex-row 
          items-center 
          gap-2
          rounded-md
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={'/images/defaultProfile.jpg'} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div 
          className="
            absolute 
            rounded-xl
            shadow-md
            w-[6vw]
            bg-black
            overflow-hidden 
            right-0
            left-0
            top-12
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            {status === 'authenticated' ? (
              <>
                <MenuItem 
                  label="Seleccionar Perfil" 
                  onClick={rolModal.onOpen}
                />
                {/* <MenuItem 
                  label="My favorites" 
                  onClick={() => router.push('/favorites')}
                />
                <MenuItem 
                  label="My reservations" 
                  onClick={() => router.push('/reservations')}
                />
                <MenuItem 
                  label="My properties" 
                  onClick={() => router.push('/properties')}
                /> */}
                
                <hr />
                <MenuItem 
                  label="Cerrar sesión" 
                  onClick={() => signOut()}
                />
              </>
            ) : (
              <>
                <MenuItem 
                  label="Iniciar sesión" 
                  onClick={loginModal.onOpen}
                />
                <MenuItem 
                  label="Registrarse" 
                  onClick={registerModal.onOpen}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
   );
}
 
export default UserMenu;