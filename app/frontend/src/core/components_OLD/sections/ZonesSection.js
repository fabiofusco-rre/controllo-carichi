import { Button, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import AddZoneDialog from "../AddZoneDialog";
import { selectZone } from "../../../store/app/actions";
import { connect } from "react-redux";
import { createZone } from "../../../store/load/actions";

function ZoneSection({ zones, idZoneSelected, selectZone, createZone }) {
  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
  };

  const handlerSelectedZone = (idZone) => {
    selectZone(idZone);
  }

  const ZoneBtn = ({ idZone, selected }) => (
    <Button
      onClick={() => handlerSelectedZone(idZone)}
      variant={selected ? "contained" : "text"}
    >
      {idZone}
    </Button>
  );

  return (
    <>
      <Stack spacing={3}>
        <Stack direction={"row"} spacing={2}>
          {zones?.map((idZone, idx) => {
            return (
              <ZoneBtn key={idx} idZone={idZone} selected={idZone === idZoneSelected} />
            );
          })}
          <Stack>
            <IconButton
              onClick={handleOpenDialog}
              color="primary"
              component="label"
            >
              <AddIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      {openAddDialog && (
        <AddZoneDialog
          zones={zones}
          title={"Nuova zona"}
          description={
            "Crea una nuova zona in cui configurare il cronotermostato"
          }
          open={openAddDialog}
          onClose={handleCloseDialog}
          onCreate={createZone}
        />
      )}
    </>
  );
}

const mapStateToProps = ({ Chrono, App }) => ({
  zones: Chrono.zones,
  idZoneSelected: App.idZoneSelected
});

const mapDispatchToProps = dispatch => ({
  selectZone: (idZone) => dispatch(selectZone(idZone)),
  createZone: (name) => dispatch(createZone(name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoneSection)
