import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";
import closeFill from "@iconify/icons-eva/close-fill";
// material
import { Box, Button, Slider } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
// atoms
import { authAtom } from "../../../recoil/atoms/auth";
import { caloriesThresholdAtom } from "../../../recoil/atoms/userConfigs";
// apis
import {
  dailyCaloriesThresholdFetcher,
  dailyCaloriesThresholdUpdater,
} from "../../../apis/userConfigs";
//
import { MIconButton } from "../../@material-extend";

function DailyCaloriesThreshold() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [updateMode, setUpdateMode] = useState(false);
  const [dailyCaloriesThreshold, setDailyCaloriesThreshold] = useRecoilState(
    caloriesThresholdAtom
  );

  const [threshold, setThreshold] = useState(0);
  const [updating, setIsUpdating] = useState(false);

  const user = useRecoilValue(authAtom);

  const handleDailyCaloriesThresholdUpdate = async () => {
    setIsUpdating(true);
    const data = new FormData();
    data.append("threshold", threshold);
    await dailyCaloriesThresholdUpdater(user?.id, data)
      .then((dailyCaloriesThresholdResponse) => {
        setDailyCaloriesThreshold(dailyCaloriesThresholdResponse.threshold);
        enqueueSnackbar("Daily calories threshold updated", {
          variant: "success",
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        });
      })
      .catch(() =>
        enqueueSnackbar("Something wrong happened", {
          variant: "error",
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        })
      );
    setUpdateMode(false);
    setIsUpdating(false);
  };

  useEffect(async () => {
    await dailyCaloriesThresholdFetcher(user?.id)
      .then((dailyCaloriesThresholdResponse) =>
        setDailyCaloriesThreshold(dailyCaloriesThresholdResponse.threshold)
      )
      .catch((error) => console.log("couldnt fetch threshold", error));
  }, [user, setDailyCaloriesThreshold]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {updateMode ? (
        <Slider
          min={0}
          max={3000}
          value={threshold}
          onChange={(event) => setThreshold(event.target.value)}
          valueLabelDisplay="on"
        />
      ) : (
        <Slider
          min={0}
          max={3000}
          value={dailyCaloriesThreshold}
          valueLabelDisplay="on"
          aria-label="Disabled slider"
          disabled
        />
      )}
      {updateMode ? (
        <LoadingButton
          startIcon={<SendIcon />}
          loading={updating}
          disabled={updating}
          onClick={handleDailyCaloriesThresholdUpdate}
          sx={{ ml: 3 }}
        >
          Save
        </LoadingButton>
      ) : (
        <Button
          startIcon={<EditIcon />}
          onClick={() => setUpdateMode(true)}
          sx={{ ml: 3 }}
        >
          Update
        </Button>
      )}
    </Box>
  );
}

export default DailyCaloriesThreshold;
