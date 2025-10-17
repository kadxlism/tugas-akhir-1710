import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

type FactData = {
  month: string; // "Jan", "Feb", dll.
  values: { label: string; data: number[]; color: string }[];
};

const CompanyFactsChart: FC<{ data: FactData }> = ({ data }) => {
  const chartData = {
    labels: data.month.split(" "), // kalau kamu kirim "Jan Feb Mar Apr"
    datasets: data.values.map((v) => ({
      label: v.label,
      data: v.data,
      borderColor: v.color,
      backgroundColor: `${v.color}33`, // versi transparan
      fill: true,
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200,
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h3 className="text-base text-black font-semibold mb-4">Company Facts</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CompanyFactsChart;
