import "./events.scss";
import { useState, useEffect } from "react";

import EVENTIMG from "../../assets/icons/event3.png";
import EVENTICON from "../../assets/icons/event4.png";
import EVENTCARDIMG from "../../assets/images/depCover.png";
import EVENTHEADERICON from "../../assets/icons/eventIcon.png";
import TUTORTICON from "../../assets/icons/tutorIcon.png";

import { LuBookmarkCheck } from "react-icons/lu";
import { BiSolidLabel } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { TbLocationPin } from "react-icons/tb";
import { TbMapPin } from "react-icons/tb";
import { MdOutlinePublic } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { BiCalendarStar } from "react-icons/bi";
import { PiShootingStarFill } from "react-icons/pi";
import { TbListDetails } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineFieldTime } from "react-icons/ai";
import { IoTrashBin } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { PiCalendarStarBold } from "react-icons/pi";
import { TbWorldShare } from "react-icons/tb";
import { TbWorldOff } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { HiUserGroup } from "react-icons/hi2";
import { RiGroup2Fill } from "react-icons/ri";
import { TbCalendarStar } from "react-icons/tb";
import { TbCalendarCheck } from "react-icons/tb";
import { TbCalendarTime } from "react-icons/tb";
import { BiImageAdd } from "react-icons/bi";
import { FiUploadCloud } from "react-icons/fi";
import { MdOutlineEditCalendar } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineMoneyOffCsred } from "react-icons/md";
import { MdOutlineAttachMoney } from "react-icons/md";
import { TbCalendarPin } from "react-icons/tb";
import { TbCalendarUser } from "react-icons/tb";

import { Popconfirm } from "antd";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Divider, Tooltip } from "antd";
import { Button, Modal, Input, InputNumber } from "antd";
import { Space, Switch } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
const { Dragger } = Upload;

import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import toast from "react-hot-toast";

dayjs.extend(customParseFormat);

