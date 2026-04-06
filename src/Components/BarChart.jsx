import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Skeleton } from "primereact/skeleton";
import { commonLabel } from "../utils/label";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const BarChartDemo = ({ data, loading }) => {
  const items = data || [];

  const labels = items?.map((item) => item.user?.name || "Unknown");
  const values = items?.map((item) => parseFloat(item.total_price) || 0);

  const backgroundColors = [
    "rgba(59, 130, 246, 0.8)",
    "rgba(16, 185, 129, 0.8)",
    "rgba(245, 158, 11, 0.8)",
    "rgba(139, 92, 246, 0.8)",
    "rgba(244, 63, 94, 0.8)",
    "rgba(14, 165, 233, 0.8)",
    "rgba(232, 121, 249, 0.8)",
    "rgba(20, 184, 166, 0.8)",
  ];

  const borderColors = [
    "rgb(59, 130, 246)",
    "rgb(16, 185, 129)",
    "rgb(245, 158, 11)",
    "rgb(139, 92, 246)",
    "rgb(244, 63, 94)",
    "rgb(14, 165, 233)",
    "rgb(232, 121, 249)",
    "rgb(20, 184, 166)",
  ];

  const chartData = {
    labels: labels.length > 0 ? labels : ["No Data"],
    datasets: [
      {
        label: "Total Purchase Amount",
        data: values.length > 0 ? values : [0],
        backgroundColor: backgroundColors.slice(0, values.length),
        borderColor: borderColors.slice(0, values.length),
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 24,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        padding: 12,
        boxPadding: 8,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return ` ₹${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "#f8fafc",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (value) => `₹${value >= 1000 ? value / 1000 + "k" : value}`,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#334155",
          font: { size: 12, weight: "600" },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {commonLabel.topCustomer}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {commonLabel.byTotalPurchaseValue}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
          <i className="pi pi-users text-xl"></i>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex flex-col h-full justify-around py-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width="30%" height="10px" />
                  <Skeleton width="100%" height="20px" borderRadius="4px" />
                </div>
              ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="h-full w-full">
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <i className="pi pi-folder-open text-4xl mb-4 opacity-20"></i>
            <p className="text-sm font-medium">
              {commonLabel.noSalesDataFound}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChartDemo;
