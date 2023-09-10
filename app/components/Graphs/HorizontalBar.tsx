'use client'
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box } from '@mui/material';
import Header from '../Header/header';
ChartJS.register(Title, Tooltip, Legend);

interface CourseData {
  course_name: string;
  popularity: number;
}

const CoursePopularityChart = ({ data }: any) => {
  const [coursePopularity, setCoursePopularity] = useState<CourseData[]>([]);
  const graphType = 'enrollment'; // 'enrollment' para los cursos más inscritos

  useEffect(() => {
    // Datos simulados para los cursos más inscritos
    setCoursePopularity(data);
  }, []);

  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[]; backgroundColor: string }[];
  }>({
    labels: [],
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const labels: string[] = coursePopularity.map(item => item.course_name);
    const dataValues: number[] = coursePopularity.map(item => item.popularity);

    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          axis: 'y',
          label: graphType === 'enrollment' ? 'Cursos Más Inscritos' : 'Cursos Más Vistos',
          data: dataValues,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `Cursos Más ${graphType === 'enrollment' ? 'Populares' : 'Vistos'}`,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cursos',
            },
          },
        },
        maintainAspectRatio: false,
        responsive: true,
      },
    };

    setChartData(config.data);
    setChartOptions(config.options);
  }, [coursePopularity, graphType]);

  return (
    <Box m="20px">
      <Header
        title={`Gráfico de Barras Horizontales (${graphType === 'enrollment' ? 'Inscripciones' : 'Vistas'})`}
        subtitle={`Gráfico de Barras Horizontales de los Cursos Más ${graphType === 'enrollment' ? 'Inscritos' : 'Vistos'}`}
      />
      <Box height="75vh">
        <div className='w-10/12 md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-opacity-95 bg-white'>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Box>
    </Box>
  );
};

export default CoursePopularityChart;
