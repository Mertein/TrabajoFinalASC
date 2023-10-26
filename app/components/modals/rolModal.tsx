'use client';
import { useState } from "react";
import Modal from "./modal";
import Heading from "../Heading/heading";
import { MenuItem } from 'react-pro-sidebar';
import { useRouter, usePathname } from "next/navigation";
import { useRolModal } from "@/app/hooks";
import {useTheme} from '@mui/material/styles';
import { tokens } from '../../theme';
import { Typography } from '@mui/material';
import { AccountBox, AdminPanelSettings,  School } from '@mui/icons-material';


const Item = ({ title, to, icon, selected, setSelected } : {title: any, to: any, icon: any, selected: any, setSelected: any}) => {
  const theme = useTheme();
  const router = useRouter();
   const rolModal = useRolModal();
  const colors = tokens(theme.palette.mode);
  const handleOnClick = () => {
    setSelected(title);
    router.push(to);
    rolModal.onClose();
  };

  return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={handleOnClick}
        icon={icon}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    
  );
};


const RolModal = ({user} : any) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const currentPath = usePathname();
  const rolModal = useRolModal();
  const [selected, setSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMainPage = currentPath === "/";

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Roles"
        subtitle="Selecciona con qué rol ingresar"
      />
        {user?.roles.map((role: string) => (
        <Item
          key={role}
          title={role === 'Student' ? 'Estudiante' : role}
          to={`/${role.toLowerCase()}/viewCourses`}
          icon={role === 'Student' ? <School/> : role === 'Instructor' ? <AccountBox/> : <AdminPanelSettings/> } 
          selected={selected}
          setSelected={setSelected}
        />
        ))}
        {!isMainPage  && (
          <Item
          key={'Inicio'}
          title={'Inicio'}
          to={`/`}
          icon={<School/>} 
          selected={selected}
          setSelected={setSelected}
        />
        )}
      
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={rolModal.isOpen}
      title="Perfil de usuario"
      actionLabel="Cerrar"
      onClose={rolModal.onClose}
      onSubmit={() => rolModal.onClose()}
      body={bodyContent}
  />
  );
}
export default RolModal;
