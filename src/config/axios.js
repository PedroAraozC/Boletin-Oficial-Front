import axiosOriginal from "axios";

export const axios = axiosOriginal.create({
  // baseURL: "IP SERVIDOR PRODUCCION:PUERTO DEL BACK-END"
  // baseURL: "http://181.105.6.205:89" //SERVIDOR DE PRODUCCION
  // baseURL: "https://boletinoficial.smt.gob.ar:5557" //SERVIDOR DE PRODUCCION
  // baseURL: "https://estadisticas.smt.gob.ar:6500", // BACK-DERIVADOR

  baseURL: "https://estadisticas.smt.gob.ar:5557",
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('Token inválido o expirado (401)');
      localStorage.clear();
      const url = new URL('https://ciudaddigital.smt.gob.ar/');
      url.searchParams.append("logout", true);
      window.open(url.toString(), '_self');
    }
    return Promise.reject(error);
  }
);


export const axiosDigital = axiosOriginal.create({
  baseURL: "https://estadisticas.smt.gob.ar:5557",
  // baseURL: "https://ciudaddigital.smt.gob.ar:2000", // BACK-DERIVADOR
  // baseURL: "https://estadisticas.smt.gob.ar:6500", // BACK-DERIVADOR
  // baseURL: "https://boletinoficial.smt.gob.ar:5557" //SERVIDOR DE PRODUCCION

});
axiosDigital.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('Token inválido o expirado (401)');
      localStorage.clear();
      const url = new URL('https://ciudaddigital.smt.gob.ar/');
      url.searchParams.append("logout", true);
      window.open(url.toString(), '_self');
    }
    return Promise.reject(error);
  }
);
