import update from "immutability-helper";
import { IconButton, Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";

import { updatePriority } from "../../store/load/actions";
import DeviceSection from "./common/DeviceSection";
import { DeviceItem } from "./DeviceItem";

function UnavailableDevice({ unavailable }) {
  return (
    <>
      <Stack width={"100%"}>
        <DeviceSection title={"Dispositivi disconnessi"} warning={true}>
          {unavailable.map((device, i) => (
            <DeviceItem
              key={i}
              isUnavailable={true}
              name={device.name}
              entityId={device.entity_id}
              state={device.state}
            />
          ))}
        </DeviceSection>
      </Stack>
    </>
  );
}

const mapStateToProps = ({ Load }) => ({});

const mapDispatchToProps = (dispatch) => ({
  updatePriority: (entityId, priority, upPriority) =>
    dispatch(updatePriority(entityId, priority, upPriority)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UnavailableDevice);
