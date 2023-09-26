'use client'
import moment, { duration } from 'moment'
import 'moment/locale/es'; // Importa el idioma español para moment
import styles from '../styles/certificateGenerator.module.scss'
import logo from '../../../../public/images/logo.jpg'
import html2canvas from 'html2canvas';
import jsPDF  from "jspdf";
import {useRef, useState } from 'react'
import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import signatureAcademy from '../../../../public/certificates-logos/signatureAcademy.png';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';

const Certificate = ({ name, course, dateOfConductStart, dateOfConductEnd, signature, signatureDetails,  url, enrollmentId, instructor, src, category} : any) => {
  const certificateRef = useRef(null);
  const [isLoading ,setIsLoading] = useState(false);
  const [certificatePdf, setCertificatePdf] = useState('');
  const formattedStart = dateOfConductStart
  ? moment(dateOfConductStart).locale('es').format('dddd DD [de] MMMM ')
  : '-';
  
  const route = useRouter();
  const formattedEnd = dateOfConductEnd
    ? moment(dateOfConductEnd).locale('es').format('dddd DD [de] MMMM [de] YYYY')
    : '-';
    const generateUniqueFileName = (type: string) => {
      const timestamp = Date.now();
      return `certificate_${timestamp}.${type}`;
  };

  const handleDownloadCertificate = () => {
    alert('Descargando certificado');
    if(certificateRef.current === null) {
      return console.log('No se pudo descargar el certificado');
    }

    html2canvas(certificateRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', [1000, 670]);
      pdf.addImage(imgData, 'PNG', 0, 0, 1000, 667);
      pdf.save(generateUniqueFileName('pdf'));
      setCertificatePdf(imgData);
    });
  }
 
  const handleGrant = async (e : any) => {
    e.preventDefault();
    if(certificatePdf === '') return console.log('No se pudo descargar el certificado');
    setIsLoading(true);
    try {
      const canvas = await html2canvas(certificateRef.current!, {
        backgroundColor: null,
      });
      
      // Convert the canvas to a Blob
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
      const fileName = generateUniqueFileName('jpg');
      if (!blob) {
        return;
      }
      // Create a new File object from the Blob
      const file = new File([blob], fileName, { type: "image/jpg"});
      if (file) {
        // Create a FormData object and append the File to it
        const formData = new FormData();
        formData.append("file", file);
        formData.set('enrollmentId', enrollmentId)

        // Send the FormData to the backend using a POST request
        const response = await fetch("/api/certificate/grantStudentCertificate", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Show a success notification or message here
          toast.success('Certificado Otorgado con exito.');
          route.push('/admin/certificate/studentCertificate');
          setTimeout(() => {
            route.refresh();
          }, 1000);
        } else {
          throw new Error("Hubo un error al otrorgar el certificado.");
        }
      } else {
        throw new Error("Certificate image not available. Please generate it first.");
      }
    } catch (error) {
      console.error(error);
      // Show an error notification or message here
      toast.error('Hubo un error al otrorgar el certificado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleGrant}>
      <div ref={certificateRef} className={styles.certificateWrapper}>
        <div className={styles.certificateContainer}>

          <div className={styles.logoBlock}>
            <img  className={styles.logoImage} src={logo.src} alt=''/>
          </div>

          <h1>CERTIFICADO</h1>

          <span className={styles.mediumText}>Este certificado se otorga con orgullo a</span>

          <p className={styles.primaryItalicText}>{name}</p>

          <span className={styles.mediumText}>por completar exitosamente el curso de</span>
          <h1 className={styles.smallText}>Categoria: {category}</h1>
          <h1 className={styles.smallText}>Nombre: {course}</h1>

          <span className={styles.smallText}>{`realizado desde el ${
            formattedStart
          } hasta el ${formattedEnd}`}</span>
          
         
          {/* New signature section */}
          <div className={styles.signatureContainer}>
              {/* Academia Signature */}
              <div className={`${styles.signatureBlock} ${styles.leftSignature}`}>
                <img className={styles.signatureImage} src={signatureAcademy.src} alt='' />
                <div className={styles.signatureLine}></div>
                <span className="text-xs">{signatureDetails} Marta Alicia Lezcano</span>
              </div>
              <div className={`${styles.signatureBlock} ${styles.middleSignature}`}>
                <img className={styles.qrCodeImage} src={src} alt='QR Code' />
              </div>
              {/* Instructor Signature */}
              <div className={`${styles.signatureBlock} ${styles.rightSignature}`}>
                <img className={styles.signatureImage} src={url} alt='' />
                <div className={styles.signatureLine}></div>
                <span className="text-xs">Instructor {instructor}</span>
              </div>
          </div>
         
        </div>
      </div>
      <button  style={{ marginTop: ' 3rem' }} onClick={handleDownloadCertificate}  className="border-2 border-black  w-full  bg-green-500 p-4 shadow-md transition-all duration-300 cursor-pointer text-white hover:bg-green-700 " type='button'>Descargar PDF</button>
      <button  style={{ marginTop: ' 3rem' }} className="border-2 border-black  w-full  bg-blue-500 p-4 shadow-md transition-all duration-300 cursor-pointer text-white hover:bg-blue-700  disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!certificatePdf || isLoading} type='submit'>Otorgar Certificado</button>
    </form>
  </>
  )
}

export default Certificate