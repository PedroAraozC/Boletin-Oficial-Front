import "./NavBar.css";
import { Container } from "@mui/material";
import logoMuni from "../../assets/Logo-completo-muni.png";
import React from "react";

export const NavBar = () => {
  return (
    <div className="fondo">
      <Container div className="navCont">
        <div className="contLogo mb-3">
          <a href="/">
            {" "}
            <img src={logoMuni} alt="logo Muni" className="logoNav" />
          </a>
        </div>
        <div className="boletinNavCont">
          <h1 className="boletinNav">Boletín Oficial Municipal </h1>
        </div>
      </Container>
    </div>
  );
};

