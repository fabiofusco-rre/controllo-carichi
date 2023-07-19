import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { DialogContentText, Stack } from "@mui/material";
import { withStyles } from '@mui/styles';


const styles = {
  dialogPaper: {
      minHeight: '90vh',
      maxHeight: '90vh',
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfigDialog({
  title,
  description,
  underDescriptionJSX = ()=>{},
  open,
  onClose,
  onSave,
  disableSaveBtn = false,
  children,
  style,
  maxWidth = "md",
  classes
}) {
  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      sx={{ ...style, minHeight:'100vh' }}
      fullWidth={true}
      maxWidth={maxWidth}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <Stack pl={3} pb={1}>
        <DialogContentText>{description}</DialogContentText>
        {underDescriptionJSX()}
      </Stack>
      <DialogContent sx={{ paddingTop: "10px" }}>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button
          onClick={handleSave}
          disabled={disableSaveBtn}
          variant="contained"
        >
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(styles)(ConfigDialog);
