import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VisitorGraph = ({ visitorData }) => {
  const chartData = {
    labels: visitorData.map(item => item.date),
    datasets: [
      {
        label: 'Daily Visitors',
        data: visitorData.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(255, 255, 255)',
        },
      },
      title: {
        display: true,
        text: 'Last 7 Days Visitor Statistics',
        color: 'rgb(255, 255, 255)',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Visitors',
          color: 'rgb(255, 255, 255)',
        },
        ticks: {
          color: 'rgb(255, 255, 255)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: 'rgb(255, 255, 255)',
        },
        ticks: {
          color: 'rgb(255, 255, 255)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'rgb(31, 41, 55)',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default VisitorGraph; 