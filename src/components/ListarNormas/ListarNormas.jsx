import React, { useState } from "react";
import "./ListarNormas.css";
import useGet from "../../hook/useGet";
import axios from "../../config/axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import EditarNormaDialog from "../EditarNormaDialog/EditarNormaDialog";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModalGenerica from "../ModalGenerico/ModalGenerico";

const TablaNormas = () => {
  const [normas, getNorma, setNormas] = useGet("/norma/listado", axios);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingNorma, setEditingNorma] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [normaInput, setNormaInput] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [nombreCampoEditado, setNombreCampoEditado] = useState("");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAcceptModal = (norma, habilita) => {
    try {
      axios.post(`/norma/alta`, { norma, habilita }).then((response) => {
        cargarNormas();
        setNormaInput("");
        setOpenModal(false);
        setCheckboxValue(true);
      });
    } catch (error) {
      console.error("Error al guardar Norma:", error);
    }
    handleCloseModal();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  function obtenerNombreCampoPorPosicion(objeto, posicion) {
    var keys = Object.keys(objeto);
    if (posicion >= 0 && posicion < keys.length) {
      return keys[posicion];
    } else {
      return null;
    }
  }
  const handleEdit = (norma) => {
    setEditingNorma({ ...norma });
    setOpenDialog(true);
    const nombreCampo = obtenerNombreCampoPorPosicion(norma, 1);
    setNombreCampoEditado(nombreCampo);
  };
  const handleDelete = (normaId) => {
    const updatedNormas = normas.map((item) =>
      item.id_norma === normaId ? { ...item, habilita: 0 } : item
    );
    setNormas(updatedNormas);
    handleSave(updatedNormas);
  };

  const handleCancel = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "id_norma") {
      setEditingNorma((prevNorma) => ({
        ...prevNorma,
        [name]: value,
      }));
    }
  };
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setEditingNorma((prevValues) => ({
      ...prevValues,
      habilita: isChecked,
    }));
  };
  const cargarNormas = () => {
    axios
      .get("/norma/listado")
      .then((response) => {
        setNormas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener normas:", error);
        setLoading(false);
      });
  };

  const handleSave = (updatedNormas) => {
    if (editingNorma) {
      try {
        const { id_norma, tipo_norma, habilita } = editingNorma;
        axios
          .put(`/norma/editar`, { id_norma, tipo_norma, habilita })
          .then((response) => {
            cargarNormas();
            setEditingNorma(null);
            setOpenDialog(false);
            setNombreCampoEditado("");
          });
      } catch (error) {
        console.error("Error al guardar cambios:", error);
      }
    } else {
      try {
        updatedNormas.forEach((norma) => {
          const { id_norma, tipo_norma, habilita } = norma;
          axios
            .put(`/norma/editar`, { id_norma, tipo_norma, habilita })
            .then((response) => {
              cargarNormas();
            });
        });
      } catch (error) {
        console.error("Error al guardar cambios:", error);
      }
    }
  };

  const columns = [
    {
      id: "id_norma",
      label: "ID de Norma",
      minWidth: "auto ",
      align: "center",
    },
    {
      id: "tipo_norma",
      label: "Tipo de Norma",
      minWidth: "auto",
      align: "center",
    },
    { id: "habilita", label: "Habilita", minWidth: "auto", align: "center" },
  ];

  return (
    <div className="tablaNormas">
      <Paper
        className="container mt-4 mb-4"
        sx={{
          width: "100%",
          boxShadow:
            "0px 2px 4px -1px rgba(165, 53, 53, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div className="pt-1">
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(
                    (column) =>
                      column.id !== "acciones" && (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className="tableCellHeader"
                        >
                          {column.label}
                        </TableCell>
                      )
                  )}
                  <TableCell align="center" colSpan={4}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {normas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((norma, rowIndex) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={rowIndex}
                      className={
                        rowIndex % 2 === 0 ? "tableRowEven" : "tableRowOdd"
                      }
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          width={column.minWidth}
                        >
                          {column.id === "habilita" ? (
                            norma[column.id] ? (
                              <p className="habilitado">Habilitado</p>
                            ) : (
                              <p className="deshabilitado">Deshabilitado</p>
                            )
                          ) : (
                            norma[column.id] !== "acciones" && norma[column.id]
                          )}
                        </TableCell>
                      ))}

                      <TableCell className="d-flex justify-content-center">
                        <EditIcon
                          onClick={() => handleEdit(norma)}
                          className="iconEdit"
                          color="primary"
                        />
                        {norma.habilita === 1 ? (
                          <DeleteIcon
                            className="iconDelete"
                            onClick={() => handleDelete(norma.id_norma)}
                          />
                        ) : (
                          <DeleteIcon className="iconDelete" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {normas.length / rowsPerPage < 1 && rowsPerPage === 10 ? (
            <TablePagination
              className="pagination"
              rowsPerPageOptions={[]}
              component="div"
              count={1}
              rowsPerPage={1}
              page={0}
            />
          ) : (
            <TablePagination
              className="pagination"
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={normas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ from, to, count }) => {
                const currentPage = Math.ceil(from / rowsPerPage);
                const totalPages = Math.ceil(count / rowsPerPage);
                return `${currentPage} de ${totalPages} páginas`;
              }}
              labelRowsPerPage="Filas por página:"
            />
          )}

          <EditarNormaDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            editingNorma={editingNorma}
            handleCheckboxChange={handleCheckboxChange}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            nombreCampo={nombreCampoEditado}
          />
          <ModalGenerica
            open={openModal}
            onClose={handleCloseModal}
            onAccept={() => handleAcceptModal(normaInput, checkboxValue)}
            title="AGREGAR NORMA"
            inputLabel="Nombre de la Norma"
            inputValue={normaInput}
            onInputChange={(e) => setNormaInput(e.target.value)}
            checkboxLabel="Habilitada"
            checked={checkboxValue}
            onCheckboxChange={(e) => setCheckboxValue(e.target.checked)}
          />
        </div>
      </Paper>
      <AddCircleIcon
        className="btnAddNorma"
        color="primary"
        variant="contained"
        onClick={handleOpenModal}
      />
    </div>
  );
};
export default TablaNormas;
