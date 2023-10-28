'use client'
import { Box } from "@mui/material";
import React, { useState, useRef, FormEvent, useEffect } from "react";
import SignatureCanvas from 'react-signature-canvas';
import Header from "../Header/header";
import Image from 'next/image';
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { set } from "date-fns";
import { useRouter } from 'next/navigation';
import { mutate } from "swr";
function SignaturePad({user, signature}: any){
    const router = useRouter()
    const [sign, setSign] = useState<SignatureCanvas | null>(null);
    const [url, setUrl] = useState<string>(''); 
    const [showSignatureArea, setShowSignatureArea] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const canvasRef = useRef<any>(null);

    const handleClear = () =>{
        if (sign) {
            sign.clear();
        }
    };

    useEffect(() => {
        if (signature.path && signature.path !== '') {
            // const pathWithoutPublic = signature.path.replace('public', '');
            // Mostrar la imagen utilizando la función Image de Next.js
            setUrl(`${process.env.NEXT_PUBLIC_CDN}/UsersSignatures/${signature.name}`);
        }
    }, [signature]);

    const handleDelete = async (id : number) =>{
          try {
          const res = await fetch(`/api/signatures/${id}`, {
            method: 'DELETE',
          });

          if (res.ok) {
            toast.success('Firma eliminada con éxito');
          } else {
            toast.error('Error al eliminar la firma');
          }
        } catch (error) {
          console.error(error);
        } finally {
            setLoading(false);
            setUrl('');
            router.refresh();
        }
    };

    const handleChangeSignature = () => {
        setShowSignatureArea(true);
    };

    const handleSaveSignature = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (canvasRef.current) {
        const canvas = canvasRef.current.getCanvas();
        const ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0, 0, 0, 0)"; // Establecemos un fondo transparente
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const signatureData = canvas.toDataURL('image/png');
        setUrl(signatureData);
        canvas.toBlob((blob : any) => {
            // Crear un nuevo objeto de tipo File
            const uniqueFileName = uuidv4() + '.png';
            const file = new File([blob], uniqueFileName, { type: "image/png" });
            const data = new FormData();
            data.set("file", file);
            data.append("id", user.user_id);
            data.append("file_id", signature.id || '');
            // Aquí tienes el objeto de tipo File que contiene la firma
            setLoading(true);
            if(signature.path && signature.path !== ''){
                console.log('PUT')
                data.append("fileNameOld", signature.name);
                data.append("filePathOld", signature.path);
                fetch(`/api/signatures`, {
                    method: 'PUT',
                    body: data,
                })
                .then(response => response.json())
                .then(async data => {
                    toast.success('Firma actualizada con éxito');
                    console.log('Firma actualizada con éxito:', data);
                })
                .catch(error => {
                    toast.error('Error al actualizar la firma');
                    console.error('Error al actualizar la firma:', error);
                })
                .finally(() => {
                    setLoading(false);
                    router.refresh();
                });
            } else {
                console.log('POST')
                fetch('/api/signatures', {
                    method: 'POST',
                    body: data,
                  })
                  .then(response => response.json())
                  .then(data => {
                    toast.success('Firma guardada con éxito');
                    console.log('Firma guardada con éxito:', data);
                  })
                  .catch(error => {
                    console.error('Error al guardar la firma:', error);
                  })
                  .finally(() => {
                    setLoading(false);
                    router.refresh();
                  });
            }
          }, 'image/png'); 
        setShowSignatureArea(false);
        } else {
            return;
        }
    };
    return(
      <Box m="20px" >
        <Header title="Firma Digital" subtitle="Mi Firma" />
        <Box mb="20px">
          <div style={{ display: "flex", flexDirection: "row" }}>
                {/* Sidebar (El código para el sidebar iría aquí) */}
                <form onSubmit={(e) => handleSaveSignature(e)}>
                <div >
                    {showSignatureArea ? (
                        <div style={{ textAlign: "center" }}>
                            <div style={{ border: "2px solid black", width: 500, height: 200, background: 'white' }}>
                                <SignatureCanvas 
                                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                                    ref={(ref) => { setSign(ref); canvasRef.current = ref }}
                                />
                            </div>
                            <br />
                            <button style={{ height: "30px", width: "80px", margin: "10px", backgroundColor: "red", color: "white" }} type='button' onClick={handleClear}>
                                Limpiar
                            </button>
                            <button style={{ height: "30px", width: "160px", margin: "10px", backgroundColor: "green", color: "white" }} disabled={isLoading} type='submit'>
                                Guardar Firma
                            </button>
                            <button style={{ height: "30px", width: "80px", margin: "10px", backgroundColor: "blue", color: "white" }} disabled={Number.isNaN(signature.id) || isLoading || signature.id == undefined} type='button'  onClick={() => handleDelete(signature.id)}>
                                Eliminar
                            </button>

                            <br/><br/>
                            {url ? (
                                <Image className="bg-white" src={url} alt="Vista previa de la firma" width={500} height={500} />
                            ) : (
                                <p>No hay firma actual</p>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            {url ? (
                                <div>
                                   <Image className="bg-white" src={url} alt="Vista previa de la firma" width={500} height={500} />
                                    <br />
                                    <button style={{ height: "30px", width: "120px", margin: "10px", backgroundColor: "purple", color: "white"}} disabled={isLoading} onClick={handleChangeSignature}>
                                        Cambiar Firma
                                    </button>
                                </div>
                            ) : (
                                <button style={{ height: "30px", width: "120px", margin: "10px", backgroundColor: "orange", color: "white" }} onClick={handleChangeSignature}>Firmar Aquí</button>
                            )}
                        </div>
                    )}
                </div>
                </form>
            </div>
        </Box>
    </Box>

    );
}

export default SignaturePad;