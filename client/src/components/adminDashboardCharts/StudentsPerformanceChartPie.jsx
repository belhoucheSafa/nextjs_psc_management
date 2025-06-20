import "./studentsPerformanceChartPie.scss";
import ReactApexChart from "react-apexcharts";

const StudentsPerformanceChartPie = (
  {Average,
  BelowAverage,
  Good,
  Excellent}
) => {
  console.log(Average,
    BelowAverage,
    Good,
    Excellent)



  let state = {
    series: [   Excellent,Good , Average, BelowAverage],
    options: {
      chart: {
        type: "donut",
        width: 80,
      },
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: false, // Ensure donut labels are disabled
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#9c42fecf", "#68c5ff", "#fbbd17cc", "#e82646"],
      //   tooltip: {
      //     y: {
      //       formatter: function (val, { seriesIndex, w }) {
      //         const labels = ["Excellent", "Top", "Average", "Below Average"];
      //         const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
      //         const percentage = ((val / total) * 100).toFixed(1);
      //         return `${labels[seriesIndex]}: ${percentage}%`;
      //       },
      //     },
      //     custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      //       const labels = ["Excellent", "Top", "Average", "Below Average"];
      //       const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
      //       const value = series[seriesIndex];
      //       const percentage = ((value / total) * 100).toFixed(1);
      //       return `<div class="tooltip">
      //                 <span>${labels[seriesIndex]}: ${percentage}%</span>
      //               </div>`;
      //     },
      //   },
    },
  };

  return (
    <ReactApexChart
      className="students-performance-chart-pie"
      options={state.options}
      series={state.series}
      type="donut"
      width={180}
    />
  );
};

export default StudentsPerformanceChartPie;
