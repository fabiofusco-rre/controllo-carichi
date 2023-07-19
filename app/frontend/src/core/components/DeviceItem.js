import { Stack, Typography } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export const DeviceItem = ({
  priority,
  name,
  entityId,
  state,
  isUnavailable = false,
  dragIcon = false,
}) => {
  const backgroundColor = ((state) => {
    if (isUnavailable) {
      return "#eceff1";
    }
    return state === "on" ? "#E0F2F1" : "white";
  })(state, isUnavailable);

  return (
    <Stack
      sx={{
        background: backgroundColor,
        borderStyle: "solid",
        borderColor: "#78909C",
        borderRadius: "10px",
      }}
      mb={2}
      p={2}
      direction={"row"}
      spacing={2}
      alignItems={"center"}
      width={'100%'}
    >
      {!isUnavailable && (
        <Stack direction={"row"} alignItems={"center"}>
          {dragIcon && <DragIndicatorIcon sx={{ color: "#616161", marginRight: "10px" }} />}
          {priority && <Stack>#{priority}</Stack>}
        </Stack>
      )}

      <Stack
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="caption">{entityId}</Typography>
        </Stack>
        <Typography variant="p" sx={{ textTransform: "uppercase" }}>
          {!isUnavailable ? state : "----"}
        </Typography>
      </Stack>
    </Stack>
  );
};
