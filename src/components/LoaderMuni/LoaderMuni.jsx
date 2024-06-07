import React from "react";
import "./LoaderMuni.css";

const LoaderMuni = (img) => {
  return (
    <div className="loader">
      <img src={img.img} alt="Loader" />
      <h3>Cargando . . .</h3>
    </div>
  );
};

export default LoaderMuni;
