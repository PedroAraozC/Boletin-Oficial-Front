import React from "react";
import {
  Skeleton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from "@mui/material";

const TableLoader = ({ filas }) => {
  const columns = [
    { id: "columna1", label: "Columna 1", align: "center" },
    { id: "columna2", label: "Columna 2", align: "center" },
    { id: "columna3", label: "Columna 3", align: "center" },
    { id: "acciones", label: "Acciones", align: "center" },
  ];

  const rowCount = 1; // Cantidad total de filas

  return (
    <div className="pt-2 pb-2">
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table" className="tablaEdicion">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  className="tableCellHeader"
                >
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(filas)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="pagination"
        rowsPerPageOptions={[]}
        component="div"
        count={rowCount}
        rowsPerPage={filas}
        page={0}
      />
    </div>
  );
};

export default TableLoader;
