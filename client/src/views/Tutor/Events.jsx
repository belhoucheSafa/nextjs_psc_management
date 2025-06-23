import "./eventsUsers.scss";
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

  const handleEventViewChangeList = () => setEventViewList(true);
  const handleEventViewChangeCards = () => setEventViewList(false);

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

  return (
    <>
      <div className="events-view-wrapper">
        <div className="events-list-layout-1-top">
          <div className="events-list-layout-1-top-left">
            <div className="badge"></div>
            <div className="icon">
              <img src={EVENTICON} alt="" />
            </div>
            <div className="title">PSC EVENTS</div>
          </div>
        </div>

        <div className="events-view-bottom">
          <div className="events-right events-right-cards-view">
            {events.length > 0 ? (
              events.map((event) => (
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
                          {/* Replace with real participants */}
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
              ))
            ) : (
              <div className="no-events-message">
                <p>No events yet !</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Events;
