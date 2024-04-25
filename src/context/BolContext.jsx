import React, { createContext, useEffect, useState } from "react";
import axios from "../config/axios";

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
      axios.defaults.headers.common["Authorization"] = token;
      const { data } = await axios.get("/usuarios/authStatus");
      setUser(data.usuarioSinContraseña);
    //   console.log(data.usuarioSinContraseña);
      setAuthenticated(true);
    } catch (error) {
      setAuthenticated(false);
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
    const url = new URL(`http://localhost:5174/`); // IP DERIVADOR
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
