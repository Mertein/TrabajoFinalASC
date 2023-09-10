'use client'
import React, { useState, useEffect } from 'react';
import { Chart, ArcElement } from 'chart.js'; // Import Chart and ArcElement
import { Pie } from 'react-chartjs-2';
import { Box, MenuItem, Select } from '@mui/material';
import Header from '../Header/header';
import { color } from 'html2canvas/dist/types/css/types/color';

Chart.register(ArcElement); // Register ArcElement

interface CategoryData {
  category_name: string;
  count: number;
}


const PieChart = ({ data }: { data: CategoryData[] }) => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { label: string, data: number[]; backgroundColor: string[], borderColor: string, borderWidth: number }[];
  }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const labels: string[] = data.map(item => item.category_name);
    const dataValues: number[] = data.map(item => item.count);

    setChartData({
      labels: labels,
      datasets: [
      {
        label: "Cantidad de Cursos",
        data: dataValues,
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
    });
  }, [data]);

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Distribución por Categorías de Cursos (Gráfico de Pie)',
        font: {
          size: 40,
        },
        color: '#000000',
      },
    },
    data: data,
    maintainAspectRatio: false,
    responsive: true,
  };


  return (
    <Box m="20px">
      <Header title="Gráfico de Pie" subtitle="Simple Gráfico de Pie" />
      <Box height="75vh">
        <div className='w-10/12 md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-opacity-80 bg-white'>
          <Pie data={chartData}  options={chartOptions}/>
        </div>
      </Box>
    </Box>  
  );
};

export default PieChart;