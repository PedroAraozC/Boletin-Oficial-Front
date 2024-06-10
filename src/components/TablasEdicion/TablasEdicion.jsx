import React from "react";
import "./TablasEdicion.css";
import TablaOrigen from "../TablaOrigen/TablaOrigen";
import TablaNormas from "../ListarNormas/ListarNormas";

const TablasEdicion = () => {
  return (
    <>
      <h3 className="text-center pt-4">LISTADO NORMAS</h3>
      <TablaNormas />
      <h3 className="text-center pt-4">LISTADO SECRETARIAS</h3>
      <TablaOrigen />
    </>
  );
};

export default TablasEdicion;
