import React, { useContext, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ListadoBoletines.css";
import useGet from "../../hook/useGet";
import { axios } from "../../config/axios";
import File from "@mui/icons-material/UploadFileRounded";
import FileUp from "@mui/icons-material/FileUpload";
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
import "../AltaBoletines/AltaBoletinesNuevo.css";
import "../ListarNormas/ListarNormas.css";
import TableLoader from "../TableLoader/TableLoader";
import {
  ALTA_CABECERA_BOLETIN_VALUES,
  ALTA_CONTENIDO_BOLETIN_VALUES,
} from "../../helpers/constantes";
import CloseIcon from "@mui/icons-material/Close";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BolContext } from "../../context/BolContext";
import loader from "../../assets/logo-SMT-Blanco.png";
import LoaderMuni from "../../components/LoaderMuni/LoaderMuni.jsx";

const TablaBoletines = () => {
  const [boletines, loading, setBoletines] = useGet("/boletin/listado", axios);
  const [contenidoBoletines, getContenidoBoletin, setContenidoBoletines] =
    useGet("/boletin/listadoContenido", axios);
  const boletinesInvertidos = boletines.slice().reverse().slice();
  const [tiposOrigen, loadingOrigen, getTiposOrigen] = useGet(
    "/origen/listar",
    axios
  );
  const [tiposNorma, loadingNorma, getTiposNoma] = useGet(
    "/norma/listar",
    axios
  );
  const [valuesCabecera, setValuesCabecera] = useState(
    ALTA_CABECERA_BOLETIN_VALUES
  );
  const [valuesContenido, setValuesContenido] = useState(
    ALTA_CONTENIDO_BOLETIN_VALUES
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [editingBoletin, setEditingBoletin] = useState(null);
  const [contenidoEditado, setContenidoEditado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [normasAgregadasEditar, setNormasAgregadasEditar] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("error");
  const [mensaje, setMensaje] = useState("Algo Explotó :/");
  const [selectedFileName, setSelectedFileName] = useState(
    "Seleccione un Archivo"
  );
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [botonState, setBotonState] = useState(false);
  const { user } = useContext(BolContext);
  const [bandera, setBandera] = useState(false);

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

  const algoSalioMal = () => {
    setOpen(true);
    setMensaje("Algo salió mal. Recargue e intente nuevamente");
    setError("error");
  };

  const handleChangeFile = (e) => {
    const fileName = e.target.files[0]?.name || "";
    setSelectedFileName(fileName);
    if (!fileName.toLowerCase().endsWith(".pdf")) {
      setOpen(true);
      setMensaje("El archivo solo puede ser PDF");
      setError("warning");
    } else {
      setOpen(false);
    }
    const aux = e.target.files[0];
    setArchivoSeleccionado(aux);
  };

  const handleEdit = (boletin) => {
    const editedBoletin = { ...boletin };
    setBotonState(true);

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
      algoSalioMal();
    }
    setBotonState(false);
    setContenidoEditado(contenidoEditado);
    setOpenDialog(true);
  };

  const validarNormasAgregadas = () => {
    const normasRepetidas = normasAgregadasEditar.filter((norma, index) => {
      // console.log(otraNorma,"otranorma")
      // console.log(norma, "norma");
      return normasAgregadasEditar.some(
        (otraNorma, otroIndex) =>
          otraNorma.norma.id_norma === norma.norma.id_norma &&
          otraNorma.numero === norma.numero &&
          otraNorma.origen === norma.origen &&
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
    if (validarNormasAgregadas().length > 0) {
      mensaje =
        "No puede estar la misma Norma con el mismo Nº de Norma repetido ";
      setError("warning");
    } else if (archivoSeleccionado == null) {
      console.log(archivoSeleccionado);
      mensaje = "Debe ingresar un archivo PDF para guardar los cambios";
      setError("warning");
    } else if (editingBoletin.nro_boletin === "") {
      mensaje = "Debe ingresar el Nº de Boletín";
      setError("error");
    } else if (editingBoletin.nro_boletin.length > 10) {
      mensaje = "El Nº de Boletín no puede contener mas de 10 digitos.";
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
    setSelectedFileName("Seleccione un Archivo");
    setNormasAgregadasEditar([]);
    setValuesCabecera(ALTA_CABECERA_BOLETIN_VALUES);
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
    console.log(archivoSeleccionado);
    // cargarBoletines();
  };

  const cargarBoletines = async () => {
    setBotonState(true);
    setBandera(true);
    await axios
      .get("/boletin/listado")
      .then((response) => {
        setBoletines(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener boletines:", error);
      });
    await axios
      .get("/boletin/listadoContenido")
      .then((response) => {
        setContenidoBoletines(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener contenido de boletines:", error);
        algoSalioMal();
      });
    setBotonState(false);
    setBandera(false);
  };

  const handleSave = async () => {
    setBotonState(true);
    setBandera(true);

    if (editingBoletin) {
      try {
        // console.log(archivoSeleccionado, "archivo seleccionado");
        const { id_boletin, nro_boletin, fecha_publicacion, habilita } =
          editingBoletin;
        const requestData = {
          id_boletin,
          nro_boletin,
          fecha_publicacion,
          habilita,
          normasAgregadasEditar,
        };
        formData.append("requestData", JSON.stringify(requestData));
        formData.append("archivoBoletin", archivoSeleccionado);
        setFormData(formData);
        // console.log([formData], "fomrData");
        const respuesta = await axios.put(`/boletin/editar`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // console.log(respuesta, "respuesta");
        // cargarBoletines();

        setOpenDialog(false);
        setValuesCabecera(ALTA_CABECERA_BOLETIN_VALUES);
        setSelectedFileName("Seleccione un Archivo");
        setOpen(true);
        setMensaje(
          `Boletin Nº${editingBoletin.nro_boletin} editado con éxito!`
        );
        setError("success");
        setNormasAgregadasEditar([]);
        setFormData(new FormData());
      } catch (error) {
        setValuesCabecera("");
        setNormasAgregadasEditar([]);
        console.error("Error al guardar cambios:", error);
        algoSalioMal();
      }
    }
    setArchivoSeleccionado(null);
    cargarBoletines();
  };

  const handleDelete = async (boletin) => {
    // console.log(boletin, "boletin delete");
    try {
      setBotonState(true);
      setBandera(true);

      const { id_boletin } = boletin;
      const habilita = 0;

      const response = await axios
        .patch(`/boletin/deshabilitar`, {
          id_boletin,
          habilita,
        })
        .then((response) => {
          // console.log(response.data);
          // setBoletines(updatedBoletin);
          // handleSave(updatedBoletin);
          // console.log(updatedBoletin);
          cargarBoletines();
          setOpen(true);
          setMensaje(`Boletin nº ${boletin.nro_boletin} deshabilitado`);
          setError("error");
        });
    } catch (error) {
      setValuesCabecera("");
      setNormasAgregadasEditar([]);
      console.error("Error al guardar cambios:", error);
      algoSalioMal();
    }
    // setBotonState(false);
  };

  useEffect(() => {
    // getTiposOrigen();

    cargarBoletines();
  }, []);
  useEffect(() => {
    archivoSeleccionado;
  }, [archivoSeleccionado]);

  const funcionVerPDF = async (boletin) => {
    try {
      setBotonState(true);
      // console.log(boletin);
      const response = await axios.get(
        `/boletin/verPdf/${boletin.id_boletin}`,
        // `http://localhost:3500/boletin/verPdf/${boletin.id_boletin}`,
        {
          responseType: "blob",
        }
      );
      // console.log(response);
      const blob = response.data;
      const url = URL.createObjectURL(blob);

      // Crear una nueva ventana
      const printWindow = window.open("");
      if (printWindow) {
        // Escribir el contenido del PDF en la ventana
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir PDF</title>
            </head>
            <body style="margin:0;">
              <iframe id="pdf-frame" src=${url} style="width:100%;height:100%;" frameborder="0"></iframe>
            </body>
          </html>
        `);
        // Esperar a que el iframe se cargue completamente y luego llamar a print
      } else {
        console.error("No se pudo abrir la ventana de impresión.");
      }
      // handlePdfPreview(url);
    } catch (error) {
      if (error.response.status === 404) {
        setOpen(true);
        setMensaje("No se encontró archivo del boletin solicitado");
        setError("warning");
        console.log("algo explotó! :(", error);
      } else {
        setOpen(true);
        setMensaje("Error en la conexión");
        setError("warning");
        console.log("algo explotó! :(", error);
      }
    }

    setBotonState(false);
  };

  const columns = [
    {
      id: "id_boletin",
      label: "ID de Boletin",
      align: "center",
    },
    {
      id: "nro_boletin",
      label: "Nro de Boletin",
      align: "center",
    },
    {
      id: "fecha_publicacion",
      label: "Fecha de Publicacion",
      align: "center",
    },
    { id: "habilita", label: "Habilita", align: "center" },
  ];

  return (
    <div className="pt-5">
      <h3 className="text-center">LISTADO BOLETINES</h3>

      <Paper
        className="container mt-4 mb-4"
        sx={{
          padding: 0,
          width: "100%",
          boxShadow:
            "0px 2px 4px -1px rgba(165, 53, 53, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
        }}
      >
        {!loading ? (
          <>
            <div className="pt-1">
              <TableContainer sx={{ maxHeight: 452 }}>
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
                              align="center"
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
                    {boletinesInvertidos
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
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
                                  <p className="deshabilitado ">
                                    Deshabilitado
                                  </p>
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
                          <TableCell align="center" className="celdaAcciones">
                            {/* {botonState ? (
                              <EditIcon
                                className="iconEdit-desabled"
                                color="primary"
                              />
                            ) : ( 
                              <></>
                             */}
                            <button
                              onClick={() => handleEdit(boletin)}
                              disabled={botonState}
                              className="buttonDelete"
                            >
                              <EditIcon className="iconEdit" color="primary" />
                            </button>
                            {/* )} */}
                            {/* {!botonState && boletin.habilita === 1 ? ( */}
                            <button
                              onClick={() => handleDelete(boletin)}
                              className="buttonDelete"
                              disabled={!botonState && boletin.habilita !== 1}
                            >
                              <DeleteIcon className="iconDelete" />
                            </button>
                            {/* ) : (
                              <DeleteIcon className="iconDelete-desabled" />
                              // <></>
                            )} */}
                            {(user?.id_tusuario === 1 ||
                              user?.id_persona === 736) && (
                              <button
                                onClick={() => funcionVerPDF(boletin)}
                                disabled={botonState}
                                className="buttonDelete"
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="icono-ver-pdf"
                                />
                              </button>
                              // ) : (
                              // botonState ? (
                              //   <FontAwesomeIcon
                              //     icon={faEye}
                              //     className="icono-ver-pdf-desabled"
                              //   />
                              // ) : (
                              //   // <></>
                              // )
                              // <></>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {boletines.length / rowsPerPage < 1 && rowsPerPage === 10 ? (
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
                count={boletines.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) => {
                  const currentPage = Math.ceil(from / rowsPerPage);
                  const totalPages = Math.ceil(count / rowsPerPage);
                  return `${currentPage} de ${totalPages} páginas`;
                }}
                labelRowsPerPage="Filas por página:"
              />
            )}
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
                                            color: "BLACK",
                                            "&.Mui-checked": {
                                              color: "BLACK",
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
                                      inputProps={{
                                        min: "0",
                                        max: "9999999999",
                                      }}
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
                                        value={
                                          valuesContenido.fechaNormaBoletin
                                        }
                                        onChange={handleInputChange}
                                        InputLabelProps={{ shrink: true }}
                                      />
                                      <TextField
                                        label="Nº de Norma"
                                        className="inputAltaBoletin mb-3"
                                        type="number"
                                        value={valuesContenido.nroNorma}
                                        inputProps={{
                                          min: "0",
                                          max: "9999999999",
                                        }}
                                        onChange={handleInputChange}
                                        name="nroNorma"
                                      />
                                      {valuesContenido.nroNorma !== "" &&
                                      valuesContenido.origen !== "" &&
                                      valuesContenido.fechaNormaBoletin !==
                                        "" &&
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
                                          className="btnAgregar btnBoletin"
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
                                          .filter(
                                            (norma) => norma.habilita === 1
                                          )
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
                                              {norma.tipo_norma} Nº{" "}
                                              {norma.numero}/
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
                                              />{" "}
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="mt-4 mb-3" />

                                <Box className="contInputFileBoletin">
                                  <label className="fileNameDisplay flex-column">
                                    {selectedFileName}
                                    <Input
                                      className="inputFileAltaBoletin"
                                      type="file"
                                      id="fileBoletin"
                                      name="archivoBoletin"
                                      value={valuesCabecera.archivoBoletin}
                                      onChange={handleChangeFile}
                                      accept="application/pdf"
                                      required
                                    />
                                    {selectedFileName ===
                                    "Seleccione un Archivo" ? (
                                      <FileUp />
                                    ) : (
                                      <File />
                                    )}
                                  </label>
                                </Box>
                              </div>
                            </div>
                          </div>
                        </Box>
                      </div>
                      <DialogActions>
                        {editingBoletin.nro_boletin !== "" &&
                        editingBoletin.nro_boletin.length <= 10 &&
                        editingBoletin.fecha_publicacion !== "" &&
                        editingBoletin.nro_boletin !== "undefined" &&
                        editingBoletin.fecha_publicacion !== "undefined" &&
                        validarNormasAgregadas().length <= 0 &&
                        numeroBoletinDisponible(
                          editingBoletin.nro_boletin,
                          editingBoletin.id_boletin
                        ) === false &&
                        archivoSeleccionado !== null ? (
                          <>
                            <Button
                              onClick={handleGuardar}
                              color="primary"
                              className="btnBoletin"
                              disabled={botonState}
                              variant="contained"
                            >
                              Guardar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={handleMensajeEditar}
                              className="btnBoletin"
                              color="primary"
                              variant="contained"
                            >
                              Guardar
                            </Button>
                          </>
                        )}
                        <Button
                          onClick={handleCancel}
                          className="btnBoletin"
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
          </>
        ) : (
          <TableLoader filas={8} />
        )}
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        >
          <Alert
            onClose={handleClose}
            severity={error}
            variant="filled"
            sx={{ width: "100%", zIndex: 9999999 }}
          >
            {mensaje}
          </Alert>
        </Snackbar>
      </Paper>
      {(bandera || botonState) && <LoaderMuni img={loader} />}
    </div>
  );
};
export default TablaBoletines;
