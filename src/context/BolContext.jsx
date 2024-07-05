import React, { createContext, useEffect, useState } from "react";
import {axiosDigital} from "../config/axios";

export const BolContext = createContext();

const ProviderBol = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  //   const login = async (values) => {
  //     try {
  //       const { data } = await axios.post("/users/login", values);
  //       setAuthenticated(!!data.user);
  //       setUser(data.user);
  //       axios.defaults.headers.common["Authorization"] = data.token;
  //       localStorage.setItem("token", data.token);
  //     } catch (error) {
  //       toast.error(error.response?.data.message || error.message);
  //     }
  //   };

  const getAuth = async () => {
    try {
      const url = new URL(window.location.href);
      const tokenURL = url.searchParams.get("auth");

      url.searchParams.delete("auth");
      history.replaceState(null, "", url.toString());

      const token = tokenURL? tokenURL : localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        // return setAuthenticated(false);
        return logout();
      }
      // Verifica que axiosDigital.defaults.headers y axiosDigital.defaults.headers.common existen
      // console.log(axiosDigital.defaults.headers);
      // Establece el encabezado Authorization
      axiosDigital.defaults.headers.common.Authorization = `${token}`;
      const { data } = await axiosDigital.get(
        "/usuarios/authStatus"
      );
      // console.log(data.usuarioSinContraseña.id_persona)
      setUser(data.usuarioSinContraseña);
      setAuthenticated(true);
      // console.log(user);
      // console.log(authenticated);
    } catch (error) {
      setAuthenticated(false);
      console.log(error);
      logout()
      console.error("Error de autenticación. Ingrese nuevamente");
    }
    setLoading(false);
  };

  useEffect(() => {
    getAuth();
  }, []);
  

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenSet");
    const url = new URL(`https://ciudaddigital.smt.gob.ar/#/login`); // IP BACK-DERIVADOR
    // const url = new URL(`http://localhost:5174`);
    url.searchParams.append("logout", true);
    window.open(url.toString(), "_self");
  };

  return (
    <BolContext.Provider
      value={{
        user,
        authenticated,
        setAuthenticated,
        loading,
        getAuth,
        setLoading,
        logout,
        selected,
        setSelected,
      }}
    >
      {children}
    </BolContext.Provider>
  );
};

export default ProviderBol;
