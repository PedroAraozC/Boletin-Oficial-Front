import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import {
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TableViewIcon from "@mui/icons-material/TableView";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import EditNoteIcon from "@mui/icons-material/EditNote";
import "./SideBarAdmin.css";
import { BolContext } from "../../context/BolContext";

export default function SideBarAdmin() {
  const navigate = useNavigate();
  const redirigir = (ruta) => {
    navigate(ruta);
    setState(false);
  };

  const { user } = React.useContext(BolContext);

  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (open) => {
    setState({ left: open });
  };

  React.useEffect(() => {
    user;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const personaHabilitada = user?.id_persona;
  // const permisosHabilitados = 1;

  console.log(personaHabilitada);

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      className="d-flex justify-content-between flex-column h-100"
    >
      {personaHabilitada === 148 || user?.id_tusuario === 1 ? ( // PERMISOS DE USUARIO
        <>
          <div className="d-flex flex-column justify-content-center align-items-start mt-5">
            <ListItemButton
              onClick={() => redirigir("/adminBoletin")}
              component="a"
              className="w-100"
            >
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText primary="ADMIN BOLETIN" />
            </ListItemButton>
            <ListItemButton
              onClick={() => redirigir("/altaBoletines")}
              component="a"
              className="w-100"
            >
              <ListItemIcon>
                <NoteAddIcon />
              </ListItemIcon>
              <ListItemText primary="ALTA BOLETINES" />
            </ListItemButton>
            <ListItemButton
              onClick={() => redirigir("/")}
              component="a"
              className="w-100"
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="BOLETINES" />
            </ListItemButton>
            <ListItemButton
              onClick={() => redirigir("/tablaBoletines")}
              component="a"
              className="w-100"
            >
              <ListItemIcon>
                <EditNoteIcon />
              </ListItemIcon>
              <ListItemText primary="EDICION BOLETIN" />
            </ListItemButton>
            <ListItemButton
              onClick={() => redirigir("/tablas")}
              component="a"
              className="w-100"
            >
              <ListItemIcon>
                <TableViewIcon />
              </ListItemIcon>
              <ListItemText primary="NORMA/SECRETARIA" />
            </ListItemButton>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <p className="footer text-center">
              Desarrollado por Dirección de Innovación Tecnológica
              <span style={{ fontSize: "1.4em", verticalAlign: "-0.1em" }}>
                ©
              </span>{" "}
              2024
            </p>
          </div>
        </>
      ) : (
        <div>{navigate("/")}</div>
      )}
    </Box>
  );

  return (
    <div>
      {personaHabilitada === 148 ? (
        <div>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ m: 1 }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <SwipeableDrawer
            anchor="left"
            open={state.left}
            onClose={() => toggleDrawer(false)}
            onOpen={() => toggleDrawer(true)}
          >
            {list()}
          </SwipeableDrawer>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
