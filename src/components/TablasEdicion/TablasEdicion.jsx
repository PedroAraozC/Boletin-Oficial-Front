import React from "react";
import "./TablasEdicion.css";
import TablaOrigen from "../TablaOrigen/TablaOrigen";
import TablaNormas from "../ListarNormas/ListarNormas";

const TablasEdicion = () => {
  return (
    <>
        <TablaNormas />
        <TablaOrigen />
    </>
  );
};

export default TablasEdicion;
