import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Router, Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./components/Layout";
import AltaBoletines from "./components/AltaBoletines/AltaBoletines";
import Buscador from "./components/Buscador/Buscador";
import TablaBoletines from "./components/TablaBoletines/TablaBoletines";
import TablasEdicion from "./components/TablasEdicion/TablasEdicion";
import AdministracionBoletin from "./components/AdministracionBoletin/AdministracionBoletin";
import Layout2 from "./common/Layout2/Layout2";

const App = () => {
  return (
    <>
      <HashRouter>
        {/* <Router> */}
        <Routes>
          <Route
            exact
            path="/*"
            element={
              <Layout>
                {" "}
                <Buscador />
              </Layout>
            }
          />
          <Route
            exact
            path="/altaBoletines"
            element={
              <Layout2>
                <AltaBoletines />
              </Layout2>
            }
          />
          <Route
            exact
            path="/tablaBoletines"
            element={
              <Layout2>
                <TablaBoletines />
              </Layout2>
            }
          />
          <Route
            exact
            path="/tablas"
            element={
              <Layout2>
                <TablasEdicion />
              </Layout2>
            }
          />
          <Route
            exact
            path="/adminBoletin"
            element={
              <Layout2>
                <AdministracionBoletin />
              </Layout2>
            }
          />
        </Routes>
        {/* </Layout> */}
        {/* </Router> */}
      </HashRouter>
    </>
  );
};

export default App;
