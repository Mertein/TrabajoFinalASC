'use client'
import Header from '@/app/components/Header/header'
import { Box, Button, Card, CardActionArea, CardActions, CardContent, Typography, useMediaQuery } from '@mui/material'
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';


type Certificate = {
  map(arg0: (certificate: Certificate) => JSX.Element): import("react").ReactNode;
  id: number;
  name: string;
  path: string;
  type: string,
  size: number,
};

function UploadCertificatePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | undefined>();
  const [certificates, setCertificates] = useState<Certificate | null>();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificate"); // Ruta para obtener todos los certificados
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      } else {
        console.error("Error fetching certificates");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  console.log(certificates)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    console.log(file)
    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/certificate", {
        method: "POST",
        body: data,
      });
      console.log(res);

      if (res.ok) {
        console.log("File uploaded successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files?.[0]);
  };

  const handleViewCertificate = async (id: number ) => {
    router.push(`/admin/certificate/upload/${id}`);
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");
   
      const [open, setOpen] = useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () =>  {
        setOpen(false);

      };
       
      

    return (
        <Box m="20px">
          <Header
            title="Mis Categorias"
            subtitle="Lista de mis categorias creados"
          />

           
          <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"

          gap="50px"
          
          gridTemplateColumns="repeat(, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
    
        </Box>
          
        <div className="bg-zinc-950 p-5">
        <h1 className="text-4xl text-center my-4">Subir Certificado</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            className="bg-zinc-900 text-zinc-100 p-2 rounded block mb-2"
            onChange={handleFileChange}
          />

          <button
            className="bg-green-900 text-zinc-100 p-2 rounded block w-full disabled:opacity-50"
            disabled={!file}
          >
            Cargar
          </button>
        </form>
        {file && (
          <Image
            src={URL.createObjectURL(file)}
            alt="Uploaded Certificate"
            className="w-64 h-64 object-contain mx-auto"
            width={256}
            height={256}
          />
        )}
         {certificates ? certificates.map((certificate: Certificate) => (
        <Card key={certificate.id} >
          <CardActionArea  className="flex-col" >
            <Image src={`/certificates/${certificate.name}`} alt="Certificate" width={500} height={500} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" className="text-center">
                {certificate.name}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="secondary" onClick={() => handleViewCertificate(certificate.id)}>
              Ver Certificado
            </Button>
          </CardActions>
        </Card>
      )) : null}
      </div>


        </Box>
  )
}

export default UploadCertificatePage;