import axiosOriginal from "axios";

export const axios = axiosOriginal.create({
  // baseURL: "IP SERVIDOR PRODUCCION:PUERTO DEL BACK-END"
  // baseURL: "http://181.105.6.205:89" //SERVIDOR DE PRODUCCION
  // baseURL: "https://boletinoficial.smt.gob.ar:5557" //SERVIDOR DE PRODUCCION
  // baseURL: "https://estadisticas.smt.gob.ar:6500", // BACK-DERIVADOR

  baseURL: "https://estadisticas.smt.gob.ar:5557",
});

export const axiosDigital = axiosOriginal.create({
  baseURL: "https://estadisticas.smt.gob.ar:5557",
  // baseURL: "https://ciudaddigital.smt.gob.ar:2000", // BACK-DERIVADOR
  // baseURL: "https://estadisticas.smt.gob.ar:6500", // BACK-DERIVADOR
  // baseURL: "https://boletinoficial.smt.gob.ar:5557" //SERVIDOR DE PRODUCCION

});
