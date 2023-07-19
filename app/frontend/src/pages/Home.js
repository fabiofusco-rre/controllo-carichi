import { Button, Checkbox, Stack, Typography } from "@mui/material";
import React from "react";

import { connect } from "react-redux";
import ConfigPriority from "../core/components/ConfigPriority";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import UnavailableDevice from "../core/components/UnavailableDevice";
import ConfigDialog from "../core/components/common/ConfigDialog";
import { DeviceItem } from "../core/components/DeviceItem";
import DeviceSection from "../core/components/common/DeviceSection";
import ManageDevices from "../core/components/ManageDevices";
import { switchDown } from "../service/LoadService";
import { loadConfigsSuccess } from "../store/load/actions";

function Home({ loadConfigs, loadConfigsSuccess }) {
  console.log("CONFIGURAZIONE NUOVA", loadConfigs)
  return (
    <Stack
      sx={{ /* backgroundColor: "#F2F2F6", */ height: "100%", padding: 5 }}
    >
      {loadConfigs?.unavailable?.length > 0 && (
        <UnavailableDevice unavailable={loadConfigs?.unavailable} />
      )}
      <Stack direction={'row'} justifyContent={'end'}>
        <Button onClick={async ()=>{
          const config = await switchDown();
          loadConfigsSuccess(config);
          }}>Test spegnimento</Button>
      </Stack>
      <DndProvider backend={HTML5Backend}>
        <ConfigPriority available={loadConfigs?.available} newDevice={loadConfigs?.newDevice}/>
      </DndProvider>
    </Stack>
  );
}

const mapStateToProps = ({ Load }) => ({
  loadConfigs: Load.configs,
});

const mapDispatchToProps = dispatch => ({
  loadConfigsSuccess: (configs) => dispatch(loadConfigsSuccess(configs)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
