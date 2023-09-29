'use client'
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
  TimeScale,
} from 'chart.js';
import { Box, Button, TextField } from '@mui/material';
import Header from '../Header/header';
import axios from 'axios'; // Importa axios

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, LineController, TimeScale);

const EnrollmentTrendChart = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { label: string, data: number[], borderColor: string, backgroundColor: string }[];
  }>({
    labels: [],
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    filterDataByDateRange();
  }
  , []);


  const filterDataByDateRange = async () => {
    // Enviar las fechas de inicio y finalización al backend
    try {
      const response = await axios.get(`/api/statistics/line?startDate=${startDate}&endDate=${endDate}`);
      const filteredData = response.data; // Obtener los datos filtrados del backend

      const labels = filteredData.map((item: any) => item.date);
      const data = filteredData.map((item: any) => item.count);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Inscripciones',
            data: data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });

      setChartOptions({
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Evolución temporal de las Inscripciones',
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: {
                month: 'MMM YYYY',
              },
            },
            title: {
              display: true,
              text: 'Periodo de tiempo',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Inscripciones',
            },
          },
        },
        maintainAspectRatio: false,
        responsive: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Gráfico de Linea" subtitle="Simple Gráfico de Linea" />
      <Box height="75vh">
        <TextField
          label="Fecha de inicio"
          variant="filled"
          color="info"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          className='mx-1 w-max'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="Fecha de finalización"
          className='mx-1 w-max'
          variant="filled"
          color="info"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant='outlined' color='secondary' className='h-14 mx-1' onClick={filterDataByDateRange}>Aplicar Filtro</Button>
        <div className='w-10/12 md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-opacity-90 bg-white my-4'>
          <Line options={chartOptions} data={chartData} />
        </div>
      </Box>
    </Box>
  );
};
export default EnrollmentTrendChart;
