import "./adminDashboard.scss";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import STUDENTSICON from "../../assets/icons/studentIcon3.png";
import TEACHERSICON from "../../assets/icons/teacherIcon3.png";
import STAFFICON from "../../assets/icons/team1.png";
import MODULESICON from "../../assets/icons/studentIcon2.png";
import SPECIALITYICON from "../../assets/icons/rocketIcon1.png";
import CLASSESICON from "../../assets/icons/classIcon.png";
import GROUPSICON from "../../assets/icons/teacherIcon1.png";
import TOP1 from "../../assets/icons/top1.png";
import TOP2 from "../../assets/icons/top2.png";
import TOP3 from "../../assets/icons/top3.png";

import SchoolPerformanceChart from "../../components/adminDashboardCharts/SchoolPerformanceChart";

import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { GiDuration } from "react-icons/gi";
import { MdPublic } from "react-icons/md";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { LuCalendarClock } from "react-icons/lu";
import { LuCalendarCheck2 } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { IoShareSocial } from "react-icons/io5";
import { IoChatbubbles } from "react-icons/io5";
import { TbReport } from "react-icons/tb";
import { MdOpenInNew } from "react-icons/md";
import { TbArrowBadgeDownFilled } from "react-icons/tb";

import { Select } from "antd";
import StudentsPerformanceChartPie from "../../components/adminDashboardCharts/StudentsPerformanceChartPie";
import SchoolFinanceAnalyticsChart from "../../components/adminDashboardCharts/SchoolFinanceAnalyticsChart";
import StudentsFeesStatusChart from "../../components/adminDashboardCharts/StudentsFeesStatusChart";
import StudentsFeesOptionsStatsChart from "../../components/adminDashboardCharts/StudentsFeesOptionsStatsChart";
import SchoolAttendance from "../../components/adminDashboardCharts/SchoolAttendance";
import StudentsGovermentsRepartition from "../../components/adminDashboardCharts/StudentsGovermentsRepartition";

import DEPARTMENTSDATA from "../../data/AdminDashboardData/departmentsData.json";
import CLASSESDATA from "../../data/AdminDashboardData/classesData.json";
import SPECIALITIESDATA from "../../data/AdminDashboardData/specialitiesData.json";
import STAFFDATA from "../../data/AdminDashboardData/staffListData.json";
import GROUPSDATA from "../../data/AdminDashboardData/groupsData.json";
import MODULESDATA from "../../data/AdminDashboardData/groupModulesData.json";
import STUDENTSDATA from "../../data/AdminDashboardData/studentsListData.json";
import TEACHERSDATA from "../../data/AdminDashboardData/teachersListData.json";

import EVENTS from "../../data/AdminDashboardData/eventsData.json";
import moment from "moment";

const classifyYearResult = (yearResult) => {
  if (yearResult < 10) return "Below Avg";
  if (yearResult >= 10 && yearResult < 12) return "Average";
  if (yearResult >= 12 && yearResult < 16) return "Good";
  return "Excellent";
};

const calculateActiveStatusCounts = (records) => {
  return records.reduce(
    (acc, record) => {
      if (record.active) {
        acc.activeCount += 1; // Increment count for active
      } else {
        acc.inactiveCount += 1; // Increment count for inactive
      }
      return acc;
    },
    { activeCount: 0, inactiveCount: 0 }
  );
};

