import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const styles = {
  title: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "16px",
    fontSize: "1.5rem",
  },
  modalContent: {
    backgroundColor: "white", // Cambiado a fondo blanco para una mejor legibilidad
  },
  tableContainer: {
    marginBottom: "16px",
  },
  tableHeader: {
    backgroundColor: "#f3f3f3",
  },
  tableCell: {
    color: "black", // Cambiado el color del texto a negro
    fontSize: "1.2rem",
  },
  customerInfo: {
    color: "black", // Cambiado el color del texto a negro
    marginTop: "16px",
    padding: "16px", // Añadido padding para separar el contenido
    backgroundColor: "#f3f3f3", // Fondo gris claro para la información del cliente
  },
  paymentInfo: {
    color: "black", // Cambiado el color del texto a negro
    marginTop: "16px",
    padding: "16px", // Añadido padding para separar el contenido
    backgroundColor: "#f3f3f3", // Fondo gris claro para la información de pago
  },
};

export default function OrderDetailModal({ order, onClose } : any ) {
  return (
    <Dialog open={!!order} onClose={onClose} fullWidth maxWidth="md">
      {order && (
        <>
          <DialogTitle style={styles.title}>Detalle del Pedido</DialogTitle>
          <DialogContent style={styles.modalContent}>
            <Box style={styles.tableContainer}>
              <TableContainer component={Box}>
                <Table size="small">
                  <TableHead style={styles.tableHeader}>
                    <TableRow>
                      <TableCell style={styles.tableCell}>Producto</TableCell>
                      <TableCell style={styles.tableCell}>Cantidad</TableCell>
                      <TableCell style={styles.tableCell}>Precio Unitario</TableCell>
                      <TableCell style={styles.tableCell}>Porcentaje de Descuento</TableCell>
                      <TableCell style={styles.tableCell}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow>
                        <TableCell style={styles.tableCell}>{order.enrollment_course.course.course_name}</TableCell>
                        <TableCell style={styles.tableCell}>1</TableCell>
                        <TableCell style={styles.tableCell}>${order.enrollment_course.course.isFree === false ? order.enrollment_course.course.price_course : 'Gratis'}</TableCell>
                        <TableCell style={styles.tableCell}>{order.enrollment_course.course.isFree === false ? order.enrollment_course.course.apply_discount === true ? order.enrollment_course.course.discount_percentage : 0 : '--------'}%</TableCell>
                        <TableCell style={styles.tableCell}>${order.enrollment_course.course.isFree === false ? order.enrollment_course.course.apply_discount === true ? order.enrollment_course.course.price_course - (order.enrollment_course.course.price_course * order.enrollment_course.course.discount_percentage) / 100 : order.enrollment_course.course.price_course : '--------'}</TableCell>
                      </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box style={styles.customerInfo}>
              <Typography variant="h4" style={{ marginBottom: "8px" }}>
                Información del Cliente:
              </Typography>
              <Typography variant="h5">
                Nombre: {order.enrollment_course.usser.first_name} {order.enrollment_course.usser.last_name} 
              </Typography>
              <Typography variant="h5">
                Correo: {order.enrollment_course.usser.email}
              </Typography>
              <Typography variant="h5">
                Dirección: {order.enrollment_course.usser.address}
              </Typography>
            </Box>
            <Box style={styles.paymentInfo}>
              <Typography variant="h4" style={{ marginBottom: "8px"}}>
                Información de Pago:
              </Typography>
              <Typography variant="h5">Fecha de Creación: {new Date(order.created_at).toLocaleString()}</Typography>
              <Typography variant="h5">Pagado: {order.payment_status === 1 ? "Sí" : "No"}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
          <Button onClick={onClose} color="error" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Cerrar
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}


