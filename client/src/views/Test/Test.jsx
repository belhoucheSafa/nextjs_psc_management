import React from "react";
import GroupModulesAttendanceChart from "../../components/Charts/GroupModulesAttendanceChart";
import StudentsPerformanceChartPie from "../../components/adminDashboardCharts/StudentsPerformanceChartPie";
import "./test.scss";
import { Card, Col, Row } from "antd";
import StudentsFeesStatusChart from "../../components/adminDashboardCharts/StudentsFeesStatusChart";
import SchoolAttendance from "../../components/adminDashboardCharts/SchoolAttendance";
import ActivityHours from "../../components/teacherDashboardCharts/ActivityHours";
import TeacherAttendance from "../../components/teacherDashboardCharts/TeacherAttendance";
import StudentsPerformance from "../../components/teacherDashboardCharts/StudentsPerformance";
import ModulesStatus from "../../components/teacherDashboardCharts/ModulesStatus";
import FinanceDashboardChart from "../../components/financeDashboardCharts/FinanceDashboardChart";
import TranchesRepartitions from "../../components/financeDashboardCharts/TranchesRepartitions";
import FeesStatus from "../../components/financeDashboardCharts/FeesStatus";
import ModulesAttendanceChart from "../../components/studentDshboardCharts/ModulesAttendanceChart";
import SemesterGrades from "../../components/studentDshboardCharts/SemesterGrades";
import StudentModulesRates from "../../components/studentDshboardCharts/StudentModulesRates";
import TasksChart from "../../components/studentDshboardCharts/TasksChart";
const Test = () => {
  return <TasksChart />;
};

export default Test;
