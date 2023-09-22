'use client'
import React, { useState, useEffect } from 'react';
import { Modal, Button} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Pregunta {
  faqId: number;
  categoria: string;
  pregunta: string;
  respuesta: string;
  feedback: string;
  likes: number;
  dislikes: number;
}

interface UltimaActualizacion {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  type: string | null;
}

const NoticeAutomatic = () => {
  
  const [ultimaActualizacion, setUltimaActualizacion] = useState<UltimaActualizacion[] | null>(null); 
  const [feedback, setFeedback] = useState(null);
  const [preguntaMasPopular, setPreguntaMasPopular] = useState<Pregunta | null>(null);
  const [preguntaMenosPopular, setPreguntaMenosPopular] = useState< Pregunta | null>(null);
  const [preguntaMasDisgustada, setPreguntaMasDisgustada] = useState< Pregunta | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const route = useRouter()

  useEffect(() => {
    obtenerDatosDesdeAPI();
  }, []);
  
  useEffect(() => {
    if (!ultimaActualizacion) {
      return; // Salir si ultimaActualizacion no está definida
    }
    const unaSemanaEnMillisegundos = 7 * 24 * 60 * 60 * 1000; // Una semana en milisegundos
    const ahora = new Date().getTime();
    // Función asincrónica para manejar la lógica de actualización
    const handleUpdate = async () => {
      if (ultimaActualizacion) {
        const ultimaActualizacionLocal = new Date(ultimaActualizacion[0].updated_at).getTime();
        console.log("Hora actual (ahora):", new Date(ahora).toLocaleString());
        console.log("Hora de última actualización (ultimaActualizacionLocal):", new Date(ultimaActualizacionLocal).toLocaleString());
  
        if (ahora - ultimaActualizacionLocal >= unaSemanaEnMillisegundos) {
          // console.log('No es necesario actualizar');
          setMostrarModal(true);
          try {
            const response = await axios.put('/api/updateTime');
            if (response.status === 200) {
              // toast.success('Se ha actualizado la fecha de última actualización');
              console.log('Fecha de última actualización actualizada');
            }
          } catch (error) {
            console.error('Error al actualizar:', error);
            // toast.error('Error al actualizar la fecha de última actualización');
          }
        }
      }
    };
  
    // Llama a la función asincrónica
      handleUpdate();
  }, [ultimaActualizacion]);
     
  const handleClose = () => {
    setMostrarModal(false);
  };

  const handleGoToFaq = () => {
    if(preguntaMasDisgustada) {
      route.push(`/admin/faqs/${preguntaMasDisgustada.faqId}`)
    }
    setMostrarModal(false);
  }


  const obtenerDatosDesdeAPI = async () => {
    try {
      const response = await fetch('/api/user_interactions'); // Ruta de la API en tu proyecto
      if (response.ok) {
        const data = await response.json();
        // Aquí obtén los datos que necesitas, incluida la fecha de última actualización
        const { preguntaMasPopular, preguntaMenosPopular, preguntaMasDisgustada, ultimaActualizacion } = data;
        // Actualiza el estado con la fecha de última actualización
        setUltimaActualizacion(ultimaActualizacion);
        setPreguntaMasPopular(preguntaMasPopular);
        setPreguntaMenosPopular(preguntaMenosPopular);
        setPreguntaMasDisgustada(preguntaMasDisgustada);
      } else {
        console.error('Error al obtener datos desde la API:', response.status);
      }
    } catch (error) {
      console.error('Error al obtener datos desde la API:', error);
    }
  };


  return (
    <div>
      <Modal open={mostrarModal} onClose={handleClose}>
        <div className=" fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-120 text-black font-serif">
            <div className="text-2xl font-bold text-center pb-5">
              Esta es la pregunta en la sección de Feedback que más ha sido reseñada negativamente en la última semana:
            </div>
            <div className="text-center">
              {preguntaMasDisgustada && (
                <div>
                  <h5 className="text-lg font-semibold mb-2">Categoría:</h5>
                  <p className="mb-2">{preguntaMasDisgustada.categoria}</p>
                  <h5 className="text-lg font-semibold mb-2">Pregunta:</h5>
                  <p className="mb-2">{preguntaMasDisgustada.pregunta}</p>
                  <h5 className="text-lg font-semibold mb-2">Respuesta:</h5>
                  <p className="mb-2">{preguntaMasDisgustada.respuesta}</p>
                  <h5 className="text-lg font-semibold mb-2">Cantidad de Usuarios a los que no les sirvió la respuesta:</h5>
                  <p className="mb-2">{preguntaMasDisgustada.dislikes}</p>
                  <h5 className="text-lg font-semibold mb-2">Comentario dejado por el Usuario:</h5>
                  <p className="mb-2">{preguntaMasDisgustada.feedback}</p>
                </div>
              )}
              <div className="flex flex-col justify-center mt-4">
              <Button
                  onClick={handleGoToFaq}
                  variant='outlined'
                  className='bg-indigo-500  text-white font-bold py-2 px-4 rounded'
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.dark', // Fondo de color del botón al pasar el mouse
                    },
                  }}
                >
                  Administrar Faq
                </Button>
                <Button
                  onClick={handleClose}
                  variant='outlined'
                  className='bg-red-500  text-white font-bold py-2 px-4 rounded'
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.dark', // Fondo de color del botón al pasar el mouse
                    },
                  }}
                >
                  Cerrar
                </Button>
                
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NoticeAutomatic;
