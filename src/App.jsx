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

const App = () => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("boletin");
  
  url.searchParams.delete("boletin");
  history.replaceState(null, "", url.toString());
  // Verificar si el token está presente en la URL y si aún no se ha guardado en el localStorage
  if (token && !localStorage.getItem("tokenSet")) {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenSet", "true"); // Establecer la bandera
  }
  if (localStorage.getItem("token") == null) {
    localStorage.removeItem("tokenSet");
    console.log(token)
    const url = new URL(`http://localhost:5174/`);   // IP DERIVADOR
    window.location.href = url.toString();
  }

  return (
    <>
      <HashRouter>
        {/* <Router> */}
        <ProviderBol>
          <Routes>
            <Route
              exact
              path="/*"
              element={
                <Layout>
                  <Buscador />
                </Layout>
              }
            />
            <Route
              exact
              path="/altaBoletines"
              element={
                <PrivateRoute>
                  <LayoutAdmin>
                    <AltaBoletines />
                  </LayoutAdmin>
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/tablaBoletines"
              element={
                <PrivateRoute>
                  <LayoutAdmin>
                    <TablaBoletines />
                  </LayoutAdmin>
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/tablas"
              element={
                <PrivateRoute>
                  <LayoutAdmin>
                    <TablasEdicion />
                  </LayoutAdmin>
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/adminBoletin"
              element={
                <PrivateRoute>
                  <LayoutAdmin>
                    <AdministracionBoletin />
                  </LayoutAdmin>
                </PrivateRoute>
              }
            />
          </Routes>
          {/* </Layout> */}
        </ProviderBol>

        {/* </Router> */}
      </HashRouter>
    </>
  );
};

export default App;
