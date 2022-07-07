import React from "react";
// material
import { Box, Container, Link, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        py: 5,
        textAlign: "center",
        position: "relative",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* <ScrollLink to="move_top" spy smooth>
          <Logo sx={{ mb: 1, mx: "auto", cursor: "pointer" }} />
        </ScrollLink> */}

        <Typography variant="caption" component="p">
          Calories tracker
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
