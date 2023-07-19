import React from "react";
import { Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function DeviceSettingItem({ name, state, type, zone, currentZone, onAdd, onRemove }) {
  const canAdd = zone == null;
  const canNotRemove = zone != null && zone !== currentZone;

  return (
    <Paper variant="outlined" sx={{ height:'70px', marginBottom: 2, borderRadius: 2.5 }}>
      <Stack
        p={1}
        height={"100%"}
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={'row'} alignItems={'center'} width={'40%'}>
          <DeviceThermostatIcon />
          <Stack marginLeft={2}>
            <Typography variant="p" >
              {`Nome dispotivo:`}
            </Typography>
            <Typography variant="p" fontWeight={"bold"}>
              {`${name} ${state ? ` - ${state}°C` : ""}`}
            </Typography>
          </Stack>
        </Stack>
        <Divider orientation="vertical" flexItem sx={{ margin: 1 }} />
        <Stack width={"30%"}>
          {zone && (
            <>
              <Typography variant="p">{`Assegnato in zona: `}</Typography>
              <Typography variant="p" fontWeight={"bold"}>
                {zone}
              </Typography>
            </>
          )}
          {!zone && <Typography variant="p">{`Libero`}</Typography>}
        </Stack>
        <Divider orientation="vertical" flexItem sx={{ margin: 1 }} />
        <Stack>
          <Stack
            sx={{
              backgroundColor: "#F2F2F6",
              padding: "2px",
              borderRadius: 3,
            }}
          >
            {canAdd && (
              <IconButton
                disableRipple={false}
                disabled={canNotRemove}
                onClick={onAdd}
                color="primary"
                component="label"
              >
                <AddIcon
                  sx={{
                    backgroundColor: "#F2F2F6",
                  }}
                  fontSize="medium"
                />
              </IconButton>
            )}
            {!canAdd && (
              <IconButton
                disableRipple={false}
                disabled={canNotRemove}
                onClick={onRemove}
                color="primary"
                component="label"
              >
                <RemoveIcon
                  sx={{
                    backgroundColor: "#F2F2F6",
                  }}
                  fontSize="medium"
                />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default DeviceSettingItem;
