import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

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

  const chartRef = useRef(null); // Reference to the chart instance

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for the previous month
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const response = await fetch(`http://localhost:8080/statistics/${lastMonth.toISOString().slice(0, 7)}`);
        const data = await response.json();

        console.log('Fetched data:', data);

        const aggregatedData = aggregateData(data);
        setChartData(aggregatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const currentChartRef = chartRef.current;
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');

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
  }, [chartData]);

  return (
    <div>
      <div style={{ height: '67vh', width: '67vw' }}>
        <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}></canvas>
      </div>
    </div>
  );
};

export default BarChart;


