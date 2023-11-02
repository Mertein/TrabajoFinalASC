'use client'
import Header from '@/app/components/Header/header';
import {
  Alert,
  Box,
  Button,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import jsPDF  from "jspdf";
import html2canvas from 'html2canvas';

interface Enrollment {
  course: {
    course_name: string;
    description_course: string;
  };
  files: Array<{
    name: string;
  }>;
}

function CertificateStudent({ enrollments }: { enrollments: Enrollment[] }) {
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [certificatePdf, setCertificatePdf] = useState('');
  const handleCertificateClick = (certificateUrl: string | null) => {
    setSelectedCertificate(certificateUrl);
  };

  const handleCloseModal = () => {
    setSelectedCertificate(null);
  };

  const generateUniqueFileName = (type: string) => {
    const timestamp = Date.now();
    return `certificate_${timestamp}.${type}`;
  };

  const handleDownloadCertificate = (enrollment: any) => {
    if (enrollment.files[0] === null) {
      return console.log('No se pudo descargar el certificado');
    }
    // Use the enrollment data to generate the certificate.
    const pdf = new jsPDF('l', 'mm', [1000, 670]);
    pdf.addImage(`${process.env.NEXT_PUBLIC_CDN}/UsersCertificates/${enrollment.files[0].name}`, 'PNG', 0, 0, 1000, 667);
    pdf.save(generateUniqueFileName('pdf'));
    setCertificatePdf(`${process.env.NEXT_PUBLIC_CDN}/UsersCertificates/${enrollment.files[0].name}`);
  }
  
  const hasCertificates = enrollments.some((enrollment) => enrollment.files.length > 0);

  return (
    <Box m="20px">
      <Header title="Mis Certificados" subtitle="Ver todos mis certificados" />
      <Dialog
        open={!!selectedCertificate}
        onClose={handleCloseModal}
        PaperProps={{
          style: {
            maxWidth: '100%', // Ajusta el ancho según sea necesario
            maxHeight: '100%', // Ajusta la altura según sea necesario
            backgroundColor: 'transparent', // Elimina el color de fondo del dialogo
          },
          className: 'custom-dialog', // Agrega una clase personalizada para estilos adicionales si es necesario
        }}
      >
        <DialogTitle variant='h2' style={{color: "black", alignItems: "center", font: "bold", textAlign: "center"}}>Certificado</DialogTitle>
        <DialogContent>
          {selectedCertificate && ( // Conditionally render Image when selectedCertificate is not null
            <DialogContentText>
              <Image src={selectedCertificate} alt="Certificado del Alumno" width={500} height={500} />
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="error" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <div className="grid-cols-1 sm:grid md:grid-cols-3">
        {enrollments.length > 0 ? (
          enrollments.map((enrollment, key) => (
            enrollment.files.length > 0 ? (
              <div
                key={key}
                className="mx-3 mt-6 flex flex-col self-start rounded-lg bg-white shadow-lg dark:bg-gray-800 sm:shrink-0 sm:grow sm:basis-0"
                onClick={() => handleCertificateClick(`${process.env.NEXT_PUBLIC_CDN}/UsersCertificates/${enrollment.files[0].name}`)}
              >
                <a href="#!">
                  <Image
                    className="rounded-t-lg"
                    src={enrollment.files[0] ? `${process.env.NEXT_PUBLIC_CDN}/UsersCertificates/${enrollment.files[0].name}` : 'image'}
                    alt="Palm Springs Road"
                    width={500}
                    height={500}
                  />
                </a>
                <div className="p-6">
                  <h5 className="mb-2 text-xl font-medium leading-tight text-gray-800 dark:text-gray-50">
                    {enrollment.course.course_name}
                  </h5>
                  <p className="mb-4 text-base text-gray-600 dark:text-gray-200">
                    {enrollment.course.description_course}
                  </p>
                </div>
                <CardActions>
                  <Button size="medium" color="info" variant='contained' className='bg-blue-400' type='button' onClick={() => handleDownloadCertificate(enrollment)}>
                       Descargar Certificado 
                  </Button>
                </CardActions>
              </div>
            ) : null
          ))
        ) : null
        }
        {!hasCertificates && <Alert severity="info">No tienes certificados</Alert>}
      </div>
    </Box>
  );
}

export default CertificateStudent;
