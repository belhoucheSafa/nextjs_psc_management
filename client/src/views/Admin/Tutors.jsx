import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Input,
  Form,
  Radio,
  Button,
  Switch,
  QRCode,
  message,
  Drawer,
  InputNumber,
} from "antd";
import { TiUserAddOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import { MdOutlineAttachMoney } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { AiOutlineUserDelete, AiOutlineReload } from "react-icons/ai";
import { LiaUserEditSolid } from "react-icons/lia";
import "./tutors.scss";
import TUTORTICON from "../../assets/icons/tutorIcon.png";

import { Popconfirm } from 'antd';

import axios from "axios";
import { getCurrentUser } from "../../utils/auth";

let matriculeCounter = 1; 



import { Select, Tag } from "antd";

const themeOptions = [
  { value: "Education", label: "Education", theme: "ed" },
  { value: "Environnement", label: "Environnement", theme: "env" },
  { value: "Health", label: "Health", theme: "health" },
  { value: "Culture & Sport", label: "Culture & Sport", theme: "other" },
];

// const teamOptions = [
//   { value: "Team 5", label: "Team 5", theme: "health" },
//   { value: "Team 7", label: "Team 7", theme: "other" },
//   { value: "Team 8", label: "Team 8", theme: "env" },
// ];

// const tagRender = (props) => {
//   const { label, value, closable, onClose } = props;
//   const onPreventMouseDown = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//   };

//   // Find the full team object based on the value
//   const team = teamOptions.find((team) => team.value === value);
//   const teamName = team?.label || value;
//   const teamTheme = team?.theme || "";

//   return (
//     <Tag
//       className={`assigned-team-widget ${teamTheme}`}
//       onMouseDown={onPreventMouseDown}
//       closable={closable}
//       onClose={onClose}
//       style={{ marginInlineEnd: 4 }}
//     >
//       {teamName}
//     </Tag>
//   );
// };

const themeClassMap = {
  Education: "ed",
  Environnement: "env",
  Health: "health",
  "Culture & Sport": "other",
};

const Tutors = () => {
  const currentUser = getCurrentUser();

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setEditingTutorId(null);
    resetForm();
    generateMatricule();
    setOpen(true);
  };

  const [editingTutorId, setEditingTutorId] = useState(null);

  const [tutors, setTutors] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [matricule, setMatricule] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [selectedThemes, setSelectedThemes] = useState([]);
  const tutorCardRef = useRef(null);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tutorCardRef.current &&
        !tutorCardRef.current.contains(event.target)
      ) {
        setActiveCardId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    if (value === "permanent") {
      setSelectedThemes(themeOptions.map((t) => t.value));
    } else if (value === "part-time") {
      const shuffled = [...themeOptions].sort(() => 0.5 - Math.random());
      setSelectedThemes([shuffled[0].value, shuffled[1].value]);
    } else {
      setSelectedThemes([]);
    }
  };
  const handleGenderChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setGender(value);
  };

  const generateMatricule = () => {
    // Find the highest existing matricule number
    const highestMatricule = tutors.reduce((max, tutor) => {
      const num = parseInt(tutor.matricule.split("-")[2]);
      return num > max ? num : max;
    }, 0);

    // Set counter to highest + 1
    matriculeCounter = highestMatricule + 1;

    const newMatricule = `TUT-PSC-${String(matriculeCounter).padStart(3, "0")}`;
    setMatricule(newMatricule);
  };
  const tutorCardRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideAllCards = Object.values(tutorCardRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );

      if (clickedOutsideAllCards) {
        setActiveCardId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleActiveStatus = (id, checked, e) => {
    e.stopPropagation();

    e.stopPropagation();
    setTutors((prevTutors) =>
      prevTutors.map((tutor) =>
        tutor._id === id ? { ...tutor, active: checked } : tutor
      )
    );

    // Send PATCH request to backend
    axios
      .patch(
        `/tutors/${id}`,
        { active: checked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then(() => {
        message.success(`Tutor marked as ${checked ? "active" : "inactive"}`);
      })
      .catch((err) => {
        message.error("Failed to update tutor status");

        // Rollback UI if error
        setTutors((prevTutors) =>
          prevTutors.map((tutor) =>
            tutor._id === id ? { ...tutor, active: !checked } : tutor
          )
        );
      });
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setGender("");
    setStatus("");
    setSelectedThemes([]);
    setSelectedTeams([]);
    setMatricule("");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tutors/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Remove from frontend state
      setTutors((prevTutors) => prevTutors.filter((tutor) => tutor._id !== id));
      setActiveCardId(null); // Close the overlay
      toast.success("Tutor deleted successfully !");
    } catch (error) {
      console.error("❌ Error deleting tutor:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete the tutor."
      );
    }
  };

  const fetchTutors = () => {
    axios
      .get("/tutors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => {
        setTutors(res.data.data.tutors);
      })
      .catch(() => {
        message.error("Failed to fetch tutors");
      });
  };


  useEffect(() => {
    fetchTutors();
  }, []);

  const handleSaveTutor = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !status ||
      selectedThemes.length === 0
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const tutorData = {
      firstName,
      lastName,
      email,
      phone,
      gender,
      status,
      assignedThemes: selectedThemes,
      assignedTeams: selectedTeams,
      matricule,
      role: "tutor",
    };

    if (editingTutorId) {
      // Update existing tutor
      axios
        .patch(`/tutors/${editingTutorId}`, tutorData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((res) => {
          toast.success("Tutor updated successfully!");
          setOpen(false);
          resetForm();
          setEditingTutorId(null);
          fetchTutors()
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Error updating tutor.");
        });
    } else {
      // Create new tutor
      axios
        .post("/tutors", tutorData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((res) => {
          toast.success("Tutor added successfully!");
          // setTutors((prev) => [...prev, res.data.data.tutor]);
          setOpen(false);
          resetForm();
          fetchTutors()
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Error adding tutor.");
        });
    }
  };

  console.log("📛 TUTORS : ", tutors);

  const handleEditTutor = (tutor) => {
    setEditingTutorId(tutor._id);
    setFirstName(tutor.firstName);
    setLastName(tutor.lastName);
    setEmail(tutor.email);
    setPhone(tutor.phone);
    setGender(tutor.gender);
    setStatus(tutor.status);
    setSelectedThemes(tutor.assignedThemes || []);

    // Map assignedTeams objects to their IDs (or the value you use in teamOptions)
    setSelectedTeams(
      tutor.assignedTeams ? tutor.assignedTeams.map((team) => team._id) : []
    );

    setMatricule(tutor.matricule);
    setOpen(true);
  };

  const [teamOptions, setTeamOptions] = useState([]);

  useEffect(() => {
    axios
      .get("/teams", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => {
        const fetchedTeams = res.data.data.teams;

        const formatted = fetchedTeams.map((team) => {
          // Map themes to CSS class keys used in UI
          let themeClass = "";
          switch (team.theme) {
            case "Education":
              themeClass = "ed";
              break;
            case "Environnement":
              themeClass = "env";
              break;
            case "Health":
              themeClass = "health";
              break;
            case "Culture & Sport":
              themeClass = "other";
              break;
            default:
              themeClass = "";
          }

          return {
            value: team._id, // Or team._id if you want more robust IDs
            label: team.name,
            theme: themeClass,
          };
        });

        setTeamOptions(formatted);
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        toast.error("Failed to load teams.");
      });
  }, []);
  const themeTagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const themeObj = themeOptions.find((theme) => theme.value === value);
    const themeClass = themeObj?.theme || "";

    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        className={`assigned-team-widget ${themeClass}`}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </Tag>
    );
  };

  // const tagRender = (props) => {
  //   const { label, value, closable, onClose } = props;

  //   const onPreventMouseDown = (event) => {
  //     event.preventDefault();
  //     event.stopPropagation();
  //   };

  //   const team = teamOptions.find((team) => team.value === value);
  //   const teamTheme = team?.theme || "";

  //   return (
  //     <Tag
  //       className={`assigned-team-widget ${teamTheme}`}
  //       onMouseDown={onPreventMouseDown}
  //       closable={closable}
  //       onClose={onClose}
  //       style={{ marginInlineEnd: 4 }}
  //     >
  //       {label}
  //     </Tag>
  //   );
  // };

  const createTagRender = (teams) => (props) => {
    const { label, value, closable, onClose } = props;

    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const team = teams.find((team) => team.value === value);
    const teamTheme = team?.theme || "";

    return (
      <Tag
        className={`assigned-team-widget ${teamTheme}`}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <div className="tutors-list-wrapper">
      <div className="tutors-list-layout-1">
        <div className="tutors-list-layout-1-top">
          <div className="tutors-list-layout-1-top-left">
            <div className="badge"></div>
            <div className="icon">
              <img src={TUTORTICON} alt="" />
            </div>
            <div className="title">MANAGE TUTORS</div>
          </div>

          <div className="tutors-list-layout-1-top-right">
            <div
              className="import-student-list-button"
              // onClick={handleAddTutor}
              onClick={showDrawer}
            >
              <div className="icon">
                <TiUserAddOutline />
              </div>
              <div className="text">ADD NEW TUTOR</div>
            </div>
          </div>
        </div>

        <div className="tutors-list-layout-1-bottom" ref={tutorCardRef}>
          {tutors && tutors.length > 0 ? (
            tutors?.map((tutor) => (
              <div
                key={tutor._id}
                ref={(el) => (tutorCardRefs.current[tutor._id] = el)}
                className={`tutor-card-wrapper ${
                  activeCardId === tutor._id ? "overlay-active" : ""
                }`}
                onClick={() => setActiveCardId(tutor._id)}
              >
                <div className="tutor-card-top">
                  <div className="avatar-wrapper">
                    <QRCode
                      value={tutor.matricule || "-"}
                      className="tutor-qrcode"
                      size={80}
                    />
                  </div>

                  <div className="tutor-details-wrapper">
                    <div className="tutor-name">
                      <span>{tutor.gender === "male" ? "Mr." : "Mrs."}</span>{" "}
                      {tutor.firstName} {tutor.lastName}
                    </div>

                    <div className="tutor-phone">
                      <span>PHONE: </span> {tutor.phone}
                    </div>
                  </div>

                  <div className="tutor-status-toggle-wrapper">
                    <Switch
                      size="small"
                      checked={tutor.active}
                      onChange={(checked, e) =>
                        toggleActiveStatus(tutor._id, checked, e)
                      }
                    />
                  </div>
                </div>

                <div className="tutor-card-bottom">
                  {tutor.assignedTeams && tutor.assignedTeams.length > 0 ? (
                    <div className="tutor-teams-wrapper">
                      {tutor.assignedTeams.map((team, index) => {
                        const themeClass = themeClassMap[team.theme] || "";
                        return (
                          <div
                            key={index}
                            className={`assigned-team-widget ${themeClass}`}
                          >
                            {team.name}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="no-teams-yet">No teams assigned yet</div>
                  )}
                </div>

                {activeCardId === tutor._id && (
                  <div className="tutor-card-overlay">
                    <button
                      className="action-button edit"
                      onClick={() => handleEditTutor(tutor)}
                    >
                      <LiaUserEditSolid className="edit-icon" />
                      Edit
                    </button>
                    <button
                      className="action-button delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(tutor._id);
                      }}
                    >
                      <AiOutlineUserDelete className="delete-icon" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-tutors-data">No tutors available !</div>
          )}
        </div>
      </div>

      <Drawer
        title={null}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        open={open}
        className="add-new-tutor-drawer"
        width={350}
        height={200}
      >
        <div className="add-new-tutor-header"></div>

        <div className="new-tutor-body-wrapper">
          <div className="tutor-icon-wrapper">
            <div className="tutor-icon">
              <QRCode
                className="tutor-icon-qrcode"
                value={"fdf"}
                style={{ borderRadius: "50%" }}
              />
            </div>
          </div>
          <div className="tutor-details-container">
            <div className="tutor-id-wrapper">TUTOR ID : {matricule}</div>

            <div className="new-tuto-infos-wrapper">
              <div className="form-wrapper">
                <div className="input-wrapper">
                  <div className="input-label">Firstname</div>
                  <div className="input-content">
                    <Input
                      placeholder=""
                      className="input-text-new-tutor"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <div className="input-label">Lastname</div>
                  <div className="input-content">
                    <Input
                      placeholder=""
                      className="input-text-new-tutor"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <div className="input-label">Email</div>
                  <div className="input-content">
                    <Input
                      placeholder=""
                      className="input-text-new-tutor"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <div className="input-label">Phone</div>
                  <div className="input-content">
                    <Input
                      placeholder=""
                      className="input-text-new-tutor"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <div className="input-label">Gender</div>
                  <div className="tutor-status-radio-wrapper">
                    <Radio.Group
                      onChange={handleGenderChange}
                      value={gender}
                      className="radio-grp"
                    >
                      <Radio value="female">Female</Radio>
                      <Radio value="male">Male</Radio>
                    </Radio.Group>
                  </div>
                </div>

                <div className="input-wrapper">
                  <div className="input-label">Status</div>
                  <div className="tutor-status-radio-wrapper">
                    <Radio.Group
                      onChange={handleStatusChange}
                      value={status}
                      className="radio-grp"
                    >
                      <Radio value="part-time">Part-Time</Radio>
                      <Radio value="permanent">Permanent</Radio>
                    </Radio.Group>
                  </div>
                </div>

                <div className="assigned-teams-wrapper">
                  <div className="assign-teams-label">Themes</div>
                  <div className="teams-selection-wrapper">
                    <Select
                      mode="multiple"
                      tagRender={themeTagRender}
                      value={selectedThemes}
                      onChange={setSelectedThemes}
                      style={{ width: "100%" }}
                      options={themeOptions}
                      optionFilterProp="label"
                      className="assigned-tutor-teams"
                      maxTagCount={4}
                    />
                  </div>
                </div>

                <div className="assigned-teams-wrapper">
                  <div className="assign-teams-label">Assigned Teams</div>
                  <div className="teams-selection-wrapper">
                    <Select
                      mode="multiple"
                      tagRender={createTagRender(teamOptions)}
                      value={selectedTeams}
                      onChange={setSelectedTeams}
                      style={{ width: "100%" }}
                      options={teamOptions}
                      optionFilterProp="label"
                      className="assigned-tutor-teams"
                    />
                  </div>
                </div>
              </div>
              <div className="new-tutor-btns-wrapper">
                <button
                  className="save-tutor-cancel"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button className="save-tutor-save" onClick={handleSaveTutor}>
                  Save Tutor
                </button>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Tutors;
