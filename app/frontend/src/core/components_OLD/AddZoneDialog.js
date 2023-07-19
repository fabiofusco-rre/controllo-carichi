import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import ConfigDialog from "./common/ConfigDialog";

function AddZoneDialog({ zones, title, description, open, onClose, onCreate }) {
  const MIN_NAME_LENGTH = 4;
  const MAX_NAME_LENGTH = 20;
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!open) {
      setName("");
    }
  }, [open]);

  const handleCreateZone = () => {
    onCreate(name);
  };

  const handleNameChange = (e) => {
    const _name = e.target.value;
    if (_name.length <= MAX_NAME_LENGTH) {
      setName(_name);
      if(checkNameExist(_name, zones)){
        setError("Questo nome è già stato utilizzato");
      }else{
        setError(null);
      }
    }
  };

  const checkNameExist = (name, zones) => {
    for (let i = 0; i < zones.length; i++) {
      const zone = zones[i];
      if (zone.toUpperCase() === name.toUpperCase()) {
        return true;
      }
    }
    return false;
  };

  return (
    <ConfigDialog
      title={title}
      open={open}
      description={description}
      onClose={onClose}
      onSave={handleCreateZone}
      disableSaveBtn={(name.length < MIN_NAME_LENGTH || error != null)}
      maxWidth="sm"
    >
      <Stack mt={2}>
        <TextField
          error={error != null}
          autoFocus={true}
          value={name}
          onChange={handleNameChange}
          helperText={error  || " " /* || `Minimo ${MIN_NAME_LENGTH} massimo ${MAX_NAME_LENGTH} caratteri` */}
          label="Nome"
          variant="outlined"
          placeholder="Nome Zona"
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <p>
                {name.length}/{MAX_NAME_LENGTH}
              </p>
            ),
          }}
        />
      </Stack>
    </ConfigDialog>
  );
}

export default AddZoneDialog;
