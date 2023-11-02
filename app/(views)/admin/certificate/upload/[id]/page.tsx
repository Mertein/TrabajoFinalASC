
'use client'
import { Delete } from '@mui/icons-material';
import {Delete as DeleteIcon} from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Certificate = {
  id: number;
  name: string;
  path: string;
  type: string,
  size: number,
};

function CertificateDetailPage({ params } : any) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const fetchCertificate = async () => {
    try {
      const res = await fetch(`/api/certificate/${id}`);
      if (res.ok) {
        const data = await res.json();// Obtener el certificado como objeto Blob
       
        setCertificate(data);
      } else {
        console.error('Error fetching certificate');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    // Lógica para editar el certificado
  };

  const handleUpdate = () => {
    // Lógica para actualizar el certificado
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/certificate/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log('Certificate deleted successfully');
        router.push('/admin/certificate/upload'); // Redirigir a la página principal o a la lista de certificados
      } else {
        console.error('Error deleting certificate');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {certificate ? (
        <div>
          <h2>{certificate?.name}</h2>
          <div className="flex justify-center">
            <Image src={`/certificates/${certificate.name}`} alt="Certificate" width={1100} height={300} unoptimized={true} />
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="contained" onClick={handleEdit} className="mr-2  bg-blue-500 hover:bg-blue-600 text-white">
              Editar
            </Button>
            
            <Button variant="contained" onClick={handleDelete} className="bg-red-800 hover:bg-red-500 text-white">
                <DeleteIcon/>
            </Button>
          </div>
        </div>
      ) : (
        <p>Cargando Certificado...</p>
      )}
    </div>
  );
}

export default CertificateDetailPage;
