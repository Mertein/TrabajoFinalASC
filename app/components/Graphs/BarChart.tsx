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
import Header from '../Header/header';
import { Box, Button, Menu, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const BarChart = ({ categories } : any) => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string }[];
  }>({
    labels: [],
    datasets: [],
  });
  const [courseCount, setCourseCount] = useState<number | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const [chartOptions, setChartOptions] = useState({});

  const fetchData = async () => {
    try {
      const categoryFilter = selectedCategoryFilter;
      const startDateFilter = selectedStartDate?.toISOString();
      const endDateFilter = selectedEndDate?.toISOString();
  
      const response = await axios.get(`/api/statistics/bar?category=${categoryFilter}&startDate=${startDateFilter}&endDate=${endDateFilter}`);
      if (response && response.data) {
        setCourseCount(response.data);
      } else {
        setCourseCount(null); // Si no se encuentra el contador en el response, establece el estado como null
      }
  
    } catch (error) {
      console.error(error);
      setCourseCount(null); // En caso de error, establece el estado como null
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const labels: string[] = categories.map((item: { category_name: any; }) => item.category_name);
    const data: number[] = Array.isArray(courseCount) ? courseCount.map((item: { count: any; }) => item.count) : [];

    setChartData({
      labels: labels as any,
      datasets: [
        {
          label: 'Recuento de cursos',
          data: data as any,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgb(53, 162, 235, 0.4)',
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
          text: 'Distribución por Categorías de Cursos',
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    });
  }, [courseCount, categories]);


  return (
    <>
        <Box m="20px">
          <Header title="Gráfico de barras" subtitle="Simple Gráfico de barras" />
          <Box height="75vh">
            <Box margin={4}>
              <Select
                className='mx-2 w-max'
                variant='filled'
                color='info'
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value as string)}
                defaultValue=''
              >
                <MenuItem  value='Todas las categorías'>Todas las categorías</MenuItem>
                {categories && categories.map((categories: any) => (
                  <MenuItem value={categories.category_id}>{categories.category_name}</MenuItem>
                ))

                }
              </Select>

              <TextField
                className='mx-2'
                label="Fecha de inicio"
                variant='filled'
                color='info'
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={selectedStartDate ? selectedStartDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedStartDate(e.target.value ? new Date(e.target.value) : null)}
              />

              <TextField
                className='mx-2'
                label="Fecha de finalización"
                variant='filled'
                color='info'
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={selectedEndDate ? selectedEndDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedEndDate(e.target.value ? new Date(e.target.value): null)}
              />

              <Button className='mx-3' variant='outlined' color='success' onClick={fetchData}>Aplicar Filtros</Button>
            </Box>
            <div className='w-10/12 md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-opacity-95 bg-white'>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Box>
      </Box>
      
    </>
  );
};

export default BarChart;
