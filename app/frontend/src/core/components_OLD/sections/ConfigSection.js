import { IconButton, Stack, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import CardSection from "../common/CardSection";
import WorkMode from "../WorkMode";
import Device from "../device/Device";
import ManageDeviceDialog from "../ManageDeviceDialog";
import { connect } from "react-redux";
import { updateWorkMode, updateZoneDevices } from "../../../store/load/actions";


const createDeviceList = (configZones, deviceRegistry) => {
  Object.values(configZones).map((zone)=>
    zone?.devicesAssigned?.map((idDevice)=>
      deviceRegistry[idDevice].idZone = zone.idZone
    )
  )
  return Object.values(deviceRegistry);
}

const getDevicesInfo = (idsDevices, deviceRegistry) => {
  let devicesInfo = idsDevices?.map((idDevice) => deviceRegistry[idDevice]);
  return devicesInfo;
}


function ConfigSection({style, idZoneSelected, configZones, configZone, chronoConfig, deviceRegistry, updateWorkMode, updateZoneDevices}) {
  const workMode = configZone?.workMode;
  const zoneName = configZone?.zoneName;
  const zoneDevicesList = getDevicesInfo(configZone?.devicesAssigned, deviceRegistry);
  const deviceList = createDeviceList(configZones, deviceRegistry);
  const workModeConfig = chronoConfig.workMode;

  const [openManageDevice, setOpenManageDevice] = React.useState(false);

  const handleSetPointChanged = (idWorkMode, setPoint) => {
    updateWorkMode(idZoneSelected, idWorkMode, setPoint);
  };

  const handleNewDeviceList = (newDeviceList) => {
    const mapZoneDevices = {};
    Object.values(configZones).map((configZone)=>{
      mapZoneDevices[configZone.idZone] = [];
    });
    newDeviceList?.map((deviceInfo)=>{
      if(deviceInfo?.idZone){
        mapZoneDevices[deviceInfo?.idZone].push(deviceInfo?.idDevice);
      }
    });
    updateZoneDevices(idZoneSelected, mapZoneDevices)
  };

  const WorkModeConfiguration = () => (
    <Stack mt={3} direction={"row"} spacing={2}>
      {Object.keys(workMode).map((key, idx) => (
        <WorkMode
          key={idx}
          workMode={key}
          value={workMode[key]}
          label={workModeConfig[key].label}
          color={workModeConfig[key].color}
          onSetPointChanged={(value) => {
            handleSetPointChanged(key, value);
          }}
        />
      ))}
    </Stack>
  );
  const DeviceConfiguration = () => (
    <Stack direction={"row"} spacing={2} height={"100%"}>
      {
        zoneDevicesList.length > 0 && 
        <Stack mt={3} direction={'row'} flexWrap={"wrap"}>
          {zoneDevicesList.map((device, idx) => (
            <Device key={idx} name={device.name} state={device?.stateInfo?.currentTemperature} />
          ))}
        </Stack>
      }
      {zoneDevicesList.length === 0 && (
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          height={"100%"}
        >
          <WarningAmberIcon  fontSize="large" sx={{ marginBottom: "10px", color:"#FBC02D" }} />
          <Typography variant="subtitle1" color={"#FBC02D"}>
            Nessun device connesso, premere + per aggiungerne uno
          </Typography>
        </Stack>
      )}
    </Stack>
  );

  const RightHeaderJSX = () => (
    <Stack
      direction={"row"}
      height={"fit-content"}
      width={"100%"}
      justifyContent={"end"}
    >
      <Stack height={22} component={"div"}>
        <IconButton
          disableRipple={false}
          sx={{ backgroundColor: "#F2F2F6", padding: "16px", borderRadius: 4 }}
          onClick={() => {
            setOpenManageDevice(true);
          }}
          color="primary"
          component="label"
        >
          <AddIcon fontSize="medium" />
        </IconButton>
      </Stack>
    </Stack>
  );

  const multipleSection = {
    first: {
      title: "Configurazione",
      subTitle: "Modalità di funzionamento",
      component: <WorkModeConfiguration />,
    },
    second: {
      title: "Configurazione",
      subTitle: "Valvole termostatiche",
      component: <DeviceConfiguration />,
      rightHeader: <RightHeaderJSX />,
    },
  };

  return (
    <>
      <Stack sx={{ ...style }}>
        <CardSection multipleSection={multipleSection} />
      </Stack>
      {openManageDevice && (
        <ManageDeviceDialog
          title={"Device"}
          description={"Gestione device zona"}
          devices={deviceList}
          configZone={configZone}
          open={openManageDevice}
          onClose={() => {
            setOpenManageDevice(false);
          }}
          onSave={(newDeviceList) => {
            handleNewDeviceList(newDeviceList);
          }}
        />
      )}
    </>
  );
}


const mapStateToProps = ({ Chrono, App }) => ({
  chronoConfig: Chrono.chronoConfig,
  deviceRegistry: Chrono.deviceRegistry,
  configZones: Chrono.configZones,
  idZoneSelected: App.idZoneSelected,
  configZone: App.selectedZone,
});

const mapDispatchToProps = dispatch => ({
  updateWorkMode: (idZone, idWorkMode, setPoint) => dispatch(updateWorkMode(idZone, idWorkMode, setPoint)),
  updateZoneDevices: (idZone, mapZoneDevices) => dispatch(updateZoneDevices(idZone, mapZoneDevices)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigSection)
