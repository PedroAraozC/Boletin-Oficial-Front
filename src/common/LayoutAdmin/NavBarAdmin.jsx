import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SideBar from "./SideBarAdmin";
import { useContext, useEffect, useState } from "react";
// import useStore from "../Zustand/Zustand";
// import NavBarEsqueleto from "../components/Esqueletos/NavBarEsqueleto";
import "./NavbarAdmin.css";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logoMuni from "../../assets/Logo-completo-muni.png";
import { Container } from "@mui/material";
import { BolContext } from "../../context/BolContext";

export default function NavBarAdmin() {
  const { getAuth, authenticated, logout, user } = useContext(BolContext);
  const [anchorEl, setAnchorEl] = useState(null);

  // console.log(authenticated);

  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    // navigate("/");
    setAnchorEl(null);
  };
  useEffect(() => {
    getAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {authenticated ? (
        <Box sx={{ flexGrow: 1, minWidth: 300 }}>
          <AppBar position="static" className="fondoAdmin d-flex flex-row">
            {(authenticated && user?.id_persona == 736) ||
            (authenticated && user?.id_tusuario == 1) ? ( //USUARIOS AUTORIZADOS BOLETIN
              <SideBar />
            ) : (
              <></>
            )}
            <Container div className="navContAdmin">
              <div className=" contLogoAdmin mb-3">
                <img src={logoMuni} className="logoNav2Admin" />
                <div className="boletinNavContAdmin">
                  <h1 className="boletinNavAdmin">Boletín Oficial Digital </h1>
                </div>
                <div className="d-md-flex align-items-center m-0 d-none">
                  <p className="m-0 d-none d-xl-flex">{user.nombre_persona}</p>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    className="logOut"
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                  </Menu>
                </div>
                  <div className="d-block d-md-none logoXs">
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      className="logOut"
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                    </Menu>
                  </div>
              </div>
            </Container>
          </AppBar>
        </Box>
      ) : localStorage.getItem("token") ? (
        // <NavBarEsqueleto />
        <></>
      ) : (
        <></>
      )}
    </>
  );
}
