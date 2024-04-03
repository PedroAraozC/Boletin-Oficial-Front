import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AltaBoletines from "./components/AltaBoletines/AltaBoletines";
import Buscador from "./components/Buscador/Buscador";
import TablaBoletines from "./components/TablaBoletines/TablaBoletines";
import TablasEdicion from "./components/TablasEdicion/TablasEdicion";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Buscador />} />
          <Route path="/altaBoletines" element={<AltaBoletines />} />
          <Route path="/tablaBoletines" element={<TablaBoletines />} />
          <Route path="/tablas" element={<TablasEdicion />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
