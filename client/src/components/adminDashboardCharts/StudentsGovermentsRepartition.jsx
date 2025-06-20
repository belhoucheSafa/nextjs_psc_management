import "./studentsGovermentsRepartition.scss";
import ReactApexChart from "react-apexcharts";

import studentsData from "../../data/AdminDashboardData/studentsListData.json";

const StudentsGovermentsRepartition = () => {

  // Aggregate student counts per town
  const townCounts = studentsData.reduce((acc, student) => {
    acc[student.town] = (acc[student.town] || 0) + 1;
    return acc;
  }, {});

  // Convert town counts to the required format for the chart
  const seriesData = Object.entries(townCounts).map(([town, count]) => ({
    x: town, 
    y: count,
  }));



  const state = {
    series: [
      {
        data: seriesData,
      },
    ],
    options: {
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: "treemap",
        toolbar: {
          show: false,
        },
      },
      colors: [
        "#ffd949", // pastel yellow
        "#FFB347", // pastel orange
        "#77DD77", // pastel green
        "#68c5ff", // pastel light grey
        "#FF6961", // pastel red
        "#FFE892", // pastel light yellow
        "#FFB347", // pastel light orange
        "#AEC6CF", // pastel blue
        "#AB61FE", // pastel purple
        "#FFB3DE", // pastel pink
        "#77DD77", // pastel light green
        "#CFCFC4", // pastel light grey
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
      states: {
        hover: {
          filter: {
            type: 'none', // Disables the highlight effect on hover
          },
        },
      },
    },
  };

  return (
    <div id="chart"> 
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="treemap"
        height={240}
        className='goverments-repartition-wrapper'
      />
    </div>
  );
};

export default StudentsGovermentsRepartition;
