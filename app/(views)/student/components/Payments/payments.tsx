'use client'
import React, { useEffect, useState } from "react";
import { DataGrid, GridCellParams, GridColDef} from '@mui/x-data-grid';
import { useTheme } from '@mui/system';
import { tokens } from '@/app/theme';
import { Box, Typography, Button } from '@mui/material';
import Header from "@/app/components/Header/header";
import OrderDetailModal from "./OrderDetailModal";
import useSWR from "swr";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
type JsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => void;
};

interface PaymentData {
  payment_id: number;
  payment_amount: number;
  payment_date: string;
  payment_method: string;
  payment_status: number;
  transaction_id: number;
  enrollment_id: number;
  created_at: string;
  deleted_at?: any;
  updated_at?: any;
  enrollment_course: Enrollmentcourse;
}

interface Enrollmentcourse {
  course: any;
  usser: any;
  enrollment_id: number;
  feedback_course?: any;
  enrollment_date: string;
  user_id: number;
  course_id: number;
  created_at: string;
  deleted_at?: any;
  updated_at?: any;
  payment_status: boolean;
  completion_status: boolean;
}

export default function OrdersPage() {
  const fetcher = (url: any) => axios.get(url).then((res: { data: any; }) => res.data)
  const { data, error, isLoading } = useSWR('/api/myPayment', fetcher)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orders, setOrders] = useState<PaymentData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if(data ){
      setOrders(data);
    }
  }, [data]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID Orden', width: 200, flex: 1},
    { field: 'createdAt', headerName: 'Fecha', width: 200 },
    { field: 'paid', headerName: 'Pagado', width: 200, flex: 1},
    { field: 'recipient', headerName: 'Cliente', flex: 1 },
    { field: 'products', headerName: 'Producto/s', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <div>
          <Button
            size="small"
            variant="contained"
            color="info"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleViewOrder(params.row.id)}
          >
            Ver Orden
          </Button>
          {params.row.paid && (
              <Button
              size="small"
                variant="contained"
                color="secondary"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDownloadInvoice(params.row.id)}
              >
                Descargar Factura
              </Button>
          )}
        </div>
      ),
    },
  ];

  const rows = data && data.map((order : any) => ({
    id: order.payment_id,
    createdAt: new Date(order.created_at).toLocaleString(),
    paid: order.payment_status === 1 ? 'SI' : 'NO',
    recipient: `${order.enrollment_course.usser.first_name} ${order.enrollment_course.usser.email} ${order.enrollment_course.usser.address}`,
    products: order.enrollment_course.course.course_name,
  }
  ));

  const handleViewOrder = (orderId: Number) => {
    // Aquí puedes implementar la lógica para ver el pedido completo, por ejemplo, mostrar un modal con los detalles del pedido.
    const selected = orders.find((order: PaymentData) => order.payment_id === orderId);
    setSelectedOrder(selected as any);
  };

  const handleDownloadInvoice = (orderId : Number) => {
    const selected = orders.find((order: PaymentData) => order.payment_id === orderId);
    
    if(selected) {
      const doc = new jsPDF({
        orientation: "landscape", // Cambia a 'portrait' si quieres página vertical
        unit: "mm", // Unidad de medida, milímetros en este caso
        format: [420, 297], // Tamaño A4: Ancho x Alto en milímetros
      })  as JsPDFWithAutoTable;
    
      // Agregar el logo
      const logoImageURL = "/certificates-logos/Academia.jpg";
      fetch(logoImageURL)
      .then((response) => response.blob())
      .then((logoBlob) => {
          const logoData = new Blob([logoBlob]);
          const logoImage = URL.createObjectURL(logoData);
    
          // Luego, puedes usar logoImage en doc.addImage
          doc.addImage(logoImage, "jpeg", 10, 10, 50, 30);
    
          // Datos de la empresa (ajusta las coordenadas x y y)
          doc.setFontSize(12);
          doc.setFont(undefined as any, 'bold'); // Establecer la fuente en negrita
          doc.text("ACADEMIA A.L", 65, 10);
          doc.setFont(undefined as any, 'normal'); // Restaurar la fuente a la normalidad
          doc.text("Dirección: PALPA 2426 Piso:3", 65, 20);
          doc.text(
            "CABA - Ciudad Autónoma de Buenos Aires - CP: 1426",
            65,
            30
          );
          doc.text("Teléfono: 1168039676", 65, 40);
          doc.text("Email: sac@stanley-pmi.com.ar", 65, 50);
          doc.text("IVA RESPONSABLE INSCRIPTO", 65, 60);
    
          // Columna del medio (tipo de factura - A, B, o C)
          // Dibujar el cuadro alrededor de "A"
      // Dibujar el cuadro alrededor de "A"
          const cuadroWidth = 50;
          const cuadroHeight = 30;
          const cuadroX = 200;
          const cuadroY = 20;
          doc.rect(cuadroX, cuadroY, cuadroWidth, cuadroHeight); // x, y, ancho, alto
      
          // Dibujar la letra "A" más grande en el centro del cuadro
          
    
          // Restaurar el color de texto a negro para el resto del contenido
          const fontSize = 60; // Aumenta el tamaño de la letra
          const textWidth = doc.getStringUnitWidth("B") * fontSize / doc.internal.scaleFactor;
          const textX = cuadroX + (cuadroWidth - textWidth) / 2;
          const textY = cuadroY + cuadroHeight / 2 + fontSize / 7; // Ajuste vertical
          doc.setFontSize(fontSize);
          doc.setTextColor(128, 128, 128); // Color gris
          doc.text("B", textX, textY);
    
          // Código debajo de la letra "A" en color gris
          const codigo = "COD.06";
          const codigoFontSize = 12; // Tamaño de letra para el código
          const codigoWidth = doc.getStringUnitWidth(codigo) * codigoFontSize / doc.internal.scaleFactor;
          const codigoX = cuadroX + (cuadroWidth - codigoWidth) / 2; // Centra horizontalmente respecto al cuadro
          const codigoY = textY + fontSize + 5; // Posición debajo de la letra "A" con un pequeño espacio
          doc.setFontSize(codigoFontSize);
          doc.setTextColor(128, 128, 128); // Color gris
          doc.text(codigo, codigoX, codigoY);
    
          // Restaurar el color de texto a negro para el resto del contenido
          doc.setTextColor(0, 0, 0);
    
          // Dibujar la línea descendente desde la mitad del cuadro
          doc.line(textX + textWidth / 2, cuadroY + cuadroHeight, textX + textWidth / 2, 100);
          doc.setTextColor(0, 0, 0);
    
          // Configurar el fondo gris claro para las filas de "Información del Cliente" y "Condiciones de Venta"
          doc.setFillColor(240, 240, 240); // Color gris claro
          doc.rect(10, 95, 410, 47, "F"); // x, y, ancho, alto, "F" indica que debe rellenarse
    
    
          
    
        // Columna derecha (datos de la factura)
        doc.setFontSize(12);
        doc.setFont(undefined as any, 'bold'); // Establecer la fuente en negrita
        doc.text("FACTURA B Nº00040-00001644",  325, 20);
        doc.setFont(undefined as any, 'normal'); // Restaurar la fuente a la normalidad
        doc.text("Fecha: 04/09/2023",  325, 30);
        doc.text("CUIT: 30-57921525-5", 325, 40);
        doc.text("IIBB: 9021099115",  325, 50);
        doc.text("Inicio de Actividades: 25/09/1973",  325, 60);
        doc.text("Razón social: PARALLEL SOCIEDAD ANONIMA", 325, 70);
    
        // Información del cliente (ajusta las coordenadas x y y)
        doc.setFontSize(12);
        doc.text("INFORMACION DEL CLIENTE", 10, 100);
        doc.setFont(undefined as any, 'bold'); // Establecer la fuente en negrita
        doc.text(`Cliente: ${selected.enrollment_course.usser.first_name} ${selected.enrollment_course.usser.last_name}`, 10, 110);
        doc.setFont(undefined as any, 'normal'); // Restaurar la fuente a la normalidad
        doc.text(`Dirección: ${selected.enrollment_course.usser.address}`, 10, 120);
        doc.text(`DNI: ${selected.enrollment_course.usser.dni}`, 10, 130);
        doc.text(`Email: ${selected.enrollment_course.usser.email}`, 10, 140);
    
        // Condición de venta (ajusta las coordenadas x y y)
        doc.text("Condición: CONSUMIDOR FINAL", 325, 100);
        doc.setFont(undefined as any, 'bold'); // Establecer la fuente en negrita
        doc.text(`Condición de venta: ${selected.payment_method}`,  325, 110);
        doc.setFont(undefined as any, 'normal'); // Restaurar la fuente a la normalidad
        doc.text("Tipo: Producto",  325, 120);
        doc.text(`Orden de compra: ${selected.transaction_id}`,  325, 130);
        // Tabla de conceptos
        const conceptosData = [
          ["Cantidad", "Código", "Descripción", "% Bonificación", "Precio Unitario", "Subtotal"],
          [`1,00`,"0", selected.enrollment_course.course.course_name, `${selected.enrollment_course.course.apply_discount === true ? selected.enrollment_course.course.discount_percentage : 0}`, `${selected.enrollment_course.course.price_course}`, `${selected.enrollment_course.course.apply_discount === true ? selected.enrollment_course.course.price_course - (selected.enrollment_course.course.price_course * selected.enrollment_course.course.discount_percentage) / 100  : selected.enrollment_course.course.price_course > 0 ? selected.enrollment_course.course.price_course: 0}`],
        ];

        const tableOptions  = {
          startY: 155,
          
          head: [['Cantidad', 'Código', 'Descripción', '% Bonificación', 'Precio Unitario', 'Subtotal']],
          body: conceptosData.slice(1),
          theme: "grid",
          addPageContent: function(data: string) {
            doc.setFontSize(12);
            doc.setFont(undefined as any, 'bold'); // Establecer la fuente en negrita
            doc.text("CONCEPTOS", 13, 152); // Coloca "CONCEPTOS" como título de la tabla
            doc.setFont(undefined as any, 'normal'); // Restaurar la fuente a la normalidad
          },
        };
    
        doc.autoTable(tableOptions);
        
        // Total
        doc.text(`Subtotal $ ${selected.enrollment_course.course.apply_discount === true ? selected.enrollment_course.course.price_course - (selected.enrollment_course.course.price_course * selected.enrollment_course.course.discount_percentage) / 100 : selected.enrollment_course.course.price_course > 0 ? selected.enrollment_course.course.price_course: 0}`, 370, (doc as any).autoTable.previous.finalY + 10);
        doc.text(`Total Descuento $ ${selected.enrollment_course.course.apply_discount === true ? (selected.enrollment_course.course.price_course * selected.enrollment_course.course.discount_percentage) / 100 : 0}`, 370, (doc as any).autoTable.previous.finalY + 20);
        doc.text(`TOTAL $ ${selected.enrollment_course.course.apply_discount === true ? selected.enrollment_course.course.price_course - (selected.enrollment_course.course.price_course * selected.enrollment_course.course.discount_percentage) / 100  : selected.enrollment_course.course.price_course > 0 ? selected.enrollment_course.course.price_course: 0}`, 370, (doc as any).autoTable.previous.finalY + 30);
    
        // Observaciones
        doc.setFillColor(240, 240, 240); // Color gris claro
        doc.rect(10, 215, 410, 25, "F"); // x, y, ancho, alto, "F" indica que debe rellenarse
        doc.text("OBSERVACIONES", 10, (doc as any).autoTable.previous.finalY + 50);
        doc.text(`Comprobante generado por orden de Academia AL con ID ${selected.transaction_id}`, 10, (doc as any).autoTable.previous.finalY + 60);
    
        // Guardar el PDF
        doc.save("factura.pdf");
      })
      .catch((error) => {
        console.error("Error al cargar la imagen:", error);
      });
      console.log(selected)
    }
  };

  return (
    <Box m="20px">
      <Header title="Mis Pagos" subtitle="Ver mis órdenes" />
      <Box
        m="40px 0 0 0"
        
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {isLoading ? (
          <Typography variant="h5">Cargando...</Typography>
        ) : error ? (
          <Typography variant="h5">Error al cargar los datos</Typography>
        ) : data && data.length === 0 ? (
          <Typography variant="h5">No hay datos disponibles</Typography>
        ) : (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows || []} // Asegúrate de manejar los casos en los que rows sea null
              columns={columns}
            />
          </div>
        )}
      </Box>
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </Box>
  );
}
