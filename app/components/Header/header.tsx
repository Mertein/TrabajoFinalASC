'use client'
import { Typography, Box } from "@mui/material";
import {useTheme} from '@mui/system';
import { tokens } from "../../theme";

const Header = ({ title, subtitle } : {title: any, subtitle: any}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box  mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;