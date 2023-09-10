'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import './page.css'
function CertificateValidate({data} : any) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(false);
  
  
  useEffect(() => {
    if(data?.files?.length > 0) {
      setUrl(`/Users/Certificates/${data.files[0]?.name}`);
      setIsValid(true);

    }
  }, [data]);
  console.log(data)
  return (
    <div className={`color flex flex-col items-center h-screen ${isValid ? 'valid-certificate' : 'invalid-certificate'}`}>
      {isValid ? (
        <>
          <h1 className="text-4xl font-bold mb-4 text-white">Certificado Válido</h1>
          <Image src={url} width={1100} height={500} alt='certificate' />
        </>
      ) : (
        <div className="text-center">
          <p className="text-4xl font-bold mb-4 text-white">¡Ups! Este certificado no está validado en el sistema.</p>
          <Image src='https://images.unsplash.com/photo-1576342351769-f43503184a77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1633&q=80' width={900} height={500} alt='invalid-certificate' />
        </div>
      )}
    </div>
  );
}

export default CertificateValidate;