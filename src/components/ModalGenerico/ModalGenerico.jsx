import React, { useEffect, useState } from "react";
import "./ModalGenerico.css";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  TextField,
} from "@mui/material";
const ModalGenerica = ({
  open,
  onClose,
  onAccept,
  title,
  inputLabel,
  inputValue,
  onInputChange,
  onCheckboxChange,
  estadoBoton,
  setEstadoBoton,
}) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [error, setError] = useState("error");
  const [mensaje, setMensaje] = useState("Algo Explotó :/");
  const [desableBoton, setDesableBoton] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const handleMensaje = () => {
    let mensaje = "";
    if (inputValue.length <= 0) {
      mensaje = "Debe llenar el campo nombre";
      setError("warning");
    }
    setOpenAlert(true);
    setMensaje(mensaje);
  };

  const aceptModal = async () => {
    setDesableBoton(true);
    await onAccept();
    setDesableBoton(false);
    setOpenAlert(true);
    // let mensaje =""
    // mensaje = Se agreg title;
    setMensaje(mensaje);
  };

  return (
    <>
      <Dialog open={open} disableBackdropClick={true}>
        <DialogContent className="modal_content">
          <DialogTitle className="titulo">AGREGAR {title}</DialogTitle>
          <div className="contModal">
            <FormControlLabel
              control={
                <Checkbox
                  onChange={onCheckboxChange}
                  defaultChecked
                  sx={{
                    color: "black",
                    "&.Mui-checked": {
                      color: "black",
                    },
                  }}
                />
              }
              label="Habilitado"
              className="checkBoxNorma"
              labelPlacement="start"
            />
            <TextField
              label={inputLabel}
              value={inputValue}
              onChange={onInputChange}
              fullWidth
              className="inputNorma"
              margin="normal"
            />
          </div>
          <DialogActions className="btnEditarNorma">
            {inputValue === "" || !inputValue ? (
              <Button
                onClick={handleMensaje}
                color="primary"
                variant="contained"
              >
                Aceptar
              </Button>
            ) : (
              <Button
                onClick={aceptModal}
                color="primary"
                variant="contained"
                disabled={desableBoton}
              >
                Aceptar
              </Button>
            )}

            <Button
              onClick={onClose}
              color="primary"
              variant="contained"
              disabled={desableBoton}
            >
              Cancelar
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert
          onClose={handleClose}
          severity={error}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {mensaje}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalGenerica;
