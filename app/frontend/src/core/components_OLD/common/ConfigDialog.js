import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { DialogContentText } from "@mui/material";



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfigDialog({
  title,
  description,
  open,
  onClose,
  onSave,
  disableSaveBtn = false,
  children,
  style,
  maxWidth = "md",
}) {

  const handleSave = ()=>{
    onSave();
    onClose();
  }

  return (
    <Dialog
      sx={{ ...style }}
      fullWidth={true}
      maxWidth={maxWidth}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={handleSave} disabled={disableSaveBtn} variant="contained">
          Crea
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfigDialog;
