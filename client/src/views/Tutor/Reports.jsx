import React, { useState, useEffect } from "react";
import { Tabs, Tag, Button, Card, Statistic, Row, Col, message } from "antd";
import {
  FilePdfOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { DownloadOutlined } from "@ant-design/icons";

import "./reports.scss";
import axios from "axios";

import REPORTS from "../../assets/icons/articleIcon.png";
import APPROVEDREPORT from "../../assets/icons/approvedReport.png";
import REJECTEDREPORT from "../../assets/icons/rejectedReport.png";
import PENDINGREPORT from "../../assets/icons/exlamationIcon.png";
import toast from "react-hot-toast";
const themes = [
  { name: "Education", key: "ed", color: "#89c9ff" },
  { name: "Environnement", key: "env", color: "#9cdb89" },
  { name: "Health", key: "health", color: "#f4a850" },
  { name: "Culture & Sport", key: "other", color: "#b990f5" },
];

const reportTypes = [
  { key: "article", label: "Article", icon: <FileTextOutlined /> },
  { key: "poster", label: "Poster", icon: <FilePdfOutlined /> },
  { key: "video", label: "Video", icon: <VideoCameraOutlined /> },
];

const BASE_URL = "http://localhost:5000";

const statusIcons = {
  approved: <CheckCircleTwoTone twoToneColor="#52c41a" />,
  rejected: <CloseCircleTwoTone twoToneColor="#ff4d4f" />,
  pending: <ClockCircleOutlined style={{ color: "#faad14" }} />,
};

const Reports = ({ tutor, authToken }) => {
  const [teams, setTeams] = useState([]);
  const [view, setView] = useState("type");

  // Analytics
  const allReports = teams.flatMap((team) =>
    team.reports.map((r) => ({
      _id: r.id,
      ...r,
      team: team.name,
      teamId: team.teamId,
      theme: team.theme,
      file: r.fileName,
      date: new Date().toLocaleDateString(), // or use a real date if available
      status: r.tutorStatus.toLowerCase(), // for status icons
    }))
  );

  const total = allReports.length;
  const approved = allReports.filter((r) => r.status === "approved").length;
  const rejected = allReports.filter((r) => r.status === "rejected").length;
  const pending = allReports.filter((r) => r.status === "pending").length;

  // By Type View
  const renderByType = () => (
    <div className="reports-by-type">
      {reportTypes.map((rt) => (
        <Card
          key={rt.key}
          title={
            <span>
              {rt.icon} {rt.label}
            </span>
          }
          className="report-type-card"
        >
          {allReports.filter((r) => r.type === rt.key).length === 0 ? (
            <div className="no-reports">No reports</div>
          ) : (
            allReports
              .filter((r) => r.type === rt.key)
              .map((r, idx) => (
                <div key={idx} className="report-row">
                  <div className="report-team-tag-name-wrapper">
                    <Tag
                      color={
                        themes.find((t) => t.name === r.theme)?.color || "#eee"
                      }
                    >
                      {r.team}
                    </Tag>

                    <span className="report-file">{r.file}</span>
                  </div>

                  <span className="report-status">
                    {statusIcons[r.status]}{" "}
                    <span className={`status-text ${r.status}`}>
                      {r.status}
                    </span>
                  </span>

                  {r.status === "pending" && (
                    <>
                      <Button
                        size="small"
                        type="primary"
                        onClick={async () => {
                          await updateReportStatus(r.id, "approved");
                          fetchTutorReports();
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        danger
                        style={{ marginLeft: 8 }}
                        onClick={async () => {
                          await updateReportStatus(r.id, "rejected");
                          fetchTutorReports();
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              ))
          )}
        </Card>
      ))}
    </div>
  );

  const handleDownload = (fileUrl, fileName) => {
    const fullUrl = fileUrl.startsWith("http")
      ? fileUrl
      : `${BASE_URL}${fileUrl}`;
    window.open(fullUrl, "_blank");
  };

  // By Team View
  const renderByTeam = () => (
    <div className="reports-by-team">
      {teams
        .filter((team) => team.reports && team.reports.length > 0) // only teams with reports
        .map((team) => (
          <Card
            key={team.teamId}
            title={
              <span>
                <Tag
                  color={
                    themes.find((t) => t.name === team.theme)?.color || "#eee"
                  }
                >
                  {team.name}
                </Tag>
              </span>
            }
            className="team-card"
          >
            {team.reports.map((r, idx) => {
              const status =
                r.adminStatus?.toLowerCase() === "approved"
                  ? "approved"
                  : r.adminStatus?.toLowerCase() === "rejected"
                  ? "rejected"
                  : "pending";

              return (
                <div
                  key={idx}
                  className="report-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <span className="report-type">
                      <b>
                        {reportTypes.find((rt) => rt.key === r.type)?.label}
                      </b>
                    </span>

                    <span className="report-file">{r.fileName}</span>

                    <span className="report-status">
                      {statusIcons[status]}{" "}
                      <span className={`status-text ${status}`}>{status}</span>
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {status === "pending" && (
                      <>
                        <Button
                          size="small"
                          type="primary"
                          onClick={async () => {
                            await updateReportStatus(r.id, "approved");
                            fetchTutorReports();
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          danger
                          style={{ marginLeft: 8 }}
                          onClick={async () => {
                            await updateReportStatus(r.id, "rejected");
                            fetchTutorReports();
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {/* Download button */}
                    <Button
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(r.fileUrl, r.fileName)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </Card>
        ))}
    </div>
  );

  const updateReportStatus = async (reportId, newStatus) => {
    console.log("APPROVING : ", reportId, newStatus);
    try {
      const res = await axios.patch(`/reports/${reportId}`, {
        tutorStatus: newStatus,
      });

      if (res.data.status === "success") {
        toast.success(`Report ${newStatus}`);
        // Refresh state or re-fetch data if needed
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating report status:", err);
      toast.error("Something went wrong.");
    }
  };

  const fetchTutorReports = async () => {
    try {
      const tutor = JSON.parse(localStorage.getItem("userData"));
      const token = localStorage.getItem("authToken");

      const res = await axios.get(`/reports/tutor/${tutor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;
      setTeams(data); // list of teams assigned to tutor
    } catch (err) {
      console.error("❌ Error fetching tutor reports:", err);
    }
  };

  useEffect(() => {
    fetchTutorReports();
  }, []);

  console.log("TEAMS : ", teams);
  return (
    <div className="reports-dashboard-wrapper">
      <div className="analytics-row">
        <div className="analytics-card">
          <div className="left-side">
            <div className="title">TOTAL REPORTS</div>
            <div className="stat total">{total}</div>
          </div>
          <div className="right-side">
            <img src={REPORTS} alt="" className="total-report-img" />
          </div>
        </div>

        <div className="analytics-card">
          <div className="left-side">
            <div className="title">APPROVED</div>
            <div className="stat approved">{approved}</div>
          </div>
          <div className="right-side">
            <img src={APPROVEDREPORT} alt="" className="approved-report-img" />
          </div>
        </div>

        <div className="analytics-card">
          <div className="left-side">
            <div className="title ">REJECTED</div>
            <div className="stat rejected">{rejected}</div>
          </div>
          <div className="right-side">
            <img src={REJECTEDREPORT} alt="" className="rejected-report-img" />
          </div>
        </div>

        <div className="analytics-card">
          <div className="left-side">
            <div className="title">PENDING</div>
            <div className="stat pending">{pending}</div>
          </div>
          <div className="right-side">
            <img src={PENDINGREPORT} alt="" className="pending-report-img" />
          </div>
        </div>
      </div>

      <div className="reports-section">
        <div className="view-toggle">
          <Tabs
            defaultActiveKey="type"
            activeKey={view}
            onChange={setView}
            items={[
              { key: "type", label: "By Type", children: renderByType() },
              { key: "team", label: "By Team", children: renderByTeam() },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
