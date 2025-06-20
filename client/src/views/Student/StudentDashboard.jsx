import React, { useState, useEffect } from "react";
import "./studentDashboard.scss";

import { IoOpenOutline } from "react-icons/io5";
import { MdOpenInNew } from "react-icons/md";
import { CgArrowsExpandUpRight } from "react-icons/cg";
import { FaRegHandPointRight } from "react-icons/fa";
import { FaUpRightFromSquare } from "react-icons/fa6";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { LuClockAlert } from "react-icons/lu";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { TbProgressCheck } from "react-icons/tb";
import { CgCloseO } from "react-icons/cg";
import { LuCircleChevronRight } from "react-icons/lu";
import {
  FaRegClock,
  FaEdit,
  FaPaperPlane,
  FaExclamation,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

import POSTERICON from "../../assets/icons/posterIcon.png";
import ARTICLEICON from "../../assets/icons/articleIcon2.png";
import VIDEOICON from "../../assets/icons/videoIcon3.png";
import BG1 from "../../assets/images/bg1.png";
import EnvIcon from "../../assets/icons/env1.png";
import HealthIcon from "../../assets/icons/health1.png";
import EdIcon from "../../assets/icons/ed1.png";
import SportIcon from "../../assets/icons/sportCult1.png";
import TEAMMEMBERSICON from "../../assets/icons/teamMembersIcon.png";
import EVENTSICON from "../../assets/icons/eventIcon.png";
import TEAMMEETICON from "../../assets/icons/teammeetIcon1.png";

import axios from "axios";

const deliverables = [
  {
    id: 1,
    name: "Project Poster",
    type: "Word (.docx) - PDF - A4 Size",
    posterIcon: POSTERICON,
    iconStyle: { width: "28px" },
    submissionStatus: "SUBMITTED",
    tutorDecision: "APPROVED",
    adminDecision: "ADMIN_APPROVED",
    deadlineDays: 5,
  },
  {
    id: 2,
    name: "Project Article",
    type: "Word (.docx)",
    posterIcon: ARTICLEICON,
    iconStyle: { width: "26px" },
    submissionStatus: "OVERDUE",
    tutorDecision: "REJECTED",
    adminDecision: "ADMIN_REJECTED",
    deadlineDays: 8,
  },
  {
    id: 3,
    name: "Video Report",
    type: "Media File - MP4",
    posterIcon: VIDEOICON,
    iconStyle: { width: "22px" },
    submissionStatus: "OVERDUE",
    tutorDecision: "PENDING",
    adminDecision: "ADMIN_REJECTED",
    deadlineDays: 3,
  },
];

// Submission Statuses
const submissionStatuses = {
  UNSUBMITTED: {
    label: "Unsubmittedd",
    icon: LuClockAlert,
    color: "#ffe6e6",
    text: "#fe545c",
    iconStyle: { fontSize: "12px" },
  },

  SUBMITTED: {
    label: "Submitted",
    icon: IoCheckmarkCircleOutline,
    color: "#ecf8e3",
    text: "#a1d65c",
    iconStyle: { fontSize: "14px" },
  },
  OVERDUE: {
    label: "Overdue",
    icon: LuClockAlert,
    color: "#ffe6e6",
    text: "#fe545c",
    iconStyle: { fontSize: "12px" },
  },
};

// Tutor Decision
const tutorDecisions = {
  PENDING: {
    label: "Pending",
    icon: TbProgressCheck,
    color: "#fcf5da",
    text: "#e6ca34",
    iconStyle: { fontSize: "15px" },
  },
  APPROVED: {
    label: "Approved",
    icon: IoCheckmarkDoneCircleOutline,
    color: "#ecf8e3",
    text: "#a1d65c",
    iconStyle: { fontSize: "14px" },
  },

  REJECTED: {
    label: "Rejected",
    icon: CgCloseO,
    color: "#ffe6e6",
    text: "#fe545c",
    iconStyle: { fontSize: "12px" },
  },
};

// Admin Decision
const adminDecisions = {
  ADMIN_PENDING: {
    label: "Pending",
    icon: TbProgressCheck,
    color: "#fcf5da",
    text: "#e6ca34",
    iconStyle: { fontSize: "15px" },
  },
  ADMIN_APPROVED: {
    label: "Approved",
    icon: IoCheckmarkDoneCircleOutline,
    color: "#ecf8e3",
    text: "#a1d65c",
    iconStyle: { fontSize: "14px" },
  },
  ADMIN_REJECTED: {
    label: "Rejected",
    icon: CgCloseO,
    color: "#ffe6e6",
    text: "#fe545c",
    iconStyle: { fontSize: "12px" },
  },
};

const StudentDashboard = () => {
  // ✅ Extract user and token from localStorage
  const authToken = localStorage.getItem("authToken");
  const teamData = JSON.parse(localStorage.getItem("userData"));

  const [reports, setReports] = useState([]);
  // console.log("🔥 : ", authToken, teamData);

  function StatusTag({ status, statusMap, greyedOut }) {
    const config = statusMap[status] || {};

    const backgroundColor = greyedOut ? "#f4f4f4" : config.color;
    const textColor = greyedOut ? "#999" : config.text;

    return (
      <div
        className="table-report-tag"
        style={{
          backgroundColor,
          color: textColor,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "6px 10px",
          borderRadius: "10px",
        }}
      >
        {config.icon && (
          <config.icon
            style={greyedOut ? { color: "#ccc" } : config.iconStyle}
          />
        )}
        {config.label}
      </div>
    );
  }

  const team = {
    name: teamData.name,
    theme: teamData.theme,
  };

  // Theme color and icon mapping in English
  const themeData = {
    Education: {
      color: "#89c9ff",
      icon: EdIcon,
    },
    Environment: {
      color: "#afe5a6",
      icon: EnvIcon,
    },
    Health: {
      color: "#f4a850",
      icon: HealthIcon,
    },
    "Culture and Sports": {
      color: "#b990f5",
      icon: SportIcon,
    },
  };

  // Extract theme info
  const currentTheme = themeData[team.theme];

  const imageClass = `card-img theme-img-${team.theme
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  const TimelineItem = ({ title, description }) => (
    <div className="timeline-item-wrapper">
      <div className="left-side">
        <div className="circle-1">
          <div className="circle-2"></div>
        </div>
        <div className="line"></div>
      </div>
      <div className="right-side">
        <div className="main-title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </div>
  );

  const TimelineBetweenItem = ({ title, description }) => (
    <div className="timeline-between-item-wrapper">
      <div className="left-side">
        <div className="circle-1">
          <div className="circle-2"></div>
        </div>
        <div className="line"></div>
      </div>
      <div className="right-side">
        <div className="main-title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </div>
  );

  const fetchTeamReports = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (!authToken || !userData) {
        console.warn("Missing auth token or user data in localStorage.");
        return;
      }

      const team = JSON.parse(userData);

      const res = await axios.get(`/reports/team/${team._id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("RES : ", res.data.data.reports);
      setReports(res.data.data.reports);
    } catch (error) {
      console.error("❌ Failed to fetch team reports:", error);
      setReports([]); // Clear reports to avoid showing stale data
    }
  };

  useEffect(() => {
    fetchTeamReports();
  }, []);

  // const fetchAllReports = async () => {
  //   try {
  //     const res = await axios.get("/reports/all-latest");
  //     const data = res.data.data;

  //     console.log("DATA", data);
  //   } catch (err) {
  //     console.error("❌ Error fetching admin reports:", err);
  //   }
  // };
  // useEffect(() => {
  //   fetchAllReports();
  // }, []);

  console.log("📛 TEAM REPORTS : ", reports);

  const defaultTypes = [
    {
      type: "poster",
      name: "Project Poster",
      icon: POSTERICON,
      iconStyle: { width: "28px" },
    },
    {
      type: "article",
      name: "Project Article",
      icon: ARTICLEICON,
      iconStyle: { width: "26px" },
    },
    {
      type: "video",
      name: "Video Report",
      icon: VIDEOICON,
      iconStyle: { width: "22px" },
    },
  ];

  const DEADLINE_CONFIG = {
    poster: 3,
    article: 9,
    video: 9,
  };

  const enrichedDeliverables = defaultTypes.map((item) => {
    const matched = reports.find((r) => r.type === item.type);
    const isSubmitted = Boolean(matched);

    // Fixed deadline from now
    const daysToDeadline = DEADLINE_CONFIG[item.type] || 0;
    const now = new Date();
    const deadlineDate = new Date(
      now.getTime() + daysToDeadline * 24 * 60 * 60 * 1000
    );

    // If submitted, calculate how many days left (or overdue)
    let deadlineDays;
    if (isSubmitted) {
      const diffMs = deadlineDate - now;
      deadlineDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    } else {
      deadlineDays = daysToDeadline;
    }

    return {
      id: item.type,
      name: item.name,
      type:
        item.type === "poster"
          ? "PDF - A4 Size"
          : item.type === "article"
          ? "Word (.docx)"
          : "Media File - MP4",
      posterIcon: item.icon,
      iconStyle: item.iconStyle,
      submissionStatus: isSubmitted ? "SUBMITTED" : "UNSUBMITTED",
      tutorDecision: isSubmitted
        ? matched.tutorStatus.toUpperCase()
        : "PENDING",
      adminDecision: isSubmitted
        ? `ADMIN_${matched.adminStatus.toUpperCase()}`
        : "ADMIN_PENDING",
      deadlineDays,
      isUnsubmitted: !isSubmitted,
    };
  });

  return (
    <div className="student-dashboard-container">
      <div className="student-dashboard-section-1">
        <div className="student-dashboard-card-wrapper">
          <div className="card-left-side">
            <div className="top-text">Project Theme</div>
            <div
              className={`bottom-text theme-${team.theme
                .toLowerCase()
                .replace(/\s+/g, "-")}-text`}
            >
              {team.theme}
            </div>
          </div>
          <div
            className={`card-right-side theme-${team.theme
              .toLowerCase()
              .replace(/\s+/g, "-")}-light`}
          >
            <img
              src={currentTheme.icon}
              alt={`${team.theme} Icon`}
              className={`card-img theme-img-${team.theme
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            />
          </div>
        </div>

        <div className="student-dashboard-card-wrapper">
          <div className="card-left-side">
            <div className="top-text">Team Members</div>
            <div className="bottom-text team-members-tag">
              <span>{teamData?.members.length}</span> Members
            </div>
          </div>
          <div className="card-right-side team-members-icon-wrapper">
            <img
              src={TEAMMEMBERSICON}
              alt=""
              className="card-img team-members-icon"
            />
          </div>
        </div>

        <div className="student-dashboard-card-wrapper">
          <div className="card-left-side">
            <div className="top-text">Team Meetings</div>
            <div className="bottom-text meetings-tag">
              Next Meet <LuCircleChevronRight className="meetings-icon" />
            </div>
          </div>
          <div className="card-right-side team-meetings-icon-wrapper">
            <img
              src={TEAMMEETICON}
              alt=""
              className="card-img team-meetings-icon"
            />
          </div>
        </div>
      </div>
      <div className="student-dashboard-section-2">
        <div className="timeline-title">Leveling Up : One Phase at a Time</div>

        <div className="text-wrapper">
          <div className="psc-timeline-wrapper">
            <TimelineItem
              title="TEAM BUILDING STAGE"
              description="Great journeys begin with united minds and shared purpose"
            />

            <TimelineBetweenItem
              title="PSC LAUNCH CONFERENCE"
              description="Fuel your ambition, gain clarity, and step into the PSC adventure"
            />

            <TimelineBetweenItem
              title="SPONSORSHIP CONFERENCE"
              description="Master the art of pitching and learn how to attract real support"
            />

            <TimelineItem
              title="BRANDING & GRAPHIC DESIGN"
              description="Turn your vision into a powerful identity the world will recognize"
            />

            <TimelineItem
              title="PROJECT DELIVERABLES"
              description="Summarize your journey with quality work that speaks for itself"
            />

            <TimelineBetweenItem
              title="PITCHING CONFERENCE"
              description="Build confidence, refine your voice, and pitch with power and purpose"
            />

            <TimelineItem
              title="BALL DAY EVENT"
              description="Step into the spotlight and proudly showcase your team's impact !"
            />

            <TimelineItem
              title="DEFENSE DAY"
              description="Stand tall, share your story, and make your final mark with pride"
            />
          </div>
        </div>
        <div className="bg-wrapper"></div>
        {/* <img src={BG1} className="bg-img" alt="" /> */}
      </div>
      <div className="student-dashboard-section-3">
        <div className="reports-table-title">
          <div className="left-title">Milestone Team Deliverables</div>
          {/* <div className="right-call-to-action">
            <div className="text">Expand Details</div>
            <FaUpRightFromSquare className="icon" />
          </div> */}
        </div>

        <div className="reports-table-wrapper">
          <div className="table-header">
            <div className="report-name-column-table-head table-header-tag-name">
              Report Name
            </div>
            <div className="team-submission-column-table-head table-header-tag">
              Team Submission
            </div>
            <div className="tutor-decision-column-table-head table-header-tag">
              Tutor Decision
            </div>
            <div className="admin-decision-column-table-head table-header-tag">
              Admin Decision
            </div>
            <div className="deadline-column-table-head table-header-tag">
              Deadline
            </div>
          </div>
          <div className="table-divider"></div>
          <div className="table-body">
            {enrichedDeliverables.map((deliverable) => (
              <React.Fragment key={deliverable.id}>
                <div className="table-body-row">
                  <div className="report-name-column">
                    <div className="report-image">
                      <img
                        src={deliverable.posterIcon}
                        alt={deliverable.name}
                        style={deliverable.iconStyle}
                      />
                    </div>
                    <div className="report-details">
                      <div className="report-name">{deliverable.name}</div>
                      <div className="report-type">{deliverable.type}</div>
                    </div>
                  </div>

                  <div className="submission-status-column">
                    <StatusTag
                      status={deliverable.submissionStatus}
                      statusMap={submissionStatuses}
                      greyedOut={deliverable.isUnsubmitted}
                    />
                  </div>

                  <div className="tutor-decision-column">
                    <StatusTag
                      status={deliverable.tutorDecision}
                      statusMap={tutorDecisions}
                      greyedOut={deliverable.isUnsubmitted}
                    />
                  </div>

                  <div className="admin-decision-column">
                    <StatusTag
                      status={deliverable.adminDecision}
                      statusMap={adminDecisions}
                      greyedOut={deliverable.isUnsubmitted}
                    />
                  </div>

                  <div className="deadline-column">
                    <div className="deadline-tag table-report-tag">
                      <span>-</span> {deliverable.deadlineDays} Days
                    </div>
                  </div>
                </div>
                <div className="table-row-divider"></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
