'use client'
import React, { useState, useEffect } from 'react';
import { Chart, ArcElement } from 'chart.js'; 
import { Pie } from 'react-chartjs-2';
import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import Header from '../Header/header';
import axios from 'axios';

Chart.register(ArcElement); // Register ArcElement

const PieChart = ({ categories } : any) => {
  const [chartData, setChartData] = useState<any>(null); 
  const [courseCount, setCourseCount] = useState<number | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

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
      setCourseCount(null); 
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const labels: string[] = categories.map((item: { category_name: any; }) => item.category_name);
      const dataValues: number[] = Array.isArray(courseCount) ? courseCount.map((item: { count: any; }) => item.count) : [];
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
    }
  }, [courseCount, categories]);

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
    data: categories,
    maintainAspectRatio: false,
    responsive: true,
  };
  return (
    <Box m="20px">
      <Header title="Gráfico de Pie" subtitle="Simple Gráfico de Pie" />
      <Box height="75vh">
        <Box margin={4}>
          <Select
            className='mx-2 w-max'
            variant='filled'
            color='info'
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value as string)}
            defaultValue='Todas las categorías'
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
        {chartData && chartData.labels.length > 0 && (
          <div className='w-10/12 md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-opacity-80 bg-white'>
            <Pie data={chartData}  options={chartOptions}/>
          </div>
        )}
      </Box>
    </Box>  
  );
};

export default PieChart;