const AdminDashboard = () => {
  const totalStudents = STUDENTSDATA.length;
  const totalTeachers = TEACHERSDATA.length;
  const totalStaff = STAFFDATA.length;
  const totalModules = MODULESDATA.length;
  const totalDeps = DEPARTMENTSDATA.length;
  const totalSpe = SPECIALITIESDATA.length;
  const totalClasses = CLASSESDATA.length;
  const totalGroups = GROUPSDATA.length;

  const countsStatusStaff = calculateActiveStatusCounts(STAFFDATA);
  const countsStatusStudents = calculateActiveStatusCounts(STUDENTSDATA);
  const countsStatusTeachers = calculateActiveStatusCounts(TEACHERSDATA);
  const countsStatusModules = calculateActiveStatusCounts(MODULESDATA);

  // Get today's date
  const today = moment();

  const classLabelMapping = {
    "1LBI": "Biologie",
    "1INFO": "Informatique",
    "1EM": "Electromécanique",
    // Add other mappings as needed
  };

  // Function to determine event status (today, upcoming, overdue)
  const getEventStatusClass = (eventDate) => {
    const eventMoment = moment(eventDate, "DD/MM/YYYY");
    if (eventMoment.isSame(today, "day")) {
      return "today";
    } else if (eventMoment.isAfter(today, "day")) {
      return "upcoming";
    } else {
      return "overdue";
    }
  };

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [performanceCounts, setPerformanceCounts] = useState({
    Excellent: 0,
    Good: 0,
    Average: 0,
    "Below Avg": 0,
  });
  const [selectedClass, setSelectedClass] = useState("1LBI"); // Set default value
  const displayClass = classLabelMapping[selectedClass] || selectedClass;
  useEffect(() => {
    // Extract unique classLabels from students data and map them
    const uniqueClasses = [
      ...new Set(STUDENTSDATA.map((student) => student.classLabel)),
    ];

    const options = uniqueClasses.map((classLabel) => ({
      value: classLabel, // Keep original value for filtering
      label: classLabelMapping[classLabel] || classLabel, // Use mapped label for display
    }));

    setClassOptions(options);

    // Initialize performance counts for the default class
    updatePerformanceCounts("1LBI");
    // updateTopStudents();
  }, []);

  const updatePerformanceCounts = (classLabel) => {
    // Filter students based on the selected class
    const studentsInClass = STUDENTSDATA.filter(
      (student) => student.classLabel === classLabel
    );

    // Classify students based on their year results
    const classifiedStudents = studentsInClass.map((student) => ({
      ...student,
      classification: classifyYearResult(student.yearResult),
    }));

    setFilteredStudents(classifiedStudents);

    // Calculate performance counts
    const counts = {
      Excellent: 0,
      Good: 0,
      Average: 0,
      "Below Avg": 0,
    };

    classifiedStudents.forEach((student) => {
      counts[student.classification]++;
    });

    setPerformanceCounts(counts);
  };

  const handleChangeClass = (value) => {
    console.log(`selected ${value}`);
    setSelectedClass(value); // Update the selected class
    updatePerformanceCounts(value); // Update performance counts
  };

  // const [topStudents, setTopStudents] = useState([]);
  // Replace your topStudents state and update function with this static data
  const [topStudents, setTopStudents] = useState([
    {
      StudentId: "OurRoots",
      classLabel: "Team 23",
      yearResult: 19.50,
      // Add any other required properties
    },
    {
      StudentId: "WeCare",
      classLabel: "Team 10",
      yearResult: 18.5,
      // Add any other required properties
    },
    {
      StudentId: "GrowTogether",
      classLabel: "Team 07",
      yearResult: 18.3,
      // Add any other required properties
    },
  ]);

  // You can remove the updateTopStudents function since we're using static data
  // Also remove any calls to updateTopStudents in your useEffect
  // const updateTopStudents = () => {
  //   // Sort students by yearResult in descending order and get the top 3
  //   const topThree = [...STUDENTSDATA]
  //     .sort((a, b) => b.yearResult - a.yearResult)
  //     .slice(0, 3);
  //   setTopStudents(topThree);
  // };

  return (
    <div className="adminDashboard-wrapper">
      <div className="adminDashboard-section adminDashboard-section-1">
        <div className="adminDashboard-section-1-left">
          <div className="widgets-section">
            <div className="widget-card card-students">
              <div className="widget-card-top">
                <div className="widget-left">
                  <img src={STUDENTSICON} alt="" />
                </div>
                <div className="widget-center">
                  <div className="widget-center-top">{totalStudents}</div>
                  <div className="widget-center-bottom">Total Students</div>
                </div>
                <div className="widget-right">
                  <div className="static-widget">
                    <span> 1.5</span>
                    <FaArrowTrendUp className="stat-arrow-icon-down" />
                  </div>
                </div>
              </div>
              <div className="widget-divider"></div>
              <div className="widget-card-bottom">
                <div className="badge active-badge">
                  In Teams : <span>{countsStatusStudents.activeCount}</span>
                </div>
                <div className="badge inactive-badge">
                  No Team : <span>{countsStatusStudents.inactiveCount}</span>
                </div>
              </div>
            </div>
            <div className="widget-card card-teachers">
              <div className="widget-card-top">
                <div className="widget-left">
                  <img src={TEACHERSICON} alt="" />
                </div>
                <div className="widget-center">
                  <div className="widget-center-top">{25}</div>
                  <div className="widget-center-bottom">Total Mentors</div>
                </div>
                <div className="widget-right">
                  <div className="static-widget">
                    <span> 1.3</span>
                    <FaArrowTrendUp className="stat-arrow-icon-down" />
                  </div>{" "}
                </div>
              </div>
              <div className="widget-divider"></div>
              <div className="widget-card-bottom">
                <div className="badge active-badge">
                  Active : <span>{21}</span>
                </div>
                <div className="badge inactive-badge">
                  Inactive : <span>{4}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="widgets-section">
            <div className="widget-card card-modules">
              <div className="widget-card-top">
                <div className="widget-left">
                  <img src={MODULESICON} alt="" />
                </div>
                <div className="widget-center">
                  <div className="widget-center-top">{4}</div>
                  <div className="widget-center-bottom">Total Themes</div>
                </div>
                <div className="widget-right">
                  {/* <div className="static-widget">
                    <span> 1.5</span>
                    <FaArrowTrendDown className="stat-arrow-icon-down" />
                  </div>{" "} */}
                </div>
              </div>
              <div className="widget-divider"></div>
              <div className="widget-card-bottom">
                <div className="badge active-badge">
                  Active : <span>{countsStatusModules.activeCount}</span>
                </div>
                <div className="badge inactive-badge">
                  Inactive : <span>{countsStatusModules.inactiveCount}</span>
                </div>
              </div>
            </div>
            <div className="widget-card card-staff">
              <div className="widget-card-top">
                <div className="widget-left">
                  <img src={STAFFICON} alt="" />
                </div>
                <div className="widget-center">
                  <div className="widget-center-top">{20}</div>
                  <div className="widget-center-bottom">Total Teams</div>
                </div>
                <div className="widget-right">
                  <div className="static-widget">
                    <span> 1.1</span>
                    <FaArrowTrendDown className="stat-arrow-icon-down" />
                  </div>{" "}
                </div>
              </div>
              <div className="widget-divider"></div>
              <div className="widget-card-bottom">
                <div className="badge active-badge">
                  Active : <span>{20}</span>
                </div>
                <div className="badge inactive-badge">
                  Inactive : <span>{0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="adminDashboard-section adminDashboard-section-3">
        <div className="adminDashboard-section-2-right-quick-links">
          <div className="title">Quick Links</div>
          <div className="quick-links-warpper">
            <div className="quick-links-section">
              <div className="quick-link-item quick-1">
                <div className="quick-link-top-wrapper">
                  <div className="quick-link-top">
                    <LuCalendarClock className="icon" />
                  </div>
                </div>
                <div className="quick-link-bottom">Calendar</div>
              </div>

              <div className="quick-link-item quick-2">
                <div className="quick-link-top-wrapper">
                  <div className="quick-link-top">
                    <LuCalendarCheck2 className="icon" />
                  </div>
                </div>
                <div className="quick-link-bottom">Calendar</div>
              </div>
            </div>
            <div className="quick-links-section">
              <div className="quick-link-item quick-3">
                <div className="quick-link-top-wrapper">
                  <div className="quick-link-top">
                    <GrMoney className="icon" />
                  </div>
                </div>
                <div className="quick-link-bottom">Calendar</div>
              </div>
              <div className="quick-link-item quick-4">
                <div className="quick-link-top-wrapper">
                  <div className="quick-link-top">
                    <TbReport className="icon" />
                  </div>
                </div>
                <div className="quick-link-bottom">Calendar</div>
              </div>
            </div>
            <div className="quick-links-section">
              <div className="quick-link-item quick-5">
                <div className="quick-link-top-wrapper">
                  <div className="quick-link-top">
                    <IoShareSocial className="icon" />
                  </div>
                </div>
                <div className="quick-link-bottom">Calendar</div>
              </div>
              <div className="quick-link-item quick-6">
                <div className="quick-link-top-wrapper">
                  <div className="quick-link-top">
                    <IoChatbubbles className="icon" />
                  </div>
                </div>
                <div className="quick-link-bottom">Calendar</div>
              </div>
            </div>
          </div>
        </div>

        <div className="adminDashboard-section-3-center">
          <div className="title">Top PSC2K24 </div>
          <div className="star-students-wrapper">
            {topStudents.map((student, index) => (
              <div className="star-student-item" key={student.StudentId}>
                <div className="top">
                  <img
                    src={index === 0 ? TOP1 : index === 1 ? TOP2 : TOP3}
                    alt=""
                    className={
                      index === 0
                        ? "first-place"
                        : index === 1
                        ? "second-place"
                        : "third-place"
                    }
                  />
                  <div className="badge-star">{index + 1} Place</div>
                </div>
                <div className="bottom">
                  <div className="student">{student.StudentId}</div>
                  <div className="group-result-wrapper">
                    <div className="group">{student.classLabel}</div>
                    <div className="year-result">{student.yearResult}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="adminDashboard-section-3-right">
          <div className="students-performance-top">
            <div className="title">Students Performance</div>
            <div className="select-class">
              {/* <Select
                defaultValue={selectedClass} // Set the default value
                style={{
                  width: 100,
                  height: 25,
                }}
                className="classes-performance-select"
                onChange={handleChangeClass}
                options={
                  ({ value: "1LBI", label: "Biologie" },
                  { value: "1INFO", label: "Informatique" },
                  { value: "1EM", label: "Electromécanique" })
                }
              /> */}
            </div>
          </div>
          <div className="students-performance-center">
            <div className="left">
              <div className="student-performance-item-wrapper excellent">
                <TbArrowBadgeDownFilled className="icon" />

                <div className="text">Excellent</div>
                <div className="number">{performanceCounts.Excellent}</div>
              </div>
              <div className="student-performance-item-wrapper top">
                <TbArrowBadgeDownFilled className="icon" />

                <div className="text">Good</div>
                <div className="number">{performanceCounts.Good}</div>
              </div>

              <div className="student-performance-item-wrapper avg">
                <TbArrowBadgeDownFilled className="icon" />

                <div className="text">Average</div>
                <div className="number">{performanceCounts.Average}</div>
              </div>

              <div className="student-performance-item-wrapper below-avg">
                <TbArrowBadgeDownFilled className="icon" />

                <div className="text">Below Avg</div>
                <div className="number">{performanceCounts["Below Avg"]}</div>
              </div>
            </div>
            <div className="right">
              <StudentsPerformanceChartPie
                Average={performanceCounts.Average}
                BelowAverage={performanceCounts["Below Avg"]}
                Good={performanceCounts.Good}
                Excellent={performanceCounts.Excellent}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="adminDashboard-section adminDashboard-section-2">
        <div className="adminDashboard-section-2-left">
          <div className="chart-title">
            <div className="text">PSC Meetings Performance</div>
          </div>

          <div className="chart">
            <SchoolPerformanceChart />
          </div>
        </div>

        <div className="adminDashboard-section-2-right">
          <div className="adminDashboard-section-3-left">
            <div className="widget-item widget-deps">
              <div className="widget-card-top">
                <div className="widget-left">
                  <img src={STUDENTSICON} alt="" />
                </div>
                <div className="widget-center">
                  <div className="widget-center-top">{totalDeps}</div>
                  <div className="widget-center-bottom">Total Departments</div>
                </div>
                <div className="widget-right">
                  <div className="static-widget">
                    <MdOpenInNew className="expand-arrow" />
                  </div>
                </div>
              </div>
            </div>

            <div className="widget-item widget-spec">
              <div className="widget-card-top">
                <div className="widget-left">
                  <img src={SPECIALITYICON} alt="" />
                </div>
                <div className="widget-center">
                  <div className="widget-center-top">{totalSpe}</div>
                  <div className="widget-center-bottom">Total Specialities</div>
                </div>
                <div className="widget-right">
                  <div className="static-widget">
                    <MdOpenInNew className="expand-arrow" />
                  </div>
                </div>
              </div>
            </div>

            <div className="widget-item widget-class">
              <div className="widget-card-top">
                <div className="widget-left">
                  <img src={CLASSESICON} alt="" />
                </div>
                <div className="widget-center">
                  <div className="widget-center-top">{totalClasses}</div>
                  <div className="widget-center-bottom">Total Classes</div>
                </div>
                <div className="widget-right">
                  <div className="static-widget">
                    <MdOpenInNew className="expand-arrow" />
                  </div>
                </div>
              </div>
            </div>
            <div className="widget-item widget-grps">
              <div className="widget-card-top">
                <div className="widget-left">
                  <img src={GROUPSICON} alt="" />
                </div>
                <div className="widget-center">
                  <div className="widget-center-top">{totalGroups}</div>
                  <div className="widget-center-bottom">Total Groups</div>
                </div>
                <div className="widget-right">
                  <div className="static-widget">
                    <MdOpenInNew className="expand-arrow" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="adminDashboard-section-2-right-events">
            <div className="title">Events</div>
            <div className="events-items-wrapper">
              {EVENTS.map((event) => (
                <div
                  key={event.EventId}
                  className={`event-item ${getEventStatusClass(event.date)}`}
                >
                  <div className="event-item-left">
                    <div className="date">
                      <div className="number">
                        {moment(event.date, "DD/MM/YYYY").format("DD")}
                      </div>
                      <div className="day">
                        {moment(event.date, "DD/MM/YYYY").format("ddd")}
                      </div>
                    </div>
                    <div className="circular-badge-wrapper">
                      <div className="circular-badge"></div>
                    </div>
                  </div>
                  <div className="event-item-right">
                    <div className="event-title">{event.eventLabel}</div>
                    <div className="event-details-wrapper">
                      <div className={`event-type ${event.accessStatus}`}>
                        {event.accessStatus === "public" ? (
                          <MdPublic className="icon" />
                        ) : (
                          <IoPeopleCircleOutline className="icon" />
                        )}
                        {event.accessStatus.charAt(0).toUpperCase() +
                          event.accessStatus.slice(1)}
                      </div>
                      <div className="event-duration">
                        <GiDuration className="icon" />
                        <div className="text">{event.duration}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/events" className="add-event-btn">
              <FaRegCalendarPlus />
              <div className="btn-text"> New Event</div>
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="adminDashboard-section adminDashboard-section-4">
        <div className="adminDashboard-section-4-left">
          <div className="title">School Finance Analytics</div>
          <div className="finance-chart-wrapper">
            <SchoolFinanceAnalyticsChart />
          </div>
        </div>
        <div className="adminDashboard-section-4-right">
          <div className="title">Students Fees Status</div>
          <div className="students-fees-chart-wrapper">
            <div className="top">
              <StudentsFeesStatusChart />
            </div>
            <div className="bottom">
              <StudentsFeesOptionsStatsChart />
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="adminDashboard-section adminDashboard-section-5">
        <div className="left">
          <div className="title">School Attendance</div>
          <div className="attendance-chart">
            <SchoolAttendance />
          </div>
        </div>
        <div className="right">
          <div className="title">Students Goverments Repartition</div>
          <div className="goverments-repartition">
            <StudentsGovermentsRepartition />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AdminDashboard;
