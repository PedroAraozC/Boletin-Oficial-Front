import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Router, Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./components/Layout";
import AltaBoletines from "./components/AltaBoletines/AltaBoletines";
import Buscador from "./components/Buscador/Buscador";
import TablaBoletines from "./components/TablaBoletines/TablaBoletines";
import TablasEdicion from "./components/TablasEdicion/TablasEdicion";
import AdministracionBoletin from "./components/AdministracionBoletin/AdministracionBoletin";
import LayoutAdmin from "./common/LayoutAdmin/LayoutAdmin";
import ProviderBol from "./context/BolContext";
import PrivateRoute from "./routes/PrivateRoute";
import AdminBoletinRoute from "./routes/AdminBoletinRoute";
import { NavBar } from "./common/Layout/NavBar";
import Footer from "./common/Layout/Footer";

const App = () => {
  // const url = new URL(window.location.href);
  // const token = url.searchParams.get("auth");

  // url.searchParams.delete("auth");
  // history.replaceState(null, "", url.toString());
  // // Verificar si el token está presente en la URL y si aún no se ha guardado en el localStorage
  // if (token && !localStorage.getItem("tokenSet")) {
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("tokenSet", "true"); // Establecer la bandera
  //   // url.searchParams.delete("auth");
  //   // window.history.replaceState(null, "", url.toString());
  // }
  // if (localStorage.getItem("token") == null) {
  //   localStorage.removeItem("tokenSet");
  //   // console.log(token);
  //   // const url = new URL(`http://localhost:5174`); // IP BACK-DERIVADOR
  //   const url = new URL(`https://ciudaddigital.smt.gob.ar?destino=boletin`);
  //   url.searchParams.append("logout", true);
  //   // window.open(url.toString(), "_self"); // IP BACK-DERIVADOR
  //   window.location.href = url.toString();
  // }

  const url = new URL(window.location.href);
  const token = url.searchParams.get("auth");

  if(localStorage.getItem("token")){
    localStorage.setItem("token", token != null ? token : localStorage.getItem("token"));
  }else if(token){
    localStorage.setItem("token", token);
  }

  const origen = url.searchParams.get("destino");

  if(localStorage.getItem("origen")){
    localStorage.setItem("origen", origen != null ? origen : localStorage.getItem("origen"));
  }else if(origen){
    localStorage.setItem("origen", origen);
  }
  return (
    <>
      <HashRouter>
        {/* <Router> */}
        <ProviderBol>
          <LayoutAdmin>
            <Routes>
              <Route
                exact
                path="/*"
                element={
                  <PrivateRoute>
                      <Buscador />
                      <Footer />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path="/altaBoletines"
                element={
                  <AdminBoletinRoute>
                    <AltaBoletines />
                  </AdminBoletinRoute>
                }
              />
              <Route
                exact
                path="/tablaBoletines"
                element={
                  <AdminBoletinRoute>
                    <TablaBoletines />
                  </AdminBoletinRoute>
                }
              />
              <Route
                exact
                path="/tablas"
                element={
                  <AdminBoletinRoute>
                    <TablasEdicion />
                  </AdminBoletinRoute>
                }
              />
              <Route
                exact
                path="/adminBoletin"
                element={
                  <AdminBoletinRoute>
                  <AdministracionBoletin />
                  </AdminBoletinRoute>
                }
              />
            </Routes>
          </LayoutAdmin>
        </ProviderBol>

        {/* </Router> */}
      </HashRouter>
    </>
  );
};

export default App;
