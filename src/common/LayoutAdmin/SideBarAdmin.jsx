import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DvrIcon from "@mui/icons-material/Dvr";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonIcon from "@mui/icons-material/Person";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import TuneIcon from "@mui/icons-material/Tune";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TableViewIcon from "@mui/icons-material/TableView";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import "./SideBarAdmin.css";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { BolContext } from "../../context/BolContext";
// import { useContext } from "react";
// import useStore from "../Zustand/Zustand";

export default function SideBarAdmin() {
  const navigate = useNavigate();
  const redirigir = (ruta) => {
    navigate(ruta);
    setState(false);
  };

  const { user } = React.useContext(BolContext);
console.log(user)
  // const irAGAF = () => {
  //   const token = localStorage.getItem("token");
  //   const url = new URL(`http://localhost:5173/`);
  //   url.searchParams.append("GAF", token);
  //   window.open(url.toString(), "_blank");
  // };

  // const { user, obtenerPermisos, permisos } = useStore();

  const [state, setState] = React.useState({
    left: false,
  });
  // const [openLists, setOpenLists] = React.useState({}); // Estado para controlar qué listas están abiertas

  // const handleClick = (label) => {
  //   setOpenLists({ ...openLists, [label]: !openLists[label] });
  // };

  const toggleDrawer = (open) => {
    setState({ left: open });
  };
  // const mapearIcono = (nombreOpcion) => {
  //   switch (nombreOpcion) {
  //     case "ADMIN BOLETIN":
  //       return (
  //         <SupervisorAccountIcon onClick={() => redirigir("/adminBoletin")} />
  //       );
  //     case "ALTA BOLETINES":
  //       return <NoteAddIcon />;
  //     case "BOLETINES":
  //       return <ArticleIcon />;
  //     case "EDICION BOLETIN":
  //       return <EditNoteIcon />;
  //     case "NORMA/SECRETARIA":
  //       return <TableViewIcon />;
  //     default:
  //       return <AccountTreeIcon />;
  //   }
  // };

  React.useEffect(() => {
user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Filtra para tener permisos habilitados segun la persona
 
  const permisosHabilitados = user.id_tusuario;
  // const permisosHabilitados = 1;

  console.log(permisosHabilitados);
  // Construir menuItems a partir de los permisos habilitados
  // const menuItems = permisosHabilitados((menu, permiso) => {
  //   const menuItemIndex = menu.findIndex(
  //     (item) => item.label === permiso.nombre_opcion
  //   );
  //   if (menuItemIndex === -1) {
  //     // Si no existe un menuItem con la misma etiqueta, lo creamos
  //     const menuItem = {
  //       label: permiso.nombre_opcion,
  //       subItems: [
  //         { label: permiso.nombre_proceso, descripcion: permiso.descripcion },
  //       ],
  //     };
  //     menu.push(menuItem);
  //   } else {
  //     // Si ya existe un menuItem con la misma etiqueta, verificamos si el subItem ya existe
  //     const subItemIndex = menu[menuItemIndex].subItems.findIndex(
  //       (subItem) => subItem.label === permiso.nombre_proceso
  //     );
  //     if (subItemIndex === -1) {
  //       // Si el subItem no existe, lo agregamos
  //       menu[menuItemIndex].subItems.push({
  //         label: permiso.nombre_proceso,
  //         descripcion: permiso.descripcion,
  //       });
  //     }
  //   }
  //   return menu;
  // }, []);

  //FILTRADO PARA SACAR LA OPCION DE EDITAR PERFIL DEL SIDEBAR
  // const menuItemsFiltered = menuItems.slice(1);
  // console.log(menuItemsFiltered)

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      className="d-flex justify-content-between flex-column h-100"
    >
      {permisosHabilitados === 1 ? (
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
        <div>{()=>redirigir("/")}</div>
      )}
    </Box>
  );

  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
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
  );
}
