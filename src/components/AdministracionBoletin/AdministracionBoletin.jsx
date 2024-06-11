import React from "react";
import "./AdministracionBoletin.css";
import ArticleIcon from "@mui/icons-material/Article";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TableViewIcon from "@mui/icons-material/TableView";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";

const AdministracionBoletin = () => {
  const navigate = useNavigate();
  const redirigir = (ruta) => {
    navigate(ruta);
    setState(false);
  };
  return (
    <div className="contPadre  ">
      <div className="cardsCont row ">
        <div
          className="col-12 col-md-6 col-lg-3 mb-4 card container"
          onClick={() => redirigir("/altaboletines")}
        >
          <div className="card-body ">
            <div className="card-icon-cont">
              <NoteAddIcon className="card-icon" />
            </div>
            <p className="card-text">Alta Boletines</p>
          </div>
        </div>
        <div
          className=" col-12 col-md-6 col-lg-3 mb-4 card container"
          onClick={() => redirigir("/tablaBoletines")}
        >
          <div className="card-body">
         
            <div className="card-icon-cont">
              <EditNoteIcon className="card-icon" />
            </div>
            <p className="card-text">Edición Boletin</p>
          </div>
        </div>
        <div
          className="col-12 col-md-6 col-lg-3 mb-4 card container"
          onClick={() => redirigir("/tablas")}
        >
          <div className="card-body">
            <div className="card-icon-cont">
              <TableViewIcon className="card-icon" />
            </div>

            <p className="card-text">Norma/Secretaria</p>
          </div>
        </div>
        <div
          className="col-12 col-md-6 col-lg-3 mb-4 card container"
          onClick={() => redirigir("/")}
        >
          <div className="card-body">
            <div className="card-icon-cont">
              <ArticleIcon className="card-icon" />
            </div>
            <p className="card-text">Boletines</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministracionBoletin;
