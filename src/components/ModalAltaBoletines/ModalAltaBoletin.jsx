import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import "../Form/FormAvanzada.css";

export const ModalAltaBoletin = ({ abrir, onConfirm }) => {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setOpenModal(abrir);
  }, [abrir]);

  const handleAcept = () => {
    onConfirm(true);
  };

  const handleCloseModal = () => {
    onConfirm(false);
    setOpenModal(false);
  };

  return (
    <div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="modal-busqueda-avanzada">
          <h3 className="tituloBusquedaAvanzada">Confirmación de envío</h3>
          <h4 className="tituloBusquedaAvanzada">Está seguro de que los datos ingresados son correctos?</h4>
          <Box
            className="modal-content d-flex flex-row"
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <Button
              variant="contained"
              className="btnAvanzada"
              onClick={handleAcept}
            >
              Aceptar
            </Button>
            <Button
              variant="contained"
              className="btnAvanzada"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
