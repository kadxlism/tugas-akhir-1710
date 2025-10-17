import { FC } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type ProjectStats = {
  completed: number;
  active: number;
  ended: number;
};

const StatisticsChart: FC<{ stats: ProjectStats }> = ({ stats }) => {
  const data = {
    labels: ["Completed", "Active", "Ended"],
    datasets: [
      {
        data: [stats.completed, stats.active, stats.ended],
        backgroundColor: ["#10b981", "#3b82f6", "#ef4444"], // hijau, biru, merah
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h3 className="text-base text-black font-semibold mb-4">Statistics</h3>
      <div className="max-w-xs mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default StatisticsChart;
