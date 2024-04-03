import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import "./ListadoBoletines.css";
import useGet from "../../hook/useGet";
import axios from "../../config/axios";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Input,
  Snackbar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import File from "@mui/icons-material/UploadFileRounded";
import "../AltaBoletines/AltaBoletinesNuevo.css";
import "./ListadoBoletines.css";
import { ALTA_CONTENIDO_BOLETIN_VALUES } from "../../helpers/constantes";
import CloseIcon from "@mui/icons-material/Close";

const TablaBoletines = () => {
  const [boletines, getboletin, setBoletines] = useGet(
    "/boletin/listado",
    axios
  );
  const [contenidoBoletines, getContenidoBoletin, setContenidoBoletines] =
    useGet("/boletin/listadoContenido", axios);
  const [tiposOrigen, loadingOrigen, getTiposOrigen] = useGet(
    "/origen/listar",
    axios
  );
  const [tiposNorma, loadingNorma, getTiposNoma] = useGet(
    "/norma/listar",
    axios
  );
  const [valuesContenido, setValuesContenido] = useState(
    ALTA_CONTENIDO_BOLETIN_VALUES
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [editingBoletin, setEditingBoletin] = useState(null);
  const [contenidoEditado, setContenidoEditado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [normasAgregadasEditar, setNormasAgregadasEditar] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("error");
  const [mensaje, setMensaje] = useState("Algo Explotó :/");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (boletin) => {
    const editedBoletin = { ...boletin };
    if (editedBoletin.fecha_publicacion) {
      editedBoletin.fecha_publicacion = editedBoletin.fecha_publicacion.slice(
        0,
        10
      );
    }
    setEditingBoletin(editedBoletin);

    const contenidoEditado = contenidoBoletines.filter(
      (contenido) => contenido.id_boletin === editedBoletin.id_boletin
    );
    if (contenidoEditado.length > 0) {
      setContenidoEditado(contenidoEditado);
      contenidoEditado.forEach((contenido) => {
        const nombreNorma = tiposNorma.find(
          (norma) => norma.id_norma === contenido.id_norma
        );
        const nombreOrigen = tiposOrigen.find(
          (origen) => origen.id_origen === contenido.id_origen
        );

        if (nombreNorma && nombreOrigen) {
          const nuevaNorma = {
            id_contenido_boletin: contenido.id_contenido_boletin,
            norma: contenido.id_norma,
            tipo_norma: nombreNorma.tipo_norma,
            numero: contenido.nro_norma,
            nombre_origen: nombreOrigen.nombre_origen,
            origen: contenido.id_origen,
            año: contenido.fecha_norma,
            habilita: contenido.habilita,
          };
          setNormasAgregadasEditar((prevNormas) => [...prevNormas, nuevaNorma]);
        }
      });
    } else {
      console.error("No se encontró el contenido del boletin editado.");
    }
    setContenidoEditado(contenidoEditado);
    setOpenDialog(true);
  };
  useEffect(() => {}, [normasAgregadasEditar]);

  const validarNormasAgregadas = () => {
    const normasRepetidas = normasAgregadasEditar.filter((norma, index) => {
      return normasAgregadasEditar.some(
        (otraNorma, otroIndex) =>
          otraNorma.norma.id_norma === norma.norma.id_norma &&
          otraNorma.numero === norma.numero &&
          otraNorma.habilita === norma.habilita &&
          index !== otroIndex
      );
    });
    return normasRepetidas;
  };
  const handleAgregarNormaEditar = () => {
    const nuevaNorma = {
      id_contenido_boletin: -1 * (normasAgregadasEditar.length + 1),
      norma: valuesContenido.norma.id_norma,
      tipo_norma: valuesContenido.norma.tipo_norma,
      numero: valuesContenido.nroNorma,
      nombre_origen: valuesContenido.origen.nombre_origen,
      origen: valuesContenido.origen.id_origen,
      año: valuesContenido.fechaNormaBoletin,
      habilita: 1,
    };
    setNormasAgregadasEditar([...normasAgregadasEditar, nuevaNorma]);
    setValuesContenido(ALTA_CONTENIDO_BOLETIN_VALUES);
  };

  const numeroBoletinDisponible = (numeroBoletin, idBoletin) => {
    const numero = numeroBoletin.toString();
    const id = idBoletin;
    const existe = boletines.some(
      (boletin) => boletin.nro_boletin === numero && boletin.id_boletin !== id
    );
    return existe;
  };

  const handleMensajeEditar = () => {
    let mensaje = "";
    if (editingBoletin.nro_boletin === "") {
      mensaje = "Debe ingresar el Nº de Boletín";
      setError("error");
    } else if (numeroBoletinDisponible(editingBoletin.nro_boletin)) {
      mensaje = `El Nº de Boletín ${editingBoletin.nro_boletin} ya existe!`;
      setError("error");
    } else if (editingBoletin.fecha_publicacion === "") {
      mensaje = "Debe ingresar la fecha del Boletín";
      setError("warning");
    } else {
      mensaje = "Recarga la pagina";
      setError("warning");
      return;
    }
    setOpen(true);
    setMensaje(mensaje);
  };
  const handleMensajeContenidoEditar = () => {
    let mensaje = "";
    if (!valuesContenido.norma || valuesContenido.norma === "") {
      mensaje = "Debe seleccionar la Norma";
      setError("warning");
    } else if (!valuesContenido.origen || valuesContenido.origen === "") {
      mensaje = "Debe ingresar la Secretaría";
    } else if (
      !valuesContenido.fechaNormaBoletin ||
      valuesContenido.fechaNormaBoletin === ""
    ) {
      mensaje = "Debe ingresar la fecha de Norma";
      setError("warning");
    } else if (!valuesContenido.nroNorma || valuesContenido.nroNorma === "") {
      mensaje = "Debe ingresar el Nro de norma";
      setError("warning");
    } else {
      mensaje = "Recarga la pagina";
      return;
    }
    setOpen(true);
    setMensaje(mensaje);
  };

  const handleEliminarNorma = (id_contenido_boletin) => {
    const nuevasNormas = normasAgregadasEditar.map((norma) =>
      norma.id_contenido_boletin === id_contenido_boletin
        ? { ...norma, habilita: 0 }
        : norma
    );
    setNormasAgregadasEditar(nuevasNormas);
  };

  const handleCancel = () => {
    setNormasAgregadasEditar([]);
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBoletin((prevBoletin) => ({
      ...prevBoletin,
      [name]: value,
    }));
    setValuesContenido({
      ...valuesContenido,
      [name]: value,
    });
    // }
  };
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setEditingBoletin((prevValues) => ({
      ...prevValues,
      habilita: isChecked,
    }));
  };

  const handleGuardar = () => {
    handleSave();
    cargarBoletines();
  };

  const cargarBoletines = () => {
    axios
      .get("/boletin/listado")
      .then((response) => {
        setBoletines(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener boletines:", error);
        setLoading(false);
      });
    axios
      .get("/boletin/listadoContenido")
      .then((response) => {
        setContenidoBoletines(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener contenido de boletines:", error);
        setLoading(false);
      });
  };

  const handleSave = () => {
    try {
      const { id_boletin, nro_boletin, fecha_publicacion, habilita } =
        editingBoletin;
      axios
        .put(`/boletin/editar`, {
          id_boletin,
          nro_boletin,
          fecha_publicacion,
          habilita,
          normasAgregadasEditar,
        })
        .then((response) => {
          cargarBoletines();
          setEditingBoletin(null);
          setOpenDialog(false);
          setNormasAgregadasEditar([]);
        })
        .catch((error) => {
          console.error("Error al guardar cambios:", error);
        });
    } catch (error) {
      setNormasAgregadasEditar([]);
      console.error("Error al guardar cambios:", error);
    }
  };
  useEffect(() => {
    getTiposOrigen();
    setLoading(false);
    cargarBoletines();
  }, []);

  useEffect(() => {
    if (openDialog === false) {
      cargarBoletines();
    }
  }, [openDialog]);

  const columns = [
    {
      id: "id_boletin",
      label: "ID de Boletin",
      width: "auto",
      align: "center",
    },
    {
      id: "nro_boletin",
      label: "Nro de Boletin",
      width: "auto",
      align: "center",
    },
    {
      id: "fecha_publicacion",
      label: "Fecha de Publicacion",
      minWidth: 100,
      align: "center",
    },
    { id: "habilita", label: "Habilita", width: "auto", align: "center" },
    { id: "acciones", label: "Acciones", width: "auto", align: "center" },
  ];

  return (
    <Paper
      className="container mt-4"
      sx={{
        width: "100%",
        boxShadow:
          "0px 2px 4px -1px rgba(165, 53, 53, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
      }}
    >
      <div className="pt-1">
        <TableContainer sx={{ maxHeight: 452 }}>
          <Table stickyHeader aria-label="sticky table">
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
                <TableCell align="center" colSpan={6}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boletines
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((boletin, rowIndex) => (
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
                      <TableCell key={column.id} align={column.align}>
                        {column.id === "habilita" ? (
                          boletin[column.id] ? (
                            <p className="habilitado">Habilitado</p>
                          ) : (
                            <p className="deshabilitado ">Deshabilitado</p>
                          )
                        ) : column.id === "fecha_publicacion" ? (
                          <span>{boletin[column.id].slice(0, 10)}</span>
                        ) : column.id === "id_boletin" ? (
                          boletin[column.id]
                        ) : (
                          boletin[column.id]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <EditIcon
                        onClick={() => handleEdit(boletin)}
                        className="iconEdit"
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={boletines.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        className="modalEditar"
        disableBackdropClick={true}
        open={openDialog}
      >
        <DialogContent disableBackdropClick={true}>
          {editingBoletin && contenidoEditado && (
            <>
              <Box
                component="form"
                id="form"
                noValidate
                encType="multipart/form-data"
                autoComplete="on"
                className="contBoxAltaBoletinesEditar pt-0 container"
              >
                <div className="contAltaBoletines mt-0">
                  <Box className="formGroup flex-col pb-1 pt-3 ">
                    <div className="contRangoEditar d-flex align-items-center mt-0">
                      <div>
                        <div className="d-flex flex-column mt-0 ">
                          <div className="encabezadoBoletin mt-0">
                            <div className="d-flex justify-content-between text-align-start mt-0">
                              <h5 className="mt-2">Boletin:</h5>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    defaultChecked
                                    sx={{
                                      color: "white",
                                      "&.Mui-checked": {
                                        color: "white",
                                      },
                                    }}
                                    checked={editingBoletin.habilita}
                                    onChange={handleCheckboxChange}
                                  />
                                }
                                label="Habilitado"
                                labelPlacement="start"
                              />
                            </div>
                            <div className="d-flex flex-row pe-2 mt-0 ">
                              <TextField
                                name="nro_boletin"
                                label="Nro de Boletín"
                                variant="outlined"
                                className="inputAltaBoletin pt-0"
                                type="number"
                                value={editingBoletin.nro_boletin}
                                onChange={handleInputChange}
                                inputProps={{ min: "0" }}
                              />

                              <TextField
                                label="Fecha Publicación"
                                variant="outlined"
                                name="fecha_publicacion"
                                type="date"
                                className="inputAltaBoletin ms-3 pt-0"
                                value={editingBoletin.fecha_publicacion}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                              />
                            </div>
                            <hr className="mt-3 mb-1" />
                          </div>

                          <div className="cuerpoBoletin mt-0">
                            <div className="d-flex flex-row mt-0">
                              <div className=" cuerpoBoletinForm ">
                                <FormControl
                                  sx={{ minWidth: 80 }}
                                  className="mb-3 "
                                >
                                  <InputLabel id="demo-simple-select-autowidth-label">
                                    Norma
                                  </InputLabel>
                                  <Select
                                    labeld="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={valuesContenido.norma}
                                    onChange={handleInputChange}
                                    autoWidth
                                    label="Norma"
                                    name="norma"
                                  >
                                    <MenuItem value="">
                                      <em>--Seleccione--</em>
                                    </MenuItem>
                                    {tiposNorma.map((norma) => (
                                      <MenuItem
                                        key={norma.id_norma}
                                        value={norma}
                                      >
                                        {norma.tipo_norma}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                <FormControl
                                  sx={{ minWidth: 80 }}
                                  className="mb-3"
                                >
                                  <InputLabel id="demo-simple-select-autowidth-label">
                                    Secretaría de Origen
                                  </InputLabel>
                                  <Select
                                    labeld="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={valuesContenido.origen}
                                    onChange={handleInputChange}
                                    autoWidth
                                    label="Secretaría de Origen"
                                    name="origen"
                                  >
                                    <MenuItem value="">
                                      <em>--Seleccione--</em>
                                    </MenuItem>
                                    {tiposOrigen.map((origen) => (
                                      <MenuItem
                                        key={origen.id_origen}
                                        value={origen}
                                      >
                                        {origen.nombre_origen}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                <TextField
                                  label="Fecha Norma"
                                  variant="outlined"
                                  name="fechaNormaBoletin"
                                  type="date"
                                  className="inputAltaBoletin mb-3"
                                  value={valuesContenido.fechaNormaBoletin}
                                  onChange={handleInputChange}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  label="Nº de Norma"
                                  className="inputAltaBoletin mb-3"
                                  type="number"
                                  value={valuesContenido.nroNorma}
                                  onChange={handleInputChange}
                                  name="nroNorma"
                                />
                                {valuesContenido.nroNorma !== "" &&
                                valuesContenido.origen !== "" &&
                                valuesContenido.fechaNormaBoletin !== "" &&
                                valuesContenido.norma !== "" ? (
                                  <Button
                                    type="button"
                                    className="btnAgregar"
                                    variant="contained"
                                    onClick={handleAgregarNormaEditar}
                                  >
                                    Agregar Norma
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    className="btnAgregar"
                                    variant="contained"
                                    onClick={handleMensajeContenidoEditar}
                                  >
                                    Agregar Norma
                                  </Button>
                                )}
                              </div>
                              <div className="listadoPrueba container">
                                <div className="listadoNormas">
                                  {normasAgregadasEditar
                                    .filter((norma) => norma.habilita === 1)
                                    .map((norma, index) => (
                                      <div
                                        key={norma.id_contenido_boletin}
                                        className={`norma ${
                                          validarNormasAgregadas().some(
                                            (n) => n === norma
                                          )
                                            ? "normaRepetida mt-2"
                                            : "norma mt-2"
                                        }`}
                                      >
                                        {norma.tipo_norma} Nº {norma.numero}/
                                        {norma.nombre_origen}/
                                        {norma.año.slice(0, 4)}{" "}
                                        <CloseIcon
                                          className="X"
                                          fontSize="small"
                                          onClick={() =>
                                            handleEliminarNorma(
                                              norma.id_contenido_boletin
                                            )
                                          }
                                        />
                                        s{" "}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr className="mt-4 mb-3" />

                          <Box className="contInputFileBoletin">
                            <label className="fileNameDisplay flex-column">
                              <Input
                                className="inputFileAltaBoletin"
                                type="file"
                                id="fileBoletin"
                                name="archivoBoletin"
                                accept="application/pdf"
                                required
                              />

                              <File />
                            </label>
                          </Box>
                        </div>
                      </div>
                    </div>
                  </Box>
                </div>
                <DialogActions>
                  {editingBoletin.nro_boletin !== "" &&
                  editingBoletin.fecha_publicacion !== "" &&
                  editingBoletin.nro_boletin !== "undefined" &&
                  editingBoletin.fecha_publicacion !== "undefined" &&
                  numeroBoletinDisponible(
                    editingBoletin.nro_boletin,
                    editingBoletin.id_boletin
                  ) === false ? (
                    <>
                      <Button
                        onClick={handleGuardar}
                        color="primary"
                        variant="contained"
                      >
                        Guardar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleMensajeEditar}
                        color="primary"
                        variant="contained"
                      >
                        Guardar
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={handleCancel}
                    color="primary"
                    variant="contained"
                  >
                    Cancelar
                  </Button>
                </DialogActions>
                <Snackbar autoHideDuration={6000}>
                  <Alert variant="filled" sx={{ width: "100%" }}></Alert>
                </Snackbar>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
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
  );
};
export default TablaBoletines;
