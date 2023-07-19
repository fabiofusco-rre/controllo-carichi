import update from "immutability-helper";
import {
  Checkbox,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";

import { loadConfigsSuccess, updatePriority } from "../../store/load/actions";
import DeviceSection from "./common/DeviceSection";
import { DeviceItem } from "./DeviceItem";
import ConfigDialog from "./common/ConfigDialog";
import { updateDeviceManager } from "../../service/LoadService";

function ManageDevices({
  open,
  onClose,
  available,
  newDevice,
  loadConfigsSuccess,
}) {
  const _listAvailable = available.map((d) => {
    d.checked = true;
    return d;
  });
  const _listNewDevice = newDevice.map((d) => {
    d.checked = false;
    return d;
  });

  const [listAvailable, setListAvailable] = useState([..._listAvailable]);
  const [listNewDevice, setListNewDevice] = useState([..._listNewDevice]);

  const [listAvailableFilterd, setListAvailableFilterd] = useState([
    ..._listAvailable,
  ]);
  const [listNewDeviceFilterd, setListNewDeviceFilterd] = useState([
    ..._listNewDevice,
  ]);

  const [filterByName, setFilterByName] = useState("");

  useEffect(() => {
    console.log("sono qiii");
    const _listAvailable = listAvailable.filter((d) => {
      return filterHandler(d);
    });
    const _listNewDevice = listNewDevice.filter((d) => {
      return filterHandler(d);
    });

    setListAvailableFilterd(_listAvailable);
    setListNewDeviceFilterd(_listNewDevice);
  }, [filterByName, listAvailable, listNewDevice]);

  const filterHandler = (d) => {
    if (filterByName == null || filterByName == "") {
      return true;
    }

    if (d.name.toUpperCase().includes(filterByName.toUpperCase())) {
      return true;
    }
    return false;
  };

  const handlerAvailable = (entityId, checked) => {
    listAvailable.map((device) => {
      if (device.entity_id === entityId) {
        device.checked = checked;
      }
      return device;
    });
    setListAvailable(JSON.parse(JSON.stringify(listAvailable)));
  };

  const handlerNewDevice = (entityId, checked) => {
    listNewDevice.map((device) => {
      if (device.entity_id === entityId) {
        device.checked = checked;
      }
      return device;
    });
    setListNewDevice(JSON.parse(JSON.stringify(listNewDevice)));
  };

  const onSave = async () => {
    try {
      const addToAvailable = listNewDevice
        .filter((d) => d.checked)
        .map((d) => d.entity_id);
      const removeToAvailable = listAvailable
        .filter((d) => !d.checked)
        .map((d) => d.entity_id);
      const configs = await updateDeviceManager({
        addToAvailable,
        removeToAvailable,
      });
      loadConfigsSuccess(configs);
      onClose();
    } catch (error) {
      console.log("[ERROR - onSave]", error);
    }
  };

  return (
    <ConfigDialog
      title={"Configura dispotivi"}
      description={
        "Aggiungi o rimuovi i dispositivi controllabili dalla gestione dei carichi"
      }
      underDescriptionJSX={() => (
        <TextField
          sx={{marginTop:'10px', marginBottom: "10px", marginRight:'50px' }}
          id="standard-basic"
          label="Cerca dispositivo"
          variant="standard"
          autoComplete="off"
          value={filterByName}
          onChange={(e) => setFilterByName(e.target.value)}
        />
      )}
      open={open}
      onClose={() => {
        onClose();
      }}
      onSave={onSave}
      maxWidth="sm"
    >
      <Stack>
        <Typography variant="h6" mb={1}>
          Dispositivi controllati
        </Typography>
        {listAvailableFilterd?.map((device, i) => (
          <Stack key={i} direction={"row"} alignItems={"center"} width={"100%"}>
            <Checkbox
              sx={{ padding: 0, marginRight: "10px" }}
              checked={device.checked}
              onChange={(e) =>
                handlerAvailable(device.entity_id, e.target.checked)
              }
            />
            <DeviceItem
              key={i}
              priority={i + 1}
              name={device.name}
              entityId={device.entity_id}
              state={device.state}
            />
          </Stack>
        ))}
        <Typography variant="h6" mt={2} mb={1}>
          Nuovi dispositivi
        </Typography>
        {listNewDeviceFilterd?.map((device, i) => (
          <Stack key={i} direction={"row"} alignItems={"center"} width={"100%"}>
            <Checkbox
              sx={{ padding: 0, marginRight: "10px" }}
              checked={device.checked}
              onChange={(e) =>
                handlerNewDevice(device.entity_id, e.target.checked)
              }
            />
            <DeviceItem
              key={i}
              name={device.name}
              entityId={device.entity_id}
              state={device.state}
            />
          </Stack>
        ))}
      </Stack>
    </ConfigDialog>
  );
}

const mapStateToProps = ({ Load }) => ({});

const mapDispatchToProps = (dispatch) => ({
  loadConfigsSuccess: (configs) => dispatch(loadConfigsSuccess(configs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageDevices);
