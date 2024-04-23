import { useContext, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate } from "react-router-dom";
import { BolContext } from "../context/BolContext";

const PrivateRoute = ({ children }) => {
  const { getAuth, authenticated, loading, logout} = useContext(BolContext);

  useEffect(() => {
    getAuth();
  }, []);

  return loading ? (
    <div className="d-flex w-100 h-100 mt-5 pt-5 justify-content-center">
      <CircularProgress />
    </div>
  ) : authenticated ? (
    children
  ) : (
    // <Navigate to="/" />
    logout()
  );
};

export default PrivateRoute;