const Events = () => {
  const [eventViewList, setEventViewList] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [handleEditEvent, setHandleEditEvent] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const [eventData, setEventData] = useState({
    title: "",
    date: null,
    location: "",
    type: "",
    isMandatory: false,
    published: true,
    cover: null,
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/events");
      setEvents(response.data.data);
      console.log("✅ EVENTS DATA : ", response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch events");
      setLoading(false);
    }
  };
  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventViewChangeList = () => setEventViewList(true);
  const handleEventViewChangeCards = () => setEventViewList(false);

  // Modal handlers
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setEventData({
      title: "",
      date: null,
      location: "",
      type: "",
      isMandatory: false,
      published: true,
      cover: null,
    });
    setFileList([]);
    setHandleEditEvent(false);
  };

  const handleSaveEvent = async () => {
    try {
      // Create FormData to handle file upload
      const formData = new FormData();

      // Append all event data
      formData.append("title", eventData.title);
      formData.append(
        "date",
        eventData.date ? eventData.date.toISOString() : ""
      );
      formData.append("location", eventData.location);
      formData.append("type", eventData.type);
      formData.append("isMandatory", eventData.isMandatory);
      formData.append("published", eventData.published);

      // Use file from fileList instead of fileInput ref
      if (fileList.length > 0) {
        // Try these alternatives in order:
        const file = fileList[0].originFileObj || fileList[0];
        if (file) {
          formData.append("cover", file);
          console.log("✅ File appended:", file);
        } else {
          console.warn("⚠️ File exists but couldn't get file object", fileList[0]);
        }
      }
      console.log("📛 FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      // console.log(" FORMDATA  : " , formData)

      let response;

      if (handleEditEvent) {
        // For edit mode
        response = await axios.put(`/events/${currentEventId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setEvents(
          events.map((event) =>
            event._id === currentEventId ? response.data.data : event
          )
        );

        toast.success("Event updated successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        handleCancel();
      } else {
        // For create mode
        response = await axios.post("/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setEvents([...events, response.data.data]);

        toast.success("Event created successfully");
        handleCancel();
      }

      handleCancel();
    } catch (error) {
      console.error("Error saving event:", error);

      toast.error(error.response?.data?.message || "Failed to save event");
    }
  };
  // Edit event
  const handleEdit = (event) => {
    setEventData({
      title: event.title,
      date: event.date ? dayjs(event.date) : null,
      location: event.location,
      type: event.type,
      isMandatory: event.isMandatory,
      published: event.published,
      cover: event.cover,
    });
    setCurrentEventId(event._id);
    setHandleEditEvent(true);
    showModal();
  };

  // Delete event
  const handleDeleteEvent = async (currentEventId) => {
    try {
      await axios.delete(`/events/${currentEventId}`);
      setEvents(events.filter((event) => event._id !== currentEventId));
      toast.success("Event deleted successfully");
      fetchEvents();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const [fileList, setFileList] = useState([]);

  const uploadProps = {
    onRemove: (file) => {
      setFileList([]);
      setEventData({ ...eventData, cover: null });
    },
    beforeUpload: (file) => {
      // Validate file type
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        toast.error("You can only upload image files!");
        return false;
      }

      // Validate file size (5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error("Image must be smaller than 5MB!");
        return false;
      }

      setFileList([file]);
      return false;
    },
    fileList,
    accept: "image/*",
  };

  // Date handling
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  });

  const calculateStats = () => {
    const now = new Date();
    
    return {
      finished: events.filter(event => new Date(event.date) < now).length,
      upcoming: events.filter(event => new Date(event.date) >= now).length,
      // Assuming you have an 'interested' field in your event data
      interested: events.reduce((sum, event) => sum + (event.interested || 0), 0),
      published: events.filter(event => event.published).length,
      unpublished: events.filter(event => !event.published).length,
      public: events.filter(event => event.type === 'public').length,
      private: events.filter(event => event.type === 'private').length,
    };
  };

  const stats = calculateStats();

  return (
    <>
      <div className="events-view-wrapper">
        <div className="events-list-layout-1-top">
          <div className="events-list-layout-1-top-left">
            <div className="badge"></div>
            <div className="icon">
              <img src={EVENTICON} alt="" />
            </div>
            <div className="title">MANAGE EVENTS</div>
          </div>

          <div className="events-list-layout-1-top-right">
            <div className="view-type">
              <div
                className={`list-view ${eventViewList ? "active" : ""}`}
                onClick={handleEventViewChangeList}
              >
                <TbListDetails />
              </div>
              <div
                className={`cards-view ${!eventViewList ? "active" : ""}`}
                onClick={handleEventViewChangeCards}
              >
                <LuLayoutDashboard />
              </div>
            </div>
          </div>
        </div>

        <div className="events-view-bottom">
          {eventViewList ? (
            <div className="events-right events-right-list-view">
              {events.map((event) => (
                <div className="event-list-item-wrapper" key={event._id}>
                  <div className="day-wrapper">
                    <div className="month">
                      {new Date(event.date)
                        .toLocaleString("default", { month: "short" })
                        .toUpperCase()}
                    </div>
                    <div className="day">{new Date(event.date).getDate()}</div>
                  </div>

                  <div className="event-item-details-wrapper">
                    <div className="event-title">{event.title}</div>
                    <div className="event-card-date">
                      <AiOutlineFieldTime className="icon" />
                      {new Date(event.date).toLocaleString("en-US", {
                        weekday: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="event-location">
                      <TbMapPin className="icon" />
                      Location: <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="event-item-center">
                    <div className="center-left">
                      <div
                        className={`public-event ${
                          event.type === "public" ? "public" : "private"
                        }`}
                      >
                        {event.type === "public" ? (
                          <MdOutlinePublic className="icon" />
                        ) : (
                          <RiGroup2Fill className="icon" />
                        )}
                        {event.type === "public" ? "Public" : "Private"}
                      </div>
                      <div
                        className={`fees-event ${
                          event.isMandatory ? "mandatory" : "optional"
                        }`}
                      >
                        <LuBookmarkCheck className="icon" />
                        {event.isMandatory ? "Mandatory" : "Optional"}
                      </div>
                    </div>

                    <div className="center-interested-ppl">
                      <div className="title">
                        <PiCalendarStarBold className="icon" />
                        Interested members
                      </div>
                      <div className="participants">
                        <Avatar.Group
                          shape="square"
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {/* You can map through actual participants here */}
                          <Avatar style={{ backgroundColor: "#f56a00" }}>
                            K
                          </Avatar>
                          <Avatar
                            style={{ backgroundColor: "#87d068" }}
                            icon={<UserOutlined />}
                          />
                        </Avatar.Group>
                      </div>
                    </div>

                    <div className="event-status-wrapper">
                      <div
                        className={`publish-status ${
                          event.published ? "published" : "unpublished"
                        }`}
                      >
                        {event.published ? (
                          <>
                            <TbWorldShare className="icon" />
                            Published
                          </>
                        ) : (
                          <>
                            <TbWorldOff className="icon" />
                            Unpublished
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="event-item-actions-btns-wrapper">
                    <div
                      className="settings-event-btn"
                      onClick={() => handleEdit(event)}
                    >
                      <LuSettings className="icon" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="events-right events-right-cards-view">
              {events.map((event) => (
                <div className="event-card-wrapper" key={event._id}>
                  <div className="starred-event-wrapper">
                    <PiShootingStarFill className="icon" />
                  </div>

                  <div className="event-card-top">
                    {event.cover ? (
                      <img
                        src={`http://localhost:5000${event.cover}`}
                        alt={event.title}
                        onError={(e) => {
                          e.target.src = EVENTCARDIMG; // Fallback image
                        }}
                      />
                    ) : (
                      <img src={EVENTCARDIMG} alt="Default event" />
                    )}
                  </div>

                  <div className="event-card-bottom">
                    <div className="event-card-date">
                      {new Date(event.date).toLocaleString("en-US", {
                        weekday: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="event-day">
                      <div className="month">
                        {new Date(event.date)
                          .toLocaleString("default", { month: "short" })
                          .toUpperCase()}
                      </div>
                      <div className="day">
                        {new Date(event.date).getDate()}
                      </div>
                    </div>

                    <div className="event-title">
                      <BiSolidLabel className="icon" />
                      {event.title}
                    </div>

                    <div className="event-location">
                      Location: <span>{event.location}</span>
                    </div>

                    <div className="public-private-classes">
                      <div
                        className={`public-event ${
                          event.type === "public" ? "public" : "private"
                        }`}
                      >
                        {event.type === "public" ? (
                          <MdOutlinePublic className="icon" />
                        ) : (
                          <RiGroup2Fill className="icon" />
                        )}
                        {event.type === "public" ? "Public" : "Private"}
                      </div>
                      <div
                        className={`fees-event ${
                          event.isMandatory ? "mandatory" : "optional"
                        }`}
                      >
                        <LuBookmarkCheck className="icon" />
                        {event.isMandatory ? "Mandatory" : "Optional"}
                      </div>
                    </div>

                    <div className="hrz-divider"></div>

                    <div className="participants-participate-wrapper">
                      <div className="participants">
                        <Avatar.Group
                          shape="square"
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {/* Map through actual participants here */}
                          <Avatar style={{ backgroundColor: "#f56a00" }}>
                            K
                          </Avatar>
                          <Avatar
                            style={{ backgroundColor: "#87d068" }}
                            icon={<UserOutlined />}
                          />
                        </Avatar.Group>
                      </div>
                      <div className="participate-btn">
                        <BiCalendarStar className="icon" />
                        Interested
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="events-left">
            <div className="nav-bar-events">
              <div className="nav-item active">Today</div>
              <div className="nav-item">Finished</div>
              <div className="nav-item">Upcoming</div>

              <div className="add-new-event-btn" onClick={showModal}>
                <TbCalendarStar className="icon" />
                New Event
              </div>

              <Modal
                title={null}
                open={isModalOpen}
                // onOk={handleOk}
                onCancel={handleCancel}
                header={null}
                footer={null}
                closable={false}
                width={500}
              >
                <div className="add-event-modal">
                  <div className="add-event-header">
                    <div className="title">
                      <div className="icon">
                        <img src={EVENTHEADERICON} alt="" />
                      </div>
                      <div className="content">Add event</div>
                    </div>

                    <div className="switch-wrapper">
                      <Switch
                        className="custom-switch"
                        checkedChildren="Published"
                        unCheckedChildren="Unpublished"
                        checked={eventData.published}
                        onChange={(checked) =>
                          setEventData({ ...eventData, published: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="add-event-body">
                    <div className="event-detail-item-wrapper cover">
                      <div className="label">
                        <BiImageAdd className="icon" />
                        <div className="text">Cover</div>
                      </div>
                      <div className="content">
                        <Dragger {...uploadProps}>
                          {fileList.length > 0 ? (
                            <img
                              src={
                                fileList[0]?.url ||
                                URL.createObjectURL(fileList[0])
                              }
                              alt="Preview"
                              style={{ maxWidth: "100%", maxHeight: "120px" }}
                            />
                          ) : (
                            <>
                              <FiUploadCloud className="upload-icon" />
                              <p className="upload-text">
                                Click or drag image to upload
                              </p>
                              <p className="upload-hint">
                                Supports JPG, PNG, GIF up to 5MB
                              </p>
                            </>
                          )}
                        </Dragger>
                      </div>
                    </div>
                    <div className="event-detail-item-wrapper">
                      <div className="label">
                        <MdOutlineEditCalendar className="icon" />
                        <div className="text">Title</div>
                      </div>
                      <div className="content">
                        <Input
                          className="event-input"
                          value={eventData.title}
                          onChange={(e) =>
                            setEventData({
                              ...eventData,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="event-detail-item-wrapper">
                      <div className="label">
                        <LuCalendarClock className="icon date-icon" />
                        <div className="text">Date</div>
                      </div>
                      <div className="content">
                        <DatePicker
                          format="YYYY-MM-DD HH:mm:ss"
                          disabledDate={disabledDate}
                          disabledTime={disabledDateTime}
                          showTime={{
                            defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                          }}
                          className="event-input"
                          placeholder=""
                          value={eventData.date}
                          onChange={(value) =>
                            setEventData({ ...eventData, date: value })
                          }
                        />
                      </div>
                    </div>

                    <div className="event-detail-item-wrapper">
                      <div className="label">
                        <TbCalendarPin className="icon location-icon" />
                        <div className="text">Location</div>
                      </div>
                      <div className="content">
                        <Input
                          className="event-input"
                          value={eventData.location}
                          onChange={(e) =>
                            setEventData({
                              ...eventData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="event-detail-item-wrapper">
                      <div className="label">
                        <TbCalendarUser className="icon type-icon" />
                        <div className="text">Type</div>
                      </div>
                      <div className="content">
                        <div className="event-type">
                          {/* Public/Private Selection */}
                          <div className="type-group">
                            <div
                              className={`type-btn pp ${
                                eventData.type === "public" ? "selected" : ""
                              }`}
                              onClick={() =>
                                setEventData({ ...eventData, type: "public" })
                              }
                            >
                              {/* <MdOutlinePublic className="icon" /> */}
                              Public
                            </div>

                            <div
                              className={`type-btn pp ${
                                eventData.type === "private" ? "selected" : ""
                              }`}
                              onClick={() =>
                                setEventData({ ...eventData, type: "private" })
                              }
                            >
                              {/* <MdOutlineLock className="icon" /> */}
                              Private
                            </div>
                          </div>

                          <div className="type-divider"></div>

                          {/* Mandatory/Optional Selection */}
                          <div className="type-group">
                            <div
                              className={`type-btn fp ${
                                eventData.isMandatory ? "selected" : ""
                              }`}
                              onClick={() =>
                                setEventData({
                                  ...eventData,
                                  isMandatory: true,
                                })
                              }
                            >
                              {/* <MdOutlinePriorityHigh className="icon" /> */}
                              Mandatory
                            </div>

                            <div
                              className={`type-btn fp ${
                                !eventData.isMandatory ? "selected" : ""
                              }`}
                              onClick={() =>
                                setEventData({
                                  ...eventData,
                                  isMandatory: false,
                                })
                              }
                            >
                              {/* <MdOutlineLowPriority className="icon" /> */}
                              Optional
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {handleEditEvent ? (
                    <div className="add-event-footer">
                      <Popconfirm
                        title="Delete Event"
                        description="Are you sure you want to delete this event?"
                        onConfirm={() => handleDeleteEvent(currentEventId)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <div className="delete-btn">Delete</div>
                      </Popconfirm>
                      <div className="save-btn" onClick={handleSaveEvent}>
                        {" "}
                        {/* Changed from handleEditEvent to handleSaveEvent */}
                        Update event
                      </div>
                    </div>
                  ) : (
                    <div className="add-event-footer save">
                      <div className="save-btn" onClick={handleSaveEvent}>
                        Save event
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            </div>

            <div className="events-widgets-stats-cards-wrapper">
              <div className="event-stat-card-wrapper">
                <div className="event-card-layer-2 finished">
                  <div className="label">Finished</div>
                  <div className="number">{stats.finished}</div>
                  <div className="icon-wrapper">
                    <div className="icon-layer-2 finished">
                      <TbCalendarCheck />
                    </div>
                  </div>
                </div>
              </div>
              <div className="event-stat-card-wrapper">
                <div className="event-card-layer-2 upcoming">
                  <div className="label">Upcoming</div>
                  <div className="number">{stats.upcoming}</div>
                  <div className="icon-wrapper">
                    <div className="icon-layer-2 upcoming">
                      <TbCalendarTime />
                    </div>
                  </div>
                </div>
              </div>

              <div className="event-stat-card-wrapper">
                <div className="event-card-layer-2 interested">
                  <div className="label">Interested</div>
                  <div className="number">
                    <span>+</span>20
                  </div>
                  <div className="icon-wrapper">
                    <div className="icon-layer-2 interested">
                      <TbCalendarStar />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="events-hr-widgets-wrapper">
              <div className="event-hr-widget">
                <div className="icon-wrapper published">
                  <TbWorldShare />
                </div>
                <div className="content published">
                  Published : <span>{stats.published}</span>
                </div>
              </div>
              <div className="event-hr-widget">
                <div className="icon-wrapper unpublished">
                  <TbWorldOff />
                </div>
                <div className="content unpublished">
                  Unpublished : <span>{stats.unpublished}</span>
                </div>
              </div>
            </div>

            <div className="events-hr-widgets-wrapper">
              <div className="event-hr-widget">
                <div className="icon-wrapper public">
                  <TbWorldShare />
                </div>
                <div className="content public">
                  Public : <span>{stats.public}</span>
                </div>
              </div>
              <div className="event-hr-widget">
                <div className="icon-wrapper private">
                  <TbWorldOff />
                </div>
                <div className="content private">
                  Private : <span>{stats.private}</span>
                </div>
              </div>
            </div>

            <img src={EVENTICON} alt="" className="event-img" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Events;
