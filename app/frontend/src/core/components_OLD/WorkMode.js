import React from "react";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import EnergySavingsLeafRoundedIcon from '@mui/icons-material/EnergySavingsLeafRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';


function WorkMode({workMode, label, value, color, onSetPointChanged= ()=>{} }) {
  const MIN_VALUE = 0;
  const MAX_VALUE = 30;
  
  const handleIncrement = ()=>{
    if(value < MAX_VALUE){
      onSetPointChanged(value + 1)
    }
  }
  const handleDecrement = ()=>{
    if(value > MIN_VALUE){
      onSetPointChanged(value - 1)
    }
  }
  
  const WorkModeIcon = ({workMode, color})=>{
    switch(workMode){
      case "exit":
        return <MeetingRoomRoundedIcon sx={{color}}/>
      case "eco":
        return <EnergySavingsLeafRoundedIcon sx={{color}}/>
      case "comfort":
        return <LocalFireDepartmentRoundedIcon sx={{color}}/>
      default:
        return <LocalFireDepartmentRoundedIcon sx={{color}}/>
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{ width: "180px", height: "150px", padding: 1.5, borderRadius:5 }}
    >
      <Stack
        height={"100%"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack height={"100%"} width={"100%"} direction={"column"} alignItems={"center"} justifyContent={"space-around"}>
          <WorkModeIcon workMode={workMode} color={color}/>
          <Typography
            variant="h5"
            component="div"
            color={color}
            fontWeight="bold"
          >
            {value} °C
          </Typography>
          <Typography
            variant="p"
            component="div"
            color={color}
          >
            {label}
          </Typography>
        </Stack>
        <Stack height={"100%"} direction={"column"} justifyContent={"space-between"} >
          <Paper variant="outlined">
            <IconButton
              onClick={handleIncrement}
              color="primary"
              component="label"
            >
              <AddIcon />
            </IconButton>
          </Paper>
          <Paper variant="outlined">
            <IconButton
              onClick={handleDecrement}
              color="primary"
              component="label"
            >
              <RemoveIcon />
            </IconButton>
          </Paper>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default WorkMode;
