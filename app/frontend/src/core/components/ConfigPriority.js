import update from "immutability-helper";
import { IconButton, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";

import { Card } from "./Card";
import { updatePriority } from "../../store/load/actions";
import DeviceSection from "./common/DeviceSection";
import ManageDevices from "./ManageDevices";

function ConfigPriority({ style, available = [], newDevice = [], updatePriority }) {
  const [cards, setCards] = useState(available);
  const [openDeviceManager, setOpenDeviceManager] = useState(false);

  useEffect(() => {
    setCards(available);
  }, [available]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const renderCard = useCallback((card, index) => {
    return (
      <Card
        key={card.entity_id}
        index={index}
        id={card.entity_id}
        name={card.name}
        entityId={card.entity_id}
        state={card.state}
        updatePriority={updatePriority}
        moveCard={moveCard}
      />
    );
  }, []);

  return (
    <>
      <Stack width={"100%"}>
        <DeviceSection
          title={"Dispositivi controllati"}
          configuration={true}
          onClickBtnConfig={() => {
            setOpenDeviceManager(true);
          }}
        >
          {cards.map((card, i) => renderCard(card, i))}
        </DeviceSection>
      </Stack>
      {openDeviceManager && (
        <ManageDevices
          open={openDeviceManager}
          onClose={() => setOpenDeviceManager(false)}
          available={available}
          newDevice={newDevice}
        />
      )}
    </>
  );
}

const mapStateToProps = ({ Load }) => ({});

const mapDispatchToProps = (dispatch) => ({
  updatePriority: (entityId, priority, upPriority) =>
    dispatch(updatePriority(entityId, priority, upPriority)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfigPriority);
