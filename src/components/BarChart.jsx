import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const aggregateData = (data) => {
  return data.reduce((result, current) => {
    const existingEntry = result.find((entry) => entry.purchasedate === current.purchasedate);

    if (existingEntry) {
      existingEntry.price += parseFloat(current.price);
      return result;
    }

    result.push({ ...current, price: parseFloat(current.price) });
    return result;
  }, []);
};

const BarChart = () => {
  const [chartData, setChartData] = useState([]);

  let today = new Date(Date.now());

  let lastMonth = today.getFullYear() + '-' + today.getMonth();

  const [monthOffset, setMonthOffset] = useState(lastMonth);

  const chartRef = useRef(null); // Reference to the chart instance

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/statistics/${monthOffset}`);
        const data = await response.json();

        console.log('Fetched data:', data);

        const aggregatedData = aggregateData(data);
        setChartData(aggregatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [monthOffset]);

  const handleMonthChange = (offset) => {
    const currentMonth = new Date(monthOffset + '-01');
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setMonthOffset(
      `${newMonth.getFullYear()}-${(newMonth.getMonth() + 1).toString().padStart(2, '0')}`
    );
  };

  useEffect(() => {
    const currentChartRef = chartRef.current;
    // Check if the chartRef is initialized
    if (chartRef.current && chartRef.current.chartInstance) {
      // Destroy the existing chart instance
      chartRef.current.chartInstance.destroy();
    }

    const chartLabels = chartData.map((entry) => entry.purchasedate);
    const chartValues = chartData.map((entry) => entry.price);

    const chartDataConfig = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Value',
          data: chartValues,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Purchase Date',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value',
          },
        },
      },
    };

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: chartDataConfig,
      options: chartOptions,
    });

    chartRef.current.chartInstance = newChart;

    return () => {
        if (currentChartRef && currentChartRef.chartInstance) {
          currentChartRef.chartInstance.destroy();
        }
      };
    }, [chartData, monthOffset]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem' }}>
        <IconButton onClick={() => handleMonthChange(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <span>{monthOffset}</span>
        <IconButton onClick={() => handleMonthChange(1)}>
          <ArrowForwardIcon />
        </IconButton>
      </div>

      <div style={{ height: '400px' }}>
        {/* Replace ResponsiveBar with canvas */}
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BarChart;

