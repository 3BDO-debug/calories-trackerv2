import React from "react";
import PropTypes from "prop-types";
// material
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
  DialogContentText,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
//

MealLimitWarning.propTypes = {
  isTriggered: PropTypes.bool,
  closeHandler: PropTypes.func,
};

function MealLimitWarning({ isTriggered, closeHandler }) {
  return (
    <Dialog open={isTriggered} onClose={closeHandler}>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 1,
          }}
        >
          <WarningIcon
            sx={{ width: "30px", height: "30px", mr: 1 }}
            color="warning"
          />
          <Typography variant="h5">
            Warning food entry per meal limit exceeded
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContentText>
        <Box sx={{ padding: "30px" }}>
          You have exceeded your food entry per meal settings.
        </Box>
      </DialogContentText>
      <DialogActions>
        <Button variant="contained" onClick={closeHandler}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MealLimitWarning;
