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
import { Box, MenuItem, Select } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryData {
  category_name: string;
  count: number;
}

interface DateRange {
  label: string;
  startDate: Date;
  endDate: Date;
}

const dateRanges: DateRange[] = [
  { label: 'Última semana', startDate: new Date()/* calcular la fecha de inicio */, endDate: new Date() },
  { label: 'Último mes', startDate: new Date()/* calcular la fecha de inicio */, endDate: new Date() },
  // Agrega más rangos de fechas según tus necesidades
];

const BarChart = ({ categoryDistribution }: { categoryDistribution: CategoryData[] }) => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string }[];
  }>({
    labels: [],
    datasets: [],
  });
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateRange | null>(null);

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const labels: string[] = categoryDistribution.map(item => item.category_name);
    const data: number[] = categoryDistribution.map(item => item.count);

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
  }, [categoryDistribution]);


  return (
    <>
      <Box m="20px">
        <Header title="Gráfico de barras" subtitle="Simple Gráfico de barras" />
         {/* <Select value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value as string)}>
          <MenuItem value="">Todas las categorías</MenuItem>
          <MenuItem value="categoria1">Categoría 1</MenuItem>
          <MenuItem value="categoria2">Categoría 2</MenuItem>
        </Select>

        <Select
          value={selectedDateFilter ? selectedDateFilter.label : ''}
          onChange={(e) => {
            const selectedLabel = e.target.value as string;
            const selectedRange = dateRanges.find(range => range.label === selectedLabel);
            setSelectedDateFilter(selectedRange || null);
          }}
        >
          <MenuItem value="">Todas las fechas</MenuItem>
          {dateRanges.map(range => (
            <MenuItem key={range.label} value={range.label}>{range.label}</MenuItem>
          ))}
        </Select> */}
        <Box height="75vh">
        <div className='w-10/12 md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-opacity-95 bg-white'>
          <Bar data={chartData} options={chartOptions} />
        </div>
        </Box>
      </Box>
      
    </>
  );
};

export default BarChart;
