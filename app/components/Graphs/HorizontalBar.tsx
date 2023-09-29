'use client'
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  registerables,
} from 'chart.js';
import { Box, TextField, Button } from '@mui/material';
import Header from '../Header/header';
import axios from 'axios';
ChartJS.register( ...registerables);

interface CourseData {
  course_name: string;
  popularity: number;
}
const HorizontalBar = () => {
  const [coursePopularity, setCoursePopularity] = useState<CourseData[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[]; backgroundColor: string }[];
  }>({
    labels: [],
    datasets: [],
  });
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/statistics/horizontalBar?startDate=${startDate}&endDate=${endDate}`);
      if (response && response.data) {
        console.log(response)
        setCoursePopularity(response.data); 
      } else {
        console.error('Error al cargar los datos del servidor');
        setCoursePopularity([]);
      }
    } catch (error) {
      console.error('Error de red:', error);
      console.log(error)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [chartOptions, setChartOptions] = useState({});


  useEffect(() => {
    const labels = coursePopularity.map((item) => item.course_name);
    const dataValues = coursePopularity.map((item) => item.popularity);
  
    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          axis: 'y',
          label: 'Cursos Más Inscritos',
          data: dataValues,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 1)',
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
            text: `Cursos Más Populares`,
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
    

  }, [coursePopularity, startDate, endDate]);

  return (
    <Box m="20px">
      <Header
        title={`Gráfico de Barras Horizontales 'Inscripciones'`}
        subtitle={`Gráfico de Barras Horizontales de los Cursos Más 'Inscritos'`}
      />
      <Box height="75vh">
      <TextField
            className='mx-1'
            label="Fecha de inicio"
            variant="filled"
            color="info"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            className='mx-1'
            label="Fecha de finalización"
            variant="filled"
            color="info"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button variant="outlined" color="success"  onClick={fetchData} className='mx-1 h-14'>
            Aplicar Filtro
          </Button>
        <div className='w-10/12 md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-opacity-95 bg-white my-4'>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Box>
    </Box>
  );
};

export default HorizontalBar;
