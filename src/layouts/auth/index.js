import PropTypes from "prop-types";
// material
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";
//
import { MHidden } from "../../components/@material-extend";

// ----------------------------------------------------------------------

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

// ----------------------------------------------------------------------

AuthLayout.propTypes = {
  children: PropTypes.node,
};

export default function AuthLayout({ children }) {
  return (
    <HeaderStyle>
      <SpaIcon
        sx={{
          mr: 1,
          width: "50px",
          height: "50px",
        }}
        color="primary"
      />
      <MHidden width="smDown">
        <Typography
          variant="body2"
          sx={{
            mt: { md: 2 },
          }}
        >
          {children}
        </Typography>
      </MHidden>
    </HeaderStyle>
  );
}
