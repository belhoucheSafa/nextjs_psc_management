


import "./schoolAttendance.scss";
import ReactApexChart from "react-apexcharts";
import { useState  , useEffect} from "react";
import { Switch } from "antd";

import studentsAttendance from '../../data/AdminDashboardData/studentsAttendanceData.json'

const generateData = (days, range) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    data.push(
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    );
  }
  return data;
};

const SchoolAttendance = () => {

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const aggregatedData = {};
    
    // Aggregate attendance data by month
    studentsAttendance.forEach(({ sessionDate, presentStudents, absentStudents }) => {
      const date = new Date(sessionDate);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Format: MM-YYYY

      if (!aggregatedData[monthYear]) {
        aggregatedData[monthYear] = {
          month: monthYear,
          present: 0,
          absent: 0,
        };
      }
      aggregatedData[monthYear].present += presentStudents;
      aggregatedData[monthYear].absent += absentStudents;
    });

    // Convert aggregated data to an array and set it to state
    const monthlyDataArray = Object.values(aggregatedData);
    setMonthlyData(monthlyDataArray);
  }, []);

  console.log('🔥', monthlyData);



  const studentsData = [
    { name: "Jan", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Feb", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Mar", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Apr", data: generateData(31, { min: 0, max: 100 }) },
    { name: "May", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Jun", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Jul", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Aug", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Sep", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Oct", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Nov", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Dec", data: generateData(31, { min: 0, max: 100 }) },
  ];

  const teachersData = [
    { name: "Jan", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Feb", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Mar", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Apr", data: generateData(31, { min: 0, max: 100 }) },
    { name: "May", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Jun", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Jul", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Aug", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Sep", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Oct", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Nov", data: generateData(31, { min: 0, max: 100 }) },
    { name: "Dec", data: generateData(31, { min: 0, max: 100 }) },
  ];

  const [data, setData] = useState(studentsData);
  const [isStudents, setIsStudents] = useState(true);
  const [showStudents, setShowStudents] = useState(true);

  const handleToggle = () => {
    setShowStudents(!showStudents);
  };
  
  const toggleData = (checked) => {
    setShowStudents(!showStudents);
    setIsStudents(checked);
    setData(checked ? studentsData : teachersData);
  };

  const options = {
    chart: {
      height: 200,
      type: "heatmap",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.45,
        radius: 5,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            { from: 0, to: 50, name: "low", color: "#FF6961" }, // Low color
            { from: 51, to: 100, name: "high", color: "#95E095" }, // High color
          ],
          gradientToColors: [],
        },
        stroke: {
          colors: "#fff",
          width: 1,
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "none", 
        },
      },
    },
    grid: {
      borderColor: "#fff",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: ["#f3f4f5", "#fff"],
        opacity: 0.45,
      },
    },
    xaxis: {
      labels: {
        style: {
          fontFamily: "Nunito, sans-serif",
          fontWeight: 800,
          fontSize: "10px",
        },
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
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 1 },
    legend: {
      show: false,
    },
  };

  return (
    <div>
      <Switch
        checkedChildren="Students"
        unCheckedChildren="Teachers"
        checked={isStudents}
        onChange={toggleData}
        className="switch-students-teachers"
        style={{
          marginLeft: 8,
          backgroundColor: showStudents ? '#008FFB' : '#EE8F1F',
          fontWeight: 800,
        }}
      />
      <div className="legend-wrapper">
        <div className="legend-item">
          <div className="icon low" style={{ backgroundColor: "#FF6961" }}></div>
          <div className="text">Low</div>
        </div>
        <div className="legend-item">
          <div className="icon high" style={{ backgroundColor: "#95E095" }}></div>
          <div className="text">High</div>
        </div>
      </div>
      <ReactApexChart
        className="attendance-chart-wrapper"
        options={options}
        series={data}
        type="heatmap"
        height={250}
        width={520}
      />
    </div>
  );
};

export default SchoolAttendance;
