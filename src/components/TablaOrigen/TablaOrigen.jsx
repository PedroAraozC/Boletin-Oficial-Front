import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import useGet from "../../hook/useGet";
import { axios } from "../../config/axios";
import ModalGenerica from "../ModalGenerico/ModalGenerico";
import EditarNormaDialog from "../EditarNormaDialog/EditarNormaDialog";
import "../ListarNormas/ListarNormas.css";
import "../TablasEdicion/TablasEdicion.css";
import TableLoader from "../TableLoader/TableLoader";
const TablaOrigen = () => {
  const [origen, loading, setOrigen] = useGet("/origen/listado", axios);
  const [editOrigen, setEditOrigen] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [origenInput, setOrigenInput] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [nombreCampoEditado, setNombreCampoEditado] = useState("");
  const [botonState, setBotonState] = useState(false);
  const [mensaje, setMensaje] = useState("Algo Explotó :/");
  const [openAlert, setOpenAlert] = useState(false);
  const [error, setError] = useState("error");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  function obtenerNombreCampoPorPosicion(objeto, posicion) {
    var keys = Object.keys(objeto);
    if (posicion >= 0 && posicion < keys.length) {
      return keys[posicion];
    } else {
      return null;
    }
  }
  const handleEdit = (Origen) => {
    setEditOrigen((prevOrigen) => ({ ...prevOrigen, ...Origen }));
    setOpenDialog(true);
    const nombreCampo = obtenerNombreCampoPorPosicion(Origen, 1);
    setNombreCampoEditado(nombreCampo);
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setEditOrigen((prevValues) => ({
      ...prevValues,
      habilita: isChecked,
    }));
  };

  const handleCancel = (event, reason) => {
    setOpenDialog(false);
  };

  const algoSalioMal = () => {
    setOpenAlert(true);
    setMensaje("Algo salió mal. Recargue e intente nuevamente");
    setError("error");
  };

  const handleAcceptModal = async (nombre_origen, habilita) => {
    setBotonState(true);
    try {
      await axios
        .post(`/origen/alta`, { nombre_origen, habilita })
        .then((response) => {
          cargarOrigen();
          setEditOrigen(null);
          setOpenDialog(false);
        });
      setOpenAlert(true);
      setMensaje("Origen guardado con éxito!");
      setError("success");
    } catch (error) {
      console.error("Error al guardar Origen:", error);
      algoSalioMal();
    }
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "id_origen") {
      setEditOrigen((prevOrigen) => ({
        ...prevOrigen,
        [name]: value,
      }));
    }
  };

  const handleDelete = async (origenId) => {
    const habilita = 0;
    setBotonState(true);
    try {
      const response = await axios
        .patch(`/origen/deshabilitar`, { origenId, habilita })
        .then((response) => {
          setOpenAlert(true);
          setMensaje("origen deshabilitado");
          setError("error");
        });
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      algoSalioMal();
    }
    cargarOrigen();
  };

  const cargarOrigen = async () => {
    setBotonState(true);
    const respuesta = await axios
      .get("/origen/listado")
      .then((response) => {
        setOrigen(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener Origenes:", error);
        algoSalioMal();
      });
    setBotonState(false);
  };

  const handleSave = async (updatedOrigen) => {
    setBotonState(true);
    if (editOrigen) {
      try {
        const { id_origen, nombre_origen, habilita } = editOrigen;
        const respuesta = await axios
          .put(`/origen/editar`, { id_origen, nombre_origen, habilita })
          .then((response) => {
            setEditOrigen(null);
            setOpenDialog(false);
            setNombreCampoEditado("");
            setOpenAlert(true);
            setMensaje("Origen guardado con éxito!");
            setError("success");
          });
      } catch (error) {
        console.error("Error al guardar cambios:", error);
        algoSalioMal();
      }
    }
    cargarOrigen();
  };

  const columns = [
    { id: "id_origen", label: "ID Origen", align: "center" },
    { id: "nombre_origen", label: "Nombre", align: "center" },
    { id: "habilita", label: "Habilita", align: "center" },
  ];

  useEffect(() => {}, [editOrigen]);

  return (
    <div className="tablaNormas">
      <Paper
        className="container mt-2 mb-4"
        sx={{
          padding: 0,
          margin: 0,
          width: "100%",
          boxShadow:
            "0px 2px 4px -1px rgba(165, 53, 53, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
        }}
      >
        {!loading ? (
          <>
            <div className="pt-1">
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  className="tablaEdicion"
                >
                  <TableHead>
                    <TableRow>
                      {columns.map(
                        (column) =>
                          column.id !== "acciones" && (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                              className="tableCellHeader"
                            >
                              {column.label}
                            </TableCell>
                          )
                      )}
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading ? (
                      origen
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((origen, rowIndex) => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={rowIndex}
                            className={
                              rowIndex % 2 === 0
                                ? "tableRowEven"
                                : "tableRowOdd"
                            }
                          >
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                width={column.minWidth}
                              >
                                {column.id === "habilita" ? (
                                  origen[column.id] ? (
                                    <p className="habilitado">Habilitado</p>
                                  ) : (
                                    <p className="deshabilitado">
                                      Deshabilitado
                                    </p>
                                  )
                                ) : (
                                  origen[column.id] !== "acciones" &&
                                  origen[column.id]
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="d-flex justify-content-center">
                              {botonState ? (
                                <EditIcon
                                  className="iconEdit-desabled"
                                  color="primary"
                                />
                              ) : (
                                <EditIcon
                                  onClick={() => handleEdit(origen)}
                                  className="iconEdit"
                                  color="primary"
                                />
                              )}

                              {!botonState && origen.habilita === 1 ? (
                                <DeleteIcon
                                  className="iconDelete"
                                  disabled={botonState}
                                  onClick={() => handleDelete(origen.id_origen)}
                                />
                              ) : (
                                <DeleteIcon className="iconDelete-desabled" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <></>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {origen.length / rowsPerPage < 1 && rowsPerPage === 10 ? (
                <TablePagination
                  className="pagination"
                  rowsPerPageOptions={[]}
                  component="div"
                  count={1}
                  rowsPerPage={1}
                  page={0}
                />
              ) : (
                <TablePagination
                  className="pagination"
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={origen.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelDisplayedRows={({ from, to, count }) => {
                    const currentPage = Math.ceil(from / rowsPerPage);
                    const totalPages = Math.ceil(count / rowsPerPage);
                    return `${currentPage} de ${totalPages}`;
                  }}
                  labelRowsPerPage="Filas:"
                />
              )}
              <EditarNormaDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                editingNorma={editOrigen}
                handleCheckboxChange={handleCheckboxChange}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
                nombreCampo={nombreCampoEditado}
                estadoBoton={botonState}
                setEstadoBoton={setBotonState}
              />
              <ModalGenerica
                open={openModal}
                onClose={handleCloseModal}
                onAccept={() => handleAcceptModal(origenInput, checkboxValue)}
                title="ORIGEN"
                inputLabel="Nombre del Origen"
                inputValue={origenInput}
                onInputChange={(e) => setOrigenInput(e.target.value)}
                checkboxLabel="Habilitada"
                checked={checkboxValue}
                onCheckboxChange={(e) => setCheckboxValue(e.target.checked)}
                estadoBoton={botonState}
                setEstadoBoton={setBotonState}
              />
            </div>
          </>
        ) : (
          <TableLoader filas={4} />
        )}
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
      </Paper>
      {!loading ? (
        <div className="btnTablas">
          <AddCircleIcon
            className="btnAddNorma"
            color="primary"
            variant="contained"
            onClick={handleOpenModal}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TablaOrigen;
