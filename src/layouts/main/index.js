import React from "react";
import PropTypes from "prop-types";
// material
import { Paper } from "@mui/material";
//
import Navbar from "./Navbar";
import Footer from "./Footer";
import InviteFriend from "../../components/InviteFriend";

MainLayout.propTypes = {
  children: PropTypes.node,
};
function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <Paper sx={{ padding: 4, background: "none" }}>{children}</Paper>
      <Footer />
      <InviteFriend />
    </>
  );
}

export default MainLayout;
