'use client'
import React, { useRef } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
});

const Certificate = ({ data }) => {
  const certificateRef = useRef();

  const handleDownloadPDF = () => {
    const input = certificateRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('certificate.pdf');
    });
  };

  // Implementar la lógica para guardar los datos en la base de datos

  return (
    <div className='flex items-center justify-center h-screen w-full bg-blue p-5'>
      <div id="downloadWrapper" ref={certificateRef} >
        <PDFViewer>
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <Text style={styles.title}>Certificado de Finalización Valido</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Nombre del Alumno: {data.nombre} - {data.apellido}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Fecha:</Text>
                <Text>{data.fecha}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Curso:</Text>
                <Text>{data.curso}</Text>
                <Image src='/Users/Certificates/certificate_1691182640665.jpg' />
              </View>
              {/* Agrega aquí más datos dinámicos del certificado */}
            </Page>
          </Document>
        </PDFViewer>
      </div>
      <button onClick={handleDownloadPDF}>Descargar PDF</button>
      <button onClick={() => alert('Certificado otorgado y guardado en la base de datos.')}>
        Otorgar Certificado
      </button>
    </div>
  );
};

export default Certificate;