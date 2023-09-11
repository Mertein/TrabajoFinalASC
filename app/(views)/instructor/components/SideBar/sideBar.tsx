'use client'
import { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography } from '@mui/material';
import {useTheme} from '@mui/material/styles';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '../../../../theme';
import { PersonOutlined as PersonOutlinedIcon, Route } from '@mui/icons-material';
import { BarChartOutlined as BarChartOutlinedIcon } from '@mui/icons-material';
import { PieChartOutlineOutlined as PieChartOutlineOutlinedIcon } from '@mui/icons-material';
import { TimelineOutlined as TimelineOutlinedIcon } from '@mui/icons-material';
import { MenuOutlined as MenuOutlinedIcon } from '@mui/icons-material';
import { MapOutlined as MapOutlinedIcon } from '@mui/icons-material';
import {Memory as MemoryIcon} from '@mui/icons-material';
import { Class as ClassIcon } from '@mui/icons-material';
import Link from 'next/link';
import { School as SchoolIcon } from '@mui/icons-material';
import Image from 'next/image';
import { Add as AddIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


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
  const { data: session, status } = useSession();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

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
                  Instructor
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
                    src={`/Users/ProfilePicture/${user.files[0].name}`}
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
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* <Item
              title="Dashboard"
              to="/instructor"
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
              to="/instructor/viewCourses"
              icon={<ClassIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Mis cursos creados"
              to="/instructor/MyCourses"
              icon={<SchoolIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Crear curso"
              to="/instructor/CreateCourse"
              icon={<AddIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* <Item
              title="Ver Alumnos"
              to="/Instructor/ViewStudents"
              icon={<PageviewIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Mis Datos
            </Typography>
            <Item
              title="Mi perfil"
              to="/instructor/MyProfile"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Firma Digital"
              to="/instructor/Signature"
              icon={<MemoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Calendario"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;