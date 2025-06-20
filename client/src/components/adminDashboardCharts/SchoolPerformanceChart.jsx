// import "./schoolPerformanceChart.scss";
// import ReactApexChart from "react-apexcharts";
// import { useState } from "react";
// // import { Switch } from "antd";
// import Switch from "@mui/material/Switch";

// const SchoolPerformanceChart = () => {
//   const getCategories = () => {
//     const months = [
//       "September",
//       "October",
//       "November",
//       "December",
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//     ];
//     const currentYear = new Date().getFullYear();
//     const categories = [];

//     months.forEach((month, index) => {
//       const year =
//         month === "January" ||
//         month === "February" ||
//         month === "March" ||
//         month === "April" ||
//         month === "May"
//           ? currentYear + 1
//           : currentYear;
//       const lastDay = new Date(
//         year,
//         new Date(`${month} 1, ${year}`).getMonth() + 1,
//         0
//       )
//         .toISOString()
//         .split("T")[0];
//       categories.push(lastDay);
//     });

//     return categories;
//   };
//   const [showTeachers, setShowTeachers] = useState(true);
//   const [showStudents, setShowStudents] = useState(true);
 
//   let state = {
//     series: [
//       {
//         name: "Teachers",
//         data: [31, 40, 28, 51, 42, 109, 100, 65, 85],
//         visible: showTeachers,
//       },
//       {
//         name: "Students",
//         data: [11, 32, 45, 32, 34, 52, 41, 120, 90],
//         visible: showStudents,
//       },
//     ].filter((series) => series.visible),
//     options: {
//       chart: {
//         height: 200,
//         type: "area",
//         toolbar: {
//           show: false,
//         },
//       },

//       dataLabels: {
//         enabled: false,
//       },
//       stroke: {
//         curve: "smooth",
//         width: [3, 3],
//       },
//       colors: ["#008FFB", "#EE8F1F"],
//       grid: {
//         borderColor: '#f4f4f4',
//         strokeDashArray: 6, 
//         row: {
//           colors: ['transparent', 'transparent'], 
//           opacity: 0.5
//         },
//         column: {
//           colors: ['transparent', 'transparent'], 
//           opacity: 0.5
//         },
//       },
//       xaxis: {
//         type: "datetime",
//         categories: getCategories(),
//         labels: {
//           style: {
//             fontFamily: "Nunito, sans-serif",
//             fontWeight: 800,
//             fontSize: "10px",
//           },
//         },

//         axisBorder: {
//           show: true,
//           color: '#f4f4f4', 
//           height: 1, 
//         },
//         axisTicks: {
//           show: true,
//           color: '#f4f4f4', 
//         },
       
//       },

//       yaxis: {
//         labels: {
//           style: {
//             fontFamily: "Nunito, sans-serif",
//             fontWeight: 800,
//             fontSize: "10px",
//           },
//         },
//         grid: {
//           borderColor: "#ffffff", 
//           strokeDashArray: 2, 
//         },
//       },
//       tooltip: {
//         x: {
//           format: "dd/MM/yy",
//         },
//       },
//       legend: {
//         show: false,
//       },
//     },
//   };

//   return (
//     <>
//       <div id="chart">
//         <div className="chart-legend-wrapper">
//           <div className="serie">
//             <div className="text students">Students</div>
//             <Switch
//               checked={showStudents}
//               onChange={() => setShowStudents(!showStudents)}
//               name="showStudents"
//               color="warning"
//               sx={{
//                 "& .MuiSwitch-thumb": {
//                   bgcolor: "#EE8F1F",
//                 },
//               }}
//               size="small"
//               defaultChecked
//             />
//           </div>

//           <div className="serie">
//             <div className="text teachers">Teachers</div>
//             <Switch
//               checked={showTeachers}
//               onChange={() => setShowTeachers(!showTeachers)}
//               name="showTeachers"
//               size="small"
//               defaultChecked
//               sx={{
//                 "& .MuiSwitch-thumb": {
//                   bgcolor: "#008FFB",
//                 },
//                 "& .MuiSwitch-track": {
//                   bgcolor: "#E0E0E0",
//                 },
//               }}

              
//             />
//           </div>
//         </div>
//         <ReactApexChart
//           className="school-performance-chart"
//           options={state.options}
//           series={state.series}
//           type="area"
//           height={200}
//         />
//       </div>
//     </>
//   );
// };

// export default SchoolPerformanceChart;


import "./schoolPerformanceChart.scss";
import ReactApexChart from "react-apexcharts";
import { useState } from "react";
import Switch from "@mui/material/Switch";

const SchoolPerformanceChart = () => {
  // Replace months with Meet1, Meet2, etc.
  const getCategories = () => {
    return ["Meet1", "Meet2", "Meet3", "Meet4", "Meet5", "Meet6", "Meet7", "Meet8", "Meet9"];
  };

  const [showTeachers, setShowTeachers] = useState(true);
  const [showStudents, setShowStudents] = useState(true);
 
  let state = {
    series: [
      {
        name: "Teachers",
        data: [31, 40, 28, 51, 42, 109, 100, 65, 85],
        visible: showTeachers,
      },
      {
        name: "Students",
        data: [11, 32, 45, 32, 34, 52, 41, 120, 90],
        visible: showStudents,
      },
    ].filter((series) => series.visible),
    options: {
      chart: {
        height: 200,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: [3, 3],
      },
      colors: ["#008FFB", "#EE8F1F"],
      grid: {
        borderColor: '#f4f4f4',
        strokeDashArray: 6, 
        row: {
          colors: ['transparent', 'transparent'], 
          opacity: 0.5
        },
        column: {
          colors: ['transparent', 'transparent'], 
          opacity: 0.5
        },
      },
      xaxis: {
        // Changed from datetime to category
        type: "category",
        categories: getCategories(),
        labels: {
          style: {
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: "10px",
          },
        },
        axisBorder: {
          show: true,
          color: '#f4f4f4', 
          height: 1, 
        },
        axisTicks: {
          show: true,
          color: '#f4f4f4', 
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: "10px",
          },
        },
        grid: {
          borderColor: "#ffffff", 
          strokeDashArray: 2, 
        },
      },
      // Remove the datetime tooltip format since we're using categories now
      tooltip: {
        enabled: true,
      },
      legend: {
        show: false,
      },
    },
  };

  return (
    <>
      <div id="chart">
        <div className="chart-legend-wrapper">
          <div className="serie">
            <div className="text students">Students</div>
            <Switch
              checked={showStudents}
              onChange={() => setShowStudents(!showStudents)}
              name="showStudents"
              color="warning"
              sx={{
                "& .MuiSwitch-thumb": {
                  bgcolor: "#EE8F1F",
                },
              }}
              size="small"
              defaultChecked
            />
          </div>

          <div className="serie">
            <div className="text teachers">Teachers</div>
            <Switch
              checked={showTeachers}
              onChange={() => setShowTeachers(!showTeachers)}
              name="showTeachers"
              size="small"
              defaultChecked
              sx={{
                "& .MuiSwitch-thumb": {
                  bgcolor: "#008FFB",
                },
                "& .MuiSwitch-track": {
                  bgcolor: "#E0E0E0",
                },
              }}
            />
          </div>
        </div>
        <ReactApexChart
          className="school-performance-chart"
          options={state.options}
          series={state.series}
          type="area"
          height={200}
        />
      </div>
    </>
  );
};

export default SchoolPerformanceChart;