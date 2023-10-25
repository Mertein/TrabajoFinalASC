'use client'
import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../../theme";
import { BarChartOutlined as BarChartOutlinedIcon } from "@mui/icons-material";
import { PieChartOutlineOutlined as PieChartOutlineOutlinedIcon } from "@mui/icons-material";
import { TimelineOutlined as TimelineOutlinedIcon } from "@mui/icons-material";
import { MenuOutlined as MenuOutlinedIcon } from "@mui/icons-material";
import { Class as ClassIcon } from "@mui/icons-material";
import {AlignHorizontalLeft as AlignHorizontalLeftIcon} from '@mui/icons-material';
import { Help as HelpIcon } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { People as PeopleIcon } from "@mui/icons-material";
import {Approval as ApprovalIcon} from "@mui/icons-material";
import { Category as CategoryIcon } from "@mui/icons-material";
import { LocationCity as LocationCityIcon } from "@mui/icons-material";
import { Feedback as FeedbackIcon } from "@mui/icons-material";
import {Pageview as PageviewIcon} from '@mui/icons-material';
import { PersonOutlined as PersonOutlinedIcon } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const Item = ({ title, to, icon, selected, setSelected } : {title: any, to: any, icon: any, selected: any, setSelected: any}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link href={to} />
    </MenuItem>
  );
};



const Sidebar = ({user}: any) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const CDNURL = 'https://dqppsiohkcussxaivbqa.supabase.co/storage/v1/object/public/files/UsersProfilePicture/';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    alert("No has iniciado sesión");
    router.push('/')
  }
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                {user && user.files && user.files[0] ? (
                  <Image
                    alt="profile-user"
                    width={100}
                    height={100}
                    src={ CDNURL + user.files[0].name}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                ) : (
                  <Image
                    alt="default-profile"
                    width={100}
                    height={100}
                    src="/images/defaultProfile.jpg"
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                )}
              </Box>
              <Box textAlign="center">
                {user && user.first_name && user.last_name ? (
                  <>
                    <Typography
                      variant="h2"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "10px 0 0 0" }}
                    >
                      {user.first_name}  {user.last_name}
                    </Typography>
                    <Typography variant="h5" color={colors.greenAccent[500]}>
                      Academia A.L
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                    Usuario Desconocido
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "5%"}>
            {/* <Item
              title="Inicio"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Cursos
            </Typography>
            <Item
              title="Ver cursos"
              to="/admin/viewCourses"
              icon={<ClassIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
             <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Usuarios
            </Typography>
            <Item
              title="Administrar Usuarios"
              to="/admin/users"
              icon={<PeopleIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Alumnos"
              to="/admin/students"
              icon={<PersonIcon/>}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              title="Instructores"
              to="/admin/instructors"
              icon={<SchoolIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
              
            >
              Categorias
            </Typography>
            <Item
              title="Administrador Categorias"
              to="/admin/categories"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Sucursales
            </Typography>
            <Item
              title="Adminsitrar Sucursales"
              to="/admin/branchOffices"
              icon={<LocationCityIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
              <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Certificados
            </Typography>
            {/* <Item
              title="Agregar Certificado"
              to="/admin/certificate/upload"
              icon={ <DocumentScannerIcon/>}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Otorgar Certificado"
              to="/admin/certificate/studentCertificate"
              icon={ <ApprovalIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Mis Datos
            </Typography>
            <Item
              title="Mi perfil"
              to="/admin/MyProfile"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              FAQS y Feedbacks
            </Typography>
            <Item
              title="Adminstrar FAQs"
              to="/admin/faqs"
              icon={<HelpIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Ver Feedbacks"
              to="/admin/feedbacks"
              icon={ <FeedbackIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Estadistica
            </Typography>
            <Item
              title="Gráfico de Barras"
              to="/admin/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Gráfico de Pie"
              to="/admin/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Gráfico de Linea"
              to="/admin/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Gráfico de Barra Horizontal"
              to="/admin/horizontalBar"
              icon={<AlignHorizontalLeftIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            

          <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Auditoria
            </Typography>
            <Item
              title="Auditoria"
              to="/admin/audit"
              icon={<PageviewIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;