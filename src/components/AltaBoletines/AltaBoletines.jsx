import React, { useEffect, useState } from "react";
import "./AltaBoletinesNuevo.css";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { ALTA_CABECERA_BOLETIN_VALUES } from "../../helpers/constantes.js";
import { ALTA_CONTENIDO_BOLETIN_VALUES } from "../../helpers/constantes.js";
import FileUp from "@mui/icons-material/FileUpload";
import File from "@mui/icons-material/UploadFileRounded";
import axios from "../../config/axios.js";
import { ModalAltaBoletin } from "../ModalAltaBoletines/ModalAltaBoletin.jsx";
import useGet from "../../hook/useGet.jsx";
import CloseIcon from "@mui/icons-material/Close";

const AltaBoletines = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("error");
  const [valuesCabecera, setValuesCabecera] = useState(
    ALTA_CABECERA_BOLETIN_VALUES
  );
  const [valuesContenido, setValuesContenido] = useState(
    ALTA_CONTENIDO_BOLETIN_VALUES
  );
  const [mensaje, setMensaje] = useState("Algo Explotó :/");
  const [selectedFileName, setSelectedFileName] = useState(
    "Seleccione un Archivo"
  );
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [mostrarModal, setMostrarModal] = useState(false);
  // eslint-disable-next-line
  const [bandera, setBandera] = useState(false);
  // eslint-disable-next-line
  const [boletines, loading, getboletin] = useGet("/boletin/listar", axios);
  // eslint-disable-next-line
  const [nroBoletinExistente, setNroBoletinExistente] = useState(false);
  // eslint-disable-next-line
  const [tiposOrigen, loadingOrigen, getTiposOrigen] = useGet(
    "/origen/listar",
    axios
  );
  const [tiposNorma, loadingNorma, getTiposNoma] = useGet(
    "/norma/listar",
    axios
  );

  const [normasAgregadas, setNormasAgregadas] = useState([]);
  const [nroNormaExistente, setNroNormaExistente] = useState(false);

  const handleAgregarNorma = () => {
    const nuevaNorma = {
      norma: valuesContenido.norma,
      numero: valuesContenido.nroNorma,
      origen: valuesContenido.origen,
      año: valuesContenido.fechaNormaBoletin,
    };
    setNormasAgregadas([...normasAgregadas, nuevaNorma]);
    setValuesContenido(ALTA_CONTENIDO_BOLETIN_VALUES);
  };

  useEffect(() => {
  }, [normasAgregadas]);

  const handleEliminarNorma = (index) => {
    const nuevasNormas = [...normasAgregadas];
    nuevasNormas.splice(index, 1);
    setNormasAgregadas(nuevasNormas);
    setNroNormaExistente(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValuesCabecera({
      ...valuesCabecera,
      [name]: value,
    });
    setValuesContenido({
      ...valuesContenido,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setValuesCabecera((prevValues) => ({
      ...prevValues,
      habilita: isChecked,
    }));
  };

  useEffect(() => {}, [valuesCabecera.habilita]);

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
  useEffect(() => {
    getboletin();
  }, []);

  useEffect(() => {
    const nuevoNumeroBoletin = valuesCabecera.nroBoletin;
    // eslint-disable-next-line
    const existe = numeroBoletinDisponible(nuevoNumeroBoletin);
    // eslint-disable-next-line
    setNroBoletinExistente(existe);
    // eslint-disable-next-line
  }, [boletines, valuesCabecera.nroBoletin]);

  const validarNormasAgregadas = () => {
    const normasRepetidas = normasAgregadas.filter((norma, index) => {
      return normasAgregadas.some(
        (otraNorma, otroIndex) =>
          otraNorma.norma.id_norma === norma.norma.id_norma &&
          otraNorma.numero === norma.numero &&
          index !== otroIndex
      );
    });
    return normasRepetidas;
  };

  const puedeEnviarFormulario =
    selectedFileName !== "Seleccione un Archivo" &&
    valuesCabecera.fechaPublicacion !== "" &&
    normasAgregadas.length > 0 &&
    valuesCabecera.nroBoletin !== "";

  const handleMensaje = () => {
    let mensaje = "";
    let fileName = archivoSeleccionado?.name || "";
    if (validarNormasAgregadas().length > 0) {
      mensaje =
        "No puede estar la misma Norma con el mismo Nº de Norma repetido ";
      setError("warning");
    } else if (valuesCabecera.nroBoletin === "") {
      mensaje = "Debe ingresar el Nº de Boletín";
      setError("error");
    } else if (numeroBoletinDisponible(valuesCabecera.nroBoletin)) {
      mensaje = `El Nº de Boletín ${valuesCabecera.nroBoletin} ya existe!`;
      setError("error");
    } else if (valuesCabecera.fechaPublicacion === "") {
      mensaje = "Debe ingresar la fecha del Boletín";
      setError("warning");
    } else if (normasAgregadas.length <= 0) {
      mensaje = "Debe ingresar al menos una norma";
      setError("warning");
    } else if (fileName === "") {
      mensaje = "Debe seleccionar un archivo";
      setError("warning");
    } else if (!fileName.toLowerCase().endsWith(".pdf")) {
      mensaje = "El archivo solo puede ser PDF";
      setError("warning");
    } else {
      mensaje = "Recarga la pagina";
      setError("warning");
      return;
    }
    setOpen(true);
    setMensaje(mensaje);
  };

  const handleMensajeContenido = () => {
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const numeroBoletinDisponible = (nuevoNumeroBoletin) => {
    const numero = nuevoNumeroBoletin.toString();
    const existe = boletines.some((boletin) => boletin.nro_boletin === numero);
    return existe;
  };

  const handleGuardarBoletin = async () => {
    setMostrarModal(true);
  };

  const handleConfirm = async (confirmado) => {
    setBandera(confirmado);
    setMostrarModal(false);
    if (confirmado) {
      enviarDatos();
    } else {
      setOpen(true);
      setMensaje("Intente nuevamente");
      setError("warning");
    }
  };

  const enviarDatos = async () => {
    try {
      const requestData = {
        nroBoletin: parseInt(valuesCabecera.nroBoletin, 10),
        fechaPublicacion: valuesCabecera.fechaPublicacion,
        habilita: valuesCabecera.habilita,
        arrayContenido: normasAgregadas,
      };
      formData.append("requestData", JSON.stringify(requestData));
      formData.append("archivoBoletin", archivoSeleccionado);
      setFormData(formData);
      const respuesta = await axios.post("/boletin/alta", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setValuesCabecera(ALTA_CABECERA_BOLETIN_VALUES);
      setValuesContenido(ALTA_CONTENIDO_BOLETIN_VALUES);
      setNormasAgregadas([]);
      setSelectedFileName("Seleccione un Archivo");
      setOpen(true);
      setMensaje("Boletin generado con éxito!");
      setError("success");
      setFormData(new FormData());
    } catch (error) {
      console.error("Algo explotó! D:' ", error);
    }
  };
  return (
    <Box
      component="form"
      id="form"
      noValidate
      enctype="multipart/form-data"
      autoComplete="on"
      className="contBoxAltaBoletines container"
    >
      <div className="contAltaBoletines">
        <Box className="formGroup flex-col ">
          <div className="contRango d-flex align-items-center">
            <div>
              <div className="d-flex flex-column ">
                <div className="encabezadoBoletin">
                  <div className="d-flex justify-content-between text-align-start">
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
                          checked={valuesCabecera.habilita}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label="Habilitado"
                      labelPlacement="start"
                    />
                  </div>
                  <div className="d-flex flex-row pe-2">
                    <TextField
                      label="Nro de Boletín"
                      variant="outlined"
                      className="inputAltaBoletin"
                      type="number"
                      value={valuesCabecera.nroBoletin}
                      onChange={handleChange}
                      inputProps={{ min: "0" }}
                      name="nroBoletin"
                    />
                    <TextField
                      label="Fecha Publicación"
                      variant="outlined"
                      name="fechaPublicacion"
                      type="date"
                      className="inputAltaBoletin ms-3"
                      value={valuesCabecera.fechaPublicacion}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <hr className="mt-4 mb-3" />
                </div>
                <div className="cuerpoBoletin">
                  <div className="d-flex flex-row">
                    <div className=" cuerpoBoletinForm ">
                      <FormControl sx={{ minWidth: 80 }} className="mb-3 ">
                        <InputLabel
                          id="demo-simple-select-autowidth-label
                        "
                        >
                          Norma
                        </InputLabel>
                        <Select
                          labeld="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={valuesContenido.norma}
                          onChange={handleChange}
                          autoWidth
                          label="Norma"
                          name="norma"
                        >
                          <MenuItem value="">
                            <em>--Seleccione--</em>
                          </MenuItem>
                          {tiposNorma.map((norma) => (
                            <MenuItem key={norma.id_norma} value={norma}>
                              {norma.tipo_norma}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: 80 }} className="mb-3">
                        <InputLabel id="demo-simple-select-autowidth-label">
                          Secretaría de Origen
                        </InputLabel>
                        <Select
                          labeld="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={valuesContenido.origen}
                          onChange={handleChange}
                          autoWidth
                          label="Secretaría de Origen"
                          name="origen"
                        >
                          <MenuItem value="">
                            <em>--Seleccione--</em>
                          </MenuItem>
                          {tiposOrigen.map((origen) => (
                            <MenuItem key={origen.id_origen} value={origen}>
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
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Nº de Norma"
                        className="inputAltaBoletin mb-3"
                        type="number"
                        value={valuesContenido.nroNorma}
                        onChange={handleChange}
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
                          onClick={handleAgregarNorma}
                        >
                          Agregar Norma
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="btnAgregar"
                          variant="contained"
                          onClick={handleMensajeContenido}
                        >
                          Agregar Norma
                        </Button>
                      )}
                    </div>
                    <div className="listadoPrueba container">
                      <div className="listadoNormas">
                        {normasAgregadas.map((norma, index) => (
                          <div
                            key={index}
                            className={`norma ${
                              validarNormasAgregadas().some((n) => n === norma)
                                ? "normaRepetida"
                                : "norma"
                            }`}
                          >
                            {norma.norma.tipo_norma} Nº {norma.numero}/
                            {norma.origen.nombre_origen}/{norma.año.slice(0, 4)}{" "}
                            <CloseIcon
                              className="X"
                              fontSize="small"
                              onClick={() => handleEliminarNorma(index)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="mt-4 mb-3" />
                <Box className="contInputFileBoletin col-2 ">
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
                    {selectedFileName === "Seleccione un Archivo" ? (
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
      {puedeEnviarFormulario ? (
        validarNormasAgregadas().length <= 0 &&
        numeroBoletinDisponible(valuesCabecera.nroBoletin) === false &&
        selectedFileName !== "" &&
        selectedFileName.toLowerCase().endsWith(".pdf") ? (
          <>
            <Button
              type="button"
              variant="contained"
              onClick={handleGuardarBoletin}
            >
              Guardar Boletín
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="contained" onClick={handleMensaje}>
              Guardar Boletín
            </Button>
          </>
        )
      ) : (
        <>
          <Button type="button" variant="contained" onClick={handleMensaje}>
            Guardar Boletín
          </Button>
        </>
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
          sx={{ width: "100%" }}
        >
          {mensaje}
        </Alert>
      </Snackbar>
      {mostrarModal && (
        <ModalAltaBoletin abrir={mostrarModal} onConfirm={handleConfirm} />
      )}
    </Box>
  );
};
export default AltaBoletines;
