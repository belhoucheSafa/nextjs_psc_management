import "./studentsFeesOptionsStatsChart.scss";
import ReactApexChart from "react-apexcharts";

import studentData from "../../data/FinanceDashboardData/studentsList.json";

const StudentsFeesOptionsStatsChart = () => {
  // Group the students by paymentOption
  const paymentOptionsCount = {
    1: 0,
    3: 0,
    8: 0,
  };

  studentData.forEach((student) => {
    const paymentOption = student.paymentOption;
    if (paymentOptionsCount[paymentOption] !== undefined) {
      paymentOptionsCount[paymentOption]++;
    }
  });

  // Extract the number of students per payment option
  const seriesData = [
    paymentOptionsCount[1],
    paymentOptionsCount[3],
    paymentOptionsCount[8],
  ];

  // Calculate total students
  const total = seriesData.reduce((acc, val) => acc + val, 0);

  // Calculate percentages for each tranche
  const series = seriesData.map((value) => ((value / total) * 100).toFixed(0));

  let state = {
    series: [
      {
        data: [
          { x: "1 Tranche", y: series[0], fillColor: "#9c42fecf" },
          { x: "3 Tranches", y: series[1], fillColor: "#EE8F1F" },
          { x: "8 Tranches", y: series[2], fillColor: "#04C3FB" },
        ],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 80,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 3,
          borderRadiusApplication: "end",
          horizontal: true,
          barHeight: "40%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["1 Tranche", "3 Tranches", "8 Tranches"],
        labels: {
          show: false, // Hide the x-axis labels
        },
        axisBorder: {
          show: false, // Hide the x-axis border
        },
        axisTicks: {
          show: false,
        },
      },
      labels: {
        style: {
          fontFamily: "Nunito, sans-serif",
          fontWeight: 800,
          fontSize: "10px",
        },
      },
      colors: ["#9C42FE", "#EE8F1F", "#04C3FB"],
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={120}
        className="students-fees-options"
      />
    </div>
  );
};

export default StudentsFeesOptionsStatsChart;
