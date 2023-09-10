'use client'
import { Box, IconButton } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import {useTheme} from '@mui/system';
import { LightModeOutlined as LightModeOutlinedIcon } from '@mui/icons-material';
import { DarkModeOutlined as DarkModeOutlinedIcon } from '@mui/icons-material';
import UserMenu from "../NavBar/userMenu"
import React from "react";

interface TopbarProps {
  currentUser?: null;
}

const Topbar : React.FC<TopbarProps> = ({
  currentUser,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        // backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}
        <IconButton>
          <UserMenu currentUser={currentUser} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;