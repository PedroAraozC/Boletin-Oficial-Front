import { Alert, Box, Button, Snackbar, TextField, Grid } from "@mui/material";
import React, { useState } from "react";
import "./Buscador.css";
import FormAvanzada from "../Form/FormAvanzada.jsx";
import axios from "../../config/axios";
import logoMuniColor from "../../assets/logo-SMT.png";
import { BUSCADOR_VALUES } from "../../helpers/constantes.js";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ListarBoletines from "../ListarBoletines/ListarBoletines.jsx";

const Buscador = () => {
  const [values, setValues] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("error");
  const [mensaje, setMensaje] = useState("Algo Explotó :/");
  const [loading, setLoading] = useState(true);
  const [resultados, setResultados] = useState([]);
  // eslint-disable-next-line
  const [boletinEncontrado, setBoletinEncontrado] = useState(true);
  // eslint-disable-next-line
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setBusquedaRealizada(false);
  };

  const handleMensaje = () => {
    if (values.nroBoletinBusqueda === "" && values.fechaBusqueda === "") {
      setOpen(true);
      setMensaje("Debe Selccionar el Nro de Boletin o Fecha de Publicación");
      setError("error");
    } else {
      setOpen(true);
      setMensaje("Debe llenar al menos un campo");
      setError("error");
    }
  };

  const handleModalResults = (results) => {
    setResultados(results.slice().reverse());
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleBuscarBoletin = async () => {
    try {
      setLoading(true);
      const boletin = {
        nroBoletinBusqueda: values.nroBoletinBusqueda,
        fechaBusqueda: values.fechaBusqueda,
      };
      if (!boletin.nroBoletinBusqueda && !boletin.fechaBusqueda) {
        setOpen(true);
        setMensaje("Debe ingresar el Nº de Boletín o Fecha de Publicación");
        setError("error");
        return;
      } else if (boletin.nroBoletinBusqueda || boletin.fechaBusqueda) {
        handleSearchBoletin(boletin.nroBoletinBusqueda, boletin.fechaBusqueda);
        setValues(BUSCADOR_VALUES);
        setBusquedaRealizada(true);
        return;
      }
    } catch (error) {
      setOpen(true);
      setMensaje("Algo explotó! :(");
      setError("warning");
      console.error("Error al buscar boletín:", error);
    }
  };

  const handleSearchBoletin = async (nro_boletin, fecha_publicacion) => {
    try {
      if (!nro_boletin && !fecha_publicacion) {
        setOpen(true);
        setMensaje("Debe ingresar el Nº de Boletín o Fecha de Publicación");
        setError("error");
        <ListarBoletines />;
      } else if (nro_boletin && fecha_publicacion) {
        const respuesta = await axios.get(
          `/boletin/buscarNroYFecha/${nro_boletin}/${fecha_publicacion}`
        );
        if (respuesta.data.length > 0) {
          setValues(
            Array.isArray(respuesta.data) ? respuesta.data : [respuesta.data]
          );
          setOpen(true);
          setLoading(false);
          setMensaje(
            `Boletín encontrado Nº ${nro_boletin} fecha: ${fecha_publicacion}`
          );
          setError("success");
          setBoletinEncontrado(true);
        } else {
          setValues(BUSCADOR_VALUES);
          setLoading(false);
          setOpen(true);
          setMensaje(`No existe boletin Nº ${nro_boletin}`);
          setError("error");
          console.log("Boletín no encontrado:", error);
          setBoletinEncontrado(false);
        }
      } else if (nro_boletin && !fecha_publicacion) {
        const respuesta = await axios.get(`/boletin/buscar/${nro_boletin}`);
        if (respuesta.data.length > 0) {
          setValues(
            Array.isArray(respuesta.data) ? respuesta.data : [respuesta.data]
          );
          setLoading(false);
          setOpen(true);
          setMensaje(`Boletín encontrado Nº ${nro_boletin}`);
          setError("success");
          setBoletinEncontrado(true);
        } else {
          setValues(BUSCADOR_VALUES);
          setLoading(false);
          setOpen(true);
          setMensaje(`No existe boletin Nº ${nro_boletin}`);
          setError("error");
          console.log("Boletín no encontrado:", error);
          setBoletinEncontrado(false);
        }
      } else if (!nro_boletin && fecha_publicacion) {
        const respuesta = await axios.get(
          `/boletin/buscarFecha/${fecha_publicacion}`
        );
        if (respuesta.data.length > 0) {
          setValues(
            Array.isArray(respuesta.data) ? respuesta.data : [respuesta.data]
          );
          setLoading(false);
          setOpen(true);
          setMensaje(`Boletín encontrado fecha: ${fecha_publicacion}`);
          setError("success");
          setBoletinEncontrado(true);
        } else {
          setValues(BUSCADOR_VALUES);
          setLoading(false);
          setOpen(true);
          setMensaje(`No existe boletin para la fecha ${fecha_publicacion}`);
          setError("error");
          console.log("Boletín no encontrado:", error);
          setBoletinEncontrado(false);
        }
      }
    } catch (error) {
      setLoading(false);
      setOpen(true);
      setMensaje("Error de conexión");
      setError("warning");
      console.error("Error al buscar boletín:", error);
    }
    return;
  };

  const funcionDescarga = async (boletin) => {
    try {
      const response = await axios.get(
        // `IP SERVIDOR DESARROLLO:PUERTO DEL BACK-END/boletin/listarDescarga/${boletin.id_boletin}`,
        `http://172.16.8.209:4000/boletin/listarDescarga/${boletin.id_boletin}`,
        // `http://localhost:4000/boletin/listarDescarga/${boletin.id_boletin}`,
        {
          responseType: "blob", 
        }
      );

      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Boletin_Oficial_Municipal Nº ${boletin.nro_boletin}.pdf`
      ); 
      link.click();
    } catch (error) {
      setOpen(true);
      setMensaje("Error en la conexión");
      setError("warning");
    }
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <Box className="buscador ">
          <h3 className="tituloBuscador">BUSCAR BOLETINES ANTERIORES</h3>
          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
            className="inputCont container"
          >
            <div className="inputsBuscadores d-flex flex-column flex-md-row align-items-md-center">
              <TextField
                label="Nro de Boletín"
                variant="outlined"
                className="inputBuscador"
                type="number"
                value={values.nroBoletinBusqueda}
                onChange={handleChange}
                inputProps={{ min: "0", shrink: false }}
                name="nroBoletinBusqueda"
              />

              <TextField
                label="Fecha"
                variant="outlined"
                type="date"
                className="inputBuscador"
                value={values.fechaBusqueda}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                name="fechaBusqueda"
              />
            </div>
            <div className="botonesBuscadores">
              {values.nroBoletinBusqueda !== "" ||
              values.fechaBusqueda !== "" ? (
                <Button
                  variant="contained"
                  className="btnBuscador"
                  onClick={handleBuscarBoletin}
                >
                  Buscar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className="btnBuscador"
                  onClick={handleMensaje}
                >
                  Buscar
                </Button>
              )}
              <Button variant="contained" className="btnBuscadorAvanzada">
                <FormAvanzada busquedaAvanzada={handleModalResults} />
              </Button>
            </div>
          </Box>
        </Box>
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
      </div>
      <div className="d-flex flex-row mt-4">
        <Grid container spacing={2} className="d-flex contGrid">
          <Grid className="contBoletines ps-5  pe-4 " item xs={12} md={12}>
            {resultados.length > 0 ? (
              <>
                {Array.isArray(values) && resultados.length > 0 ? (
                  resultados.map((boletin) => (
                    <div key={boletin.id_boletin} className="boletin mb-2">
                      <img
                        className="logoMuniColor"
                        src={logoMuniColor}
                        alt=" logo Muni"
                      />
                      <div className="boletinText container mt-3">
                        <div className="d-flex flex-row justify-content-between">
                          <h2>Boletin Nº {boletin.nro_boletin}</h2>
                          <div className="contBtn">
                            <Button
                              variant="contained"
                              className="btnPdf"
                              onClick={() => funcionDescarga(boletin)}
                            >
                              <DownloadForOfflineIcon />
                            </Button>
                          </div>
                        </div>
                        <div className=" d-flex flex-row">
                          <h6>{boletin.fecha_publicacion.slice(0, 10)}</h6>{" "}
                          <h6 className="ms-2">| Tucumán, Argentina</h6>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <p className="d-flex justify-content-center">
                      No se encontró Boletin
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                {loading ? (
                  <ListarBoletines />
                ) : (
                  <>
                    {Array.isArray(values) && values.length > 0 ? (
                      values.map((boletin) => (
                        <div key={boletin.id_boletin} className="boletin mb-2">
                          <img
                            className="logoMuniColor"
                            src={logoMuniColor}
                            alt=" logo Muni"
                          />
                          <div className="boletinText container mt-3">
                            <div className="d-flex flex-row justify-content-between">
                              <h2>Boletin Nº {boletin.nro_boletin}</h2>
                              <div className="contBtn">
                                <Button
                                  variant="contained"
                                  className="btnPdf"
                                  onClick={() => funcionDescarga(boletin)}
                                >
                                  <DownloadForOfflineIcon />
                                </Button>
                              </div>
                            </div>
                            <div className=" d-flex flex-row">
                              <h6>{boletin.fecha_publicacion.slice(0, 10)}</h6>{" "}
                              <h6 className="ms-2">| Tucumán, Argentina</h6>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <p className="d-flex justify-content-center">
                          No se encontró Boletin
                        </p>
                        <ListarBoletines />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Grid>
        </Grid>
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
      </div>
    </>
  );
};

export default Buscador;