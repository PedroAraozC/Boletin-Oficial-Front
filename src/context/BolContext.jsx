import React, { createContext, useEffect, useState } from "react";
import axiosCiudadDigital from "../config/axios";

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
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return setAuthenticated(false);
      }
      axiosCiudadDigital.defaults.headers.common["Authorization"] = token;
      const { data } = await axiosCiudadDigital.get("/usuarios/authStatus");
      setUser(data.usuarioSinContraseña);
    //   console.log(data.usuarioSinContraseña);
      setAuthenticated(true);
    } catch (error) {
      setAuthenticated(false);
      logout()
      console.error("Error de autenticación. Ingrese nuevamente");
    }
    setLoading(false);
  };

  useEffect(() => {
    setUser();
  }, []);

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenSet");
    // const url = new URL(`https://ciudaddigital.smt.gob.ar?destino=boletin`); // IP BACK-DERIVADOR
    const url = new URL(`localhost:5173`);
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
