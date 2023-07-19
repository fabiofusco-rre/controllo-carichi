import React from "react";
import { Paper, Stack, Typography } from "@mui/material";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";

function Device({ name, state, type, zone, variant }) {
  return (
    <Paper
      variant="outlined"
      sx={{ height: "50px", paddingX: 1.5, borderRadius: 2.5, margin:'0px 5px 5px'}}
    >
      <Stack height={"100%"} direction={"row"} alignItems={"center"}>
        <DeviceThermostatIcon />
        <Typography variant="p" fontWeight={"bold"}>
              {`${name} ${state ? ` - ${state}°C` : ""}`}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default Device;
