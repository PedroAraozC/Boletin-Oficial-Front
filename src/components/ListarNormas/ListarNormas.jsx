import React, { useEffect, useState } from "react";
import "../ListarNormas/ListarNormas.css";
import "../TablaBoletines/ListadoBoletines.css";
import "../TablasEdicion/TablasEdicion.css";
import useGet from "../../hook/useGet";
import { axios } from "../../config/axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";
import EditarNormaDialog from "../EditarNormaDialog/EditarNormaDialog";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModalGenerica from "../ModalGenerico/ModalGenerico";
import TableLoader from "../TableLoader/TableLoader";

const TablaNormas = () => {
  const [normas, loading, setNormas] = useGet("/norma/listado", axios);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingNorma, setEditingNorma] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [normaInput, setNormaInput] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [nombreCampoEditado, setNombreCampoEditado] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [mensaje, setMensaje] = useState("Algo Explotó :/");
  const [error, setError] = useState("error");
  const [botonState, setBotonState] = useState(false);

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
    setOpen(false);
  };

  const algoSalioMal = () => {
    setOpenAlert(true);
    setMensaje("Algo salió mal. Recargue e intente nuevamente");
    setError("error");
  };

  const handleAcceptModal = async (norma, habilita) => {
    setBotonState(true);
    try {
      await axios.post(`/norma/alta`, { norma, habilita }).then((response) => {
        cargarNormas();
        setNormaInput("");
        setOpenModal(false);
        setCheckboxValue(true);
      });
      setOpenAlert(true);
      setMensaje("Norma guardada con éxito!");
      setError("success");
    } catch (error) {
      console.error("Error al guardar Norma:", error);
      algoSalioMal();
    }
    handleCloseModal();
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

  const handleEdit = (norma) => {
    setBotonState(true);
    try {
      setEditingNorma({ ...norma });
      setOpenDialog(true);
      const nombreCampo = obtenerNombreCampoPorPosicion(norma, 1);
      setNombreCampoEditado(nombreCampo);
    } catch (error) {
      console.error("Error al editar Norma:", error);
      algoSalioMal();
    }
    setBotonState(false);
  };

  const handleDelete = async (normaId) => {
    const habilita = 0;
    setBotonState(true);
    try {
      const response = await axios.patch(`/norma/deshabilitar`, {
        normaId,
        habilita,
      });

      // console.log(botonState, "delete");
      setOpenAlert(true);
      setMensaje("Norma deshabilitada");
      setError("error");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      algoSalioMal();
    }
    cargarNormas();
  };

  const handleCancel = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setBotonState(false);
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "id_norma") {
      setEditingNorma((prevNorma) => ({
        ...prevNorma,
        [name]: value,
      }));
    }
  };
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setEditingNorma((prevValues) => ({
      ...prevValues,
      habilita: isChecked,
    }));
  };
  const cargarNormas = async () => {
    setBotonState(true);
    await axios
      .get("/norma/listado")
      .then((response) => {
        setNormas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener normas:", error);
        algoSalioMal();
      });
    setBotonState(false);
    // console.log(botonState, "cargar");
  };

  const handleSave = async (updatedNormas) => {
    setBotonState(true);
    if (editingNorma) {
      try {
        const { id_norma, tipo_norma, habilita } = editingNorma;
        const respuesta = await axios.put(`/norma/editar`, {
          id_norma,
          tipo_norma,
          habilita,
        });
        setEditingNorma(null);
        setOpenDialog(false);
        setNombreCampoEditado("");
        setOpenAlert(true);
        setMensaje("Norma guardada con éxito!");
        setError("success");
      } catch (error) {
        console.error("Error al guardar cambios:", error);
        algoSalioMal();
      }
    }
    cargarNormas();
  };

  useEffect(() => {
    cargarNormas();
    // console.log(botonState, "estado botonete");
  }, []);
  // useEffect(() => {
  //   console.log(botonState, "estado botonete");
  // }, [botonState]);

  const columns = [
    {
      id: "id_norma",
      label: "ID de Norma",
      align: "center",
    },
    {
      id: "tipo_norma",
      label: "Tipo de Norma",
      align: "center",
    },
    { id: "habilita", label: "Habilita", align: "center" },
  ];

  useEffect(() => {}, [editingNorma?.habilita]);

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
                    {normas
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((norma, rowIndex) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={rowIndex}
                          className={
                            rowIndex % 2 === 0 ? "tableRowEven" : "tableRowOdd"
                          }
                        >
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              width={column.minWidth}
                            >
                              {column.id === "habilita" ? (
                                norma[column.id] ? (
                                  <p className="habilitado">Habilitado</p>
                                ) : (
                                  <p className="deshabilitado">Deshabilitado</p>
                                )
                              ) : (
                                norma[column.id] !== "acciones" &&
                                norma[column.id]
                              )}
                            </TableCell>
                          ))}

                          <TableCell className="d-flex justify-content-center">
                            {botonState ? (
                              <EditIcon className="iconEdit-desabled" color="primary" />
                            ) : (
                              // <></>
                              <EditIcon
                                onClick={() => handleEdit(norma)}
                                className="iconEdit"
                                color="primary"
                              />
                            )}
                            {norma.habilita === 1 && !botonState ? (
                              <DeleteIcon
                                className="iconDelete"
                                onClick={() => handleDelete(norma.id_norma)}
                              />
                            ) : (
                              <DeleteIcon className="iconDelete-desabled" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {normas.length / rowsPerPage < 1 && rowsPerPage === 10 ? (
                <TablePagination
                  className="pagination"
                  rowsPerPageOptions={[]}
                  component="div"
                  count={1}
                  rowsPerPage={1}
                  page={0}
                  labelDisplayedRows={({ from, to, count }) => {
                    const currentPage = Math.ceil(from / rowsPerPage);
                    const totalPages = Math.ceil(count / rowsPerPage);
                    return `${currentPage} de ${totalPages}`;
                  }}
                />
              ) : (
                <TablePagination
                  className="pagination "
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={normas.length}
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
                editingNorma={editingNorma}
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
                onAccept={() => handleAcceptModal(normaInput, checkboxValue)}
                title="NORMA"
                inputLabel="Nombre de la Norma"
                inputValue={normaInput}
                onInputChange={(e) => setNormaInput(e.target.value)}
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
        <>
          <div className="btnTablas">
            <AddCircleIcon
              className="btnAddNorma"
              color="primary"
              variant="contained"
              onClick={handleOpenModal}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
export default TablaNormas;
