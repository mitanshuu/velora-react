import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { Skeleton } from "primereact/skeleton";
import { commonLabel } from "../utils/label";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PieChartDemo = ({ data, loading }) => {
  let labels = [];
  let values = [];

  if (data) {
    if (Array.isArray(data)) {
      labels = data.map(
        (item) => item.label || item.category_name || item.status || "Unknown",
      );
      values = data.map((item) => (item.value !== null ? item.value : 0));
    } else if (typeof data === "object") {
      labels = Object.keys(data);
      values = Object.values(data);
    }
  }

  const chartData = {
    labels: labels.length > 0 ? labels : ["No Data"],
    datasets: [
      {
        label: "Orders",
        data: values.length > 0 ? values : [0],
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(139, 92, 246, 0.6)",
          "rgba(244, 63, 94, 0.6)",
          "rgba(14, 165, 233, 0.6)",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: "500",
          },
          color: "#64748b",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1e293b",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return ` ${context.raw} items`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">
          {commonLabel.productDistribution}
        </h3>
        <i className="pi pi-chart-pie text-gray-400"></i>
      </div>

      <div className="flex-1 relative min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Skeleton shape="circle" size="12rem" />
            <div className="flex space-x-2">
              <Skeleton width="4rem" height="1rem" />
              <Skeleton width="4rem" height="1rem" />
              <Skeleton width="4rem" height="1rem" />
            </div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="h-full w-full p-2">
            <PolarArea data={chartData} options={options} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <i className="pi pi-database text-2xl opacity-20"></i>
            </div>
            <p className="font-medium text-sm">
              {commonLabel.noDistributionDataAvailable}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChartDemo;
