import { Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SettingsIcon from "@mui/icons-material/Settings";
import React from "react";

function DeviceSection({
  warning,
  title,
  children,
  onAddBtn,
  configuration = false,
  onClickBtnConfig,
}) {
  const backgroundColor = warning ? "#FFF3E0" : "#FAFAFA";
  const txtColor = warning ? "#FB8C00" : null;
  return (
    <Stack
      sx={{
        backgroundColor: backgroundColor,
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "10px",
        width: "100%",
      }}
    >
      {
        <Stack
          mb={2}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"}>
            {warning && (
              <WarningAmberIcon
                sx={{
                  color: txtColor,
                  marginRight: "10px",
                }}
              />
            )}
            <Typography variant="h6" color={txtColor}>
              {title}
            </Typography>
          </Stack>
          {configuration && (
            <Button
              onClick={() => {
                onClickBtnConfig();
              }}
              variant="outlined"
              endIcon={<SettingsIcon />}
            >
              CONFIGURAZIONE
            </Button>
          )}
        </Stack>
      }
      {children}
    </Stack>
  );
}

export default DeviceSection;
