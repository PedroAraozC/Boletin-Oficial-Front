import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Router, Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./components/Layout";
import AltaBoletines from "./components/AltaBoletines/AltaBoletines";
import Buscador from "./components/Buscador/Buscador";
import TablaBoletines from "./components/TablaBoletines/TablaBoletines";
import TablasEdicion from "./components/TablasEdicion/TablasEdicion";

const App = () => {
  return (<>
    <HashRouter>
      {/* <Router> */}
        <Layout>
          <Routes>
            <Route exact path="/*" element={<Buscador />} />
            <Route exact path="/altaBoletines" element={<AltaBoletines />} />
            <Route exact path="/tablaBoletines" element={<TablaBoletines />} />
            <Route exact path="/tablas" element={<TablasEdicion />} />
          </Routes>
        </Layout>
      {/* </Router> */}
    </HashRouter>
  </>
  );
};

export default App;
