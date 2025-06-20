import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import "./studentsFeesStatusChart.scss";
import studentData from "../../data/FinanceDashboardData/studentsList.json";





const StudentsFeesStatusChart = () => {




  const totalFees = studentData.reduce(
    (acc, student) => acc + student.totalYearFees,
    0
  );
  const totalPaid = studentData.reduce(
    (acc, student) => acc + student.PaidAmount,
    0
  );
  const paidPercentage = (totalPaid / totalFees) * 100;
  const unpaidPercentage = 100 - paidPercentage;

  const data = [
    { name: "Paid", value: paidPercentage },
    { name: "Unpaid", value: unpaidPercentage },
  ];
  const COLORS = ["#85DB86", "#FF444D"];



  return (
    <>
      <div className="customized-legend-container">
        <div className="legend-item paid">
          <div className="left paid"></div>
          <div className="right paid">Paid</div>
        </div>
        <div className="legend-item unpaid">
          <div className="left unpaid"></div>
          <div className="right unpaid">Unpaid</div>
        </div>
      </div>
      <PieChart
        width={250}
        height={150}
        style={{ position: "absolute", width: "320px" }}
        className="fees-status-pie-wrapper"
      >
        <Pie
          data={data}
          cx={140}
          cy={90}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </>
  );
};

export default StudentsFeesStatusChart;
