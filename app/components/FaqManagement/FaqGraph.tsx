'use client'
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


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

const QuestionStats = () => {
  const [ultimaActualizacion, setUltimaActualizacion] = useState<UltimaActualizacion[] | null>(null); 
  const [preguntaMasPopular, setPreguntaMasPopular] = useState<Pregunta | null>(null);
  const [preguntaMenosPopular, setPreguntaMenosPopular] = useState< Pregunta | null>(null);
  const [preguntaMasDisgustada, setPreguntaMasDisgustada] = useState< Pregunta | null>(null);
 
  useEffect(() => {
    obtenerDatosDesdeAPI();
  }, []);
  
  const obtenerDatosDesdeAPI = async () => {
    try {
      const response = await fetch('/api/user_interactions');
      if (response.ok) {
        const data = await response.json();
        const { preguntaMasPopular, preguntaMenosPopular, preguntaMasDisgustada, ultimaActualizacion } = data;
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

  let chartDataLikes = null;
  let chartDataDislikes = null;

  if (preguntaMasPopular && preguntaMenosPopular && preguntaMasDisgustada) {
    chartDataLikes = {
      labels: ['Más Gustada', 'Menos Popular', 'Más Disgustada'],
      datasets: [
        {
          label: 'Cantidad de Likes',
          data: [
            preguntaMasPopular.likes,
            preguntaMenosPopular.likes,
            preguntaMasDisgustada.likes,
          ],
          backgroundColor: ['green', 'yellow', 'red'],
        },
      ],
    };

    chartDataDislikes = {
      labels: ['Más Gustada', 'Menos Popular', 'Más Disgustada'],
      datasets: [
        {
          label: 'Cantidad de Dislikes',
          data: [
            preguntaMasPopular.dislikes,
            preguntaMenosPopular.dislikes,
            preguntaMasDisgustada.dislikes,
          ],
          backgroundColor: ['green', 'yellow', 'red'],
        },
      ],
    };
  }

  const chartOptionsLikes = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Cantidad de Me gusta',
        font: {
          size: 18, // Tamaño de fuente para el título
          weight: 'bold', // Negrita para el título
        },
      },
    },
  };
  
  const chartOptionsDislikes = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Cantidad de No me gusta',
        font: {
          size: 18, // Tamaño de fuente para el título
          weight: 'bold', // Negrita para el título
        },
      },
    },
  };

  return (
    <div className='py-5'>
      <div className="question-info">
        {preguntaMasPopular && (
          <div className="question border p-4 mb-4 rounded-lg bg-green-100">
            <h2 className="text-xl font-semibold text-green-800">Más Gustada:</h2>
            <p className="text-lg  text-black font-semibold">Categoría: {preguntaMasPopular.categoria}</p>
            <p className="text-lg  text-black">Pregunta: {preguntaMasPopular.pregunta}</p>
            <p className="text-lg  text-black">Respuesta: {preguntaMasPopular.respuesta}</p>
            <p className="text-lg  text-black">Likes: {preguntaMasPopular.likes}</p>
            <p className="text-lg  text-black">Dislikes: {preguntaMasPopular.dislikes}</p>
          </div>
        )}
        {preguntaMenosPopular && (
          <div className="question border p-4 mb-4 rounded-lg bg-red-100">
            <h2 className="text-xl font-semibold text-red-800">Menos Popular:</h2>
            <p className="text-lg font-semibold  text-black">Categoría: {preguntaMenosPopular.categoria}</p>
            <p className="text-lg  text-black">Pregunta: {preguntaMenosPopular.pregunta}</p>
            <p className="text-lg  text-black">Respuesta: {preguntaMenosPopular.respuesta}</p>
            <p className="text-lg  text-black">Likes: {preguntaMenosPopular.likes}</p>
            <p className="text-lg  text-black">Dislikes: {preguntaMenosPopular.dislikes}</p>
          </div>
        )}
        {preguntaMasDisgustada && (
          <div className="question border p-4 mb-4 rounded-lg bg-yellow-100">
            <h2 className="text-xl font-semibold text-yellow-800">Más Disgustada:</h2>
            <p className="text-lg font-semibold  text-black">Categoría: {preguntaMasDisgustada.categoria}</p>
            <p className="text-lg  text-black">Pregunta: {preguntaMasDisgustada.pregunta}</p>
            <p className="text-lg  text-black">Respuesta: {preguntaMasDisgustada.respuesta}</p>
            <p className="text-lg  text-black">Likes: {preguntaMasDisgustada.likes}</p>
            <p className="text-lg  text-black">Dislikes: {preguntaMasDisgustada.dislikes}</p>
          </div>
        )}
      </div>
      {/* {chartDataLikes && (
        <div className="chart">
          <Bar data={chartDataLikes} options={chartOptionsLikes} />
        </div>
      )} */}
      {/* Mostrar el gráfico de Dislikes si los datos están disponibles */}
      {/* {chartDataDislikes && (
        <div className="chart">
          <Bar data={chartDataDislikes} options={chartOptionsDislikes} />
        </div>
      )} */}
    </div>
  );
};

export default QuestionStats;
