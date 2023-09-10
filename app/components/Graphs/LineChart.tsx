'use client'
import React, { useState, useEffect } from 'react';
import { Line,  } from 'react-chartjs-2';
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
import { Box } from '@mui/material';
import Header from '../Header/header';
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement,LineController,TimeScale);


const EnrollmentTrendChart = ({ enrollmentData }: any) => {
  console.log(enrollmentData)
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { label: string, data: number[], borderColor: string, backgroundColor: string}[];
  }>({
    labels: [],
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});
 
  useEffect(() => {
    const labels = enrollmentData.map((item : any) => item.date); // Assuming 'date' is the property for time period
    const data = enrollmentData.map((item: any) => item.count);

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
          type: 'time', // Use 'time' type for dates
          time: {
            unit: 'month', // Display data by month
            displayFormats: {
              month: 'MMM YYYY', // Format for displaying months
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
  }, [enrollmentData]);

  return (
    <Box m="20px">
      <Header title="Gráfico de Linea" subtitle="Simple Gráfico de Linea" />
      <Box height="75vh">
        <div className='w-10/12 md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-opacity-90 bg-white'>
        <Line options={chartOptions} data={chartData} />
        </div>
      </Box>
    </Box>  
  );
};

export default EnrollmentTrendChart;
