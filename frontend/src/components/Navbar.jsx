import React, { useRef, useState, useEffect } from "react";

import searchIcon from "../assets/search.png";
import chronometerIcon from "../assets/chronometer.png";
import plusIcon from "../assets/plus.png";
import bellIcon from "../assets/bell.png";
import userAvatar from "../assets/userAvatar.png";
import logoutIcon from "../assets/logout.png";

import { Avatar, Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateNewTaskForm from "../pages/Dashboard/CreateNewTaskForm";
import { useSelector } from "react-redux";

// Add this CSS to your global stylesheet or a <style> tag:
/*
@keyframes fadeSlideDown {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes badgePop {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.dropdown {
  display: none;
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
  transform-origin: top right;
}

.dropdown.show {
  display: block;
  animation: fadeSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.nav-icon-btn {
  transition: background 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease;
}

.nav-icon-btn:hover {
  background: #e0e0e0 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.10);
}

.nav-icon-btn:active {
  transform: scale(0.93);
}

.badge-dot {
  animation: badgePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.search-input-wrap {
  transition: box-shadow 0.2s ease, background 0.2s ease;
  border-radius: 10px;
}

.search-input-wrap:focus-within {
  box-shadow: 0 0 0 2px rgba(21, 127, 215, 0.25);
  background: #f5f5f5;
}

.avatar-btn {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.avatar-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}

.notification-row {
  transition: background 0.15s ease;
}

.notification-row:hover {
  background: #d4d4d4 !important;
}
*/

const Navbar = () =>
{
    const [ open, setOpen ] = useState( false );

    const { reminders, loading } = useSelector( state => state.reminder );
    const { notifications } = useSelector( ( state ) => state.notification );

    const toggleDrawer = ( value ) => ( event ) =>
    {
        if (
            event.type === "keydown" &&
            ( event.key === "Tab" || event.key === "Shift" )
        )
        {
            return;
        }
        setOpen( value );
    };

    const navigate = useNavigate();

    const [ showNotifications, setShowNotifications ] = useState( false );
    const notificationRef = useRef( null );

    const [ showReminders, setShowReminders ] = useState( false );
    const remindersRef = useRef( null );

    const handleShowReminders = () =>
    {
        setShowReminders( prev => !prev );
        setShowNotifications( false );
    };

    const handleShowNotifications = () =>
    {
        setShowNotifications( prev => !prev );
        setShowReminders( false );
    };

    useEffect( () =>
    {
        const handleClickOutside = ( event ) =>
        {
            if (
                notificationRef.current &&
                !notificationRef.current.contains( event.target ) &&
                remindersRef.current &&
                !remindersRef.current.contains( event.target )
            )
            {
                setShowNotifications( false );
                setShowReminders( false );
            }
        };

        document.addEventListener( "mousedown", handleClickOutside );

        return () =>
        {
            document.removeEventListener( "mousedown", handleClickOutside );
        };
    }, [] );

    const { isAuthenticated } = useSelector( ( state ) => state.auth );
    const { user } = useSelector( ( state ) => state.user );

    return (
        <>
            <div
                className="px-10 py-4 flex relative w-full justify-between bg-white"
                style={ {
                    boxShadow: "0 1px 0 #efefef, 0 2px 8px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.2s ease",
                } }
            >
                {/* Search Bar */ }
                <div
                    className="search-input-wrap flex gap-2 items-center bg-[#EFEFEF] px-3 rounded-lg"
                    style={ { minWidth: 200 } }
                >
                    <div className="flex justify-center items-center">
                        <img
                            className="w-3"
                            src={ searchIcon }
                            alt=""
                            style={ { transition: "opacity 0.2s", opacity: 0.6 } }
                        />
                    </div>
                    <input
                        className="border-0 mt-1 outline-0 text-[13px] placeholder:text-[13px] bg-transparent w-full"
                        style={ {
                            color: "#000",
                            opacity: 0.8,
                            transition: "opacity 0.2s",
                        } }
                        type="text"
                        placeholder="Search here..."
                    />
                </div>

                <div className="flex justify-between pl-10">
                    <div className="flex items-center gap-7">
                        <div className="flex gap-2">

                            {/* Reminders */ }
                            <div className="relative">
                                <Tooltip title="Reminder">
                                    <div
                                        onClick={ handleShowReminders }
                                        className="nav-icon-btn w-9 h-9 relative cursor-pointer bg-[#EFEFEF] rounded-lg flex justify-center items-center"
                                    >
                                        <img
                                            className="w-4.5"
                                            src={ chronometerIcon }
                                            alt=""
                                            style={ {
                                                transition: "transform 0.2s ease",
                                                transform: showReminders ? "rotate(-15deg) scale(1.1)" : "rotate(0deg) scale(1)",
                                            } }
                                        />
                                        { reminders?.length !== 0 && (
                                            <span
                                                className="badge-dot bg-[#FA2626] absolute -top-0.5 -right-1 opacity-80 flex justify-center items-center text-[9px] text-white h-3.5 w-3.5 rounded-full"
                                            >
                                                { reminders?.length }
                                            </span>
                                        ) }
                                    </div>
                                </Tooltip>

                                <div
                                    ref={ remindersRef }
                                    className={ `dropdown ${ showReminders ? "show" : "" } bg-[#EFEFEF] z-999 max-w-73.5 h-77.5 w-65 absolute` }
                                >
                                    <div className="border-b border-b-[#ccc] px-3 py-1.25">
                                        <p className="text-black text-[14px] font-semibold">
                                            Task Reminders
                                        </p>
                                    </div>

                                    { reminders.slice( 0, 4 ).map( ( elem, index ) => (
                                        <div
                                            key={ index }
                                            className={ `notification-row flex relative p-2.5 border-b border-b-[#e1e8ed] gap-3 items-start ${ index % 2 !== 0 ? "bg-[#dadada]" : "" }` }
                                            style={ {
                                                animationDelay: `${ index * 0.05 }s`,
                                                animation: showReminders ? `fadeSlideDown 0.2s ease ${ index * 0.05 }s both` : "none",
                                            } }
                                        >
                                            <div>
                                                <p className="text-black font-semibold capitalize text-[14px]">
                                                    { elem.title }
                                                </p>
                                                <p className="text-[#333333] text-[12px] -mt-1 font-medium">
                                                    { elem.message }
                                                </p>
                                                <p className="text-[#666666] text-[13px] mt-1 font-medium">
                                                    { elem.dueDate }
                                                </p>
                                            </div>
                                            <div>
                                                <p
                                                    className={ `text-white inline-block text-[11px] px-1.5 absolute top-0 right-0 ${ elem.priority === "OVERDUE"
                                                        ? "bg-[rgba(250,38,38,.8)]"
                                                        : elem.priority === "TODAY"
                                                            ? "bg-[#18A322]"
                                                            : "bg-[#157FD7]"
                                                        }` }
                                                >
                                                    { elem.priority }
                                                </p>
                                            </div>
                                        </div>
                                    ) ) }
                                </div>
                            </div>

                            {/* Notifications */ }
                            <div className="relative">
                                <Tooltip title="Notifications">
                                    <div
                                        onClick={ handleShowNotifications }
                                        className="nav-icon-btn w-9 cursor-pointer relative h-9 bg-[#EFEFEF] rounded-lg flex justify-center items-center"
                                    >
                                        <img
                                            className="w-4"
                                            src={ bellIcon }
                                            alt=""
                                            style={ {
                                                transition: "transform 0.3s ease",
                                                transform: showNotifications ? "rotate(20deg) scale(1.1)" : "rotate(0deg) scale(1)",
                                            } }
                                        />
                                        { notifications.filter( n => n.status === "New" ).length !== 0 && (
                                            <span className="badge-dot bg-[#FA2626] absolute -top-0.5 -right-1 opacity-80 flex justify-center items-center text-[9px] text-white h-3.5 w-3.5 rounded-full">
                                                { notifications.filter( n => n.status === "New" ).length }
                                            </span>
                                        ) }
                                    </div>
                                </Tooltip>

                                <div
                                    ref={ notificationRef }
                                    className={ `dropdown ${ showNotifications ? "show" : "" } bg-[#EFEFEF] z-999 max-w-73.5 h-77.5 w-65 absolute` }
                                >
                                    <div className="border-b border-b-[#ccc] px-3 py-1.25">
                                        <p className="text-black text-[14px] font-semibold">
                                            { notifications.filter( n => n.status === "New" ).length } new messages
                                        </p>
                                    </div>

                                    { notifications.slice( 0, 4 ).map( ( elem, index ) => (
                                        <div
                                            key={ index }
                                            className={ `notification-row flex relative p-2.5 border-b border-b-[#e1e8ed] gap-3 items-start ${ index % 2 !== 0 ? "bg-[#dadada]" : "" }` }
                                            style={ {
                                                animation: showNotifications ? `fadeSlideDown 0.2s ease ${ index * 0.05 }s both` : "none",
                                            } }
                                        >
                                            <div>
                                                <img
                                                    className="min-w-8 object-cover min-h-8 w-8 h-8 rounded-full"
                                                    src={ elem.profileUrl || userAvatar }
                                                    alt=""
                                                    style={ { transition: "transform 0.2s ease" } }
                                                />
                                            </div>
                                            <div>
                                                <p className="text-black font-semibold capitalize text-[14px]">
                                                    { elem.username }
                                                </p>
                                                <p className="text-[#333333] text-[12px] -mt-1 font-medium">
                                                    { elem.message }
                                                </p>
                                                <p className="text-[#666666] text-[13px] mt-1 font-medium">
                                                    { elem.time }
                                                </p>
                                            </div>
                                            <div>
                                                <p
                                                    className={ `text-white inline-block text-[11px] px-1.5 absolute top-0 right-0 ${ elem.status === "New"
                                                        ? "bg-[#18A322]"
                                                        : elem.status === "Reply"
                                                            ? "bg-[rgba(250,38,38,.8)]"
                                                            : "bg-[#157FD7]"
                                                        }` }
                                                >
                                                    { elem.status }
                                                </p>
                                            </div>
                                        </div>
                                    ) ) }

                                    <div className="absolute bottom-0 w-full">
                                        <Button
                                            onClick={ () => navigate( "/chat" ) }
                                            sx={ {
                                                width: "100%",
                                                color: "black",
                                                fontSize: "12px",
                                                textAlign: "center",
                                                backgroundColor: "#dadada",
                                                textTransform: "capitalize",
                                                borderRadius: "0px",
                                                transition: "background 0.18s ease !important",
                                                "&:hover": {
                                                    backgroundColor: "#c8c8c8 !important",
                                                },
                                            } }
                                        >
                                            <span className="font-medium">View More</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Create Task */ }
                            <Tooltip title="Create Task">
                                <div
                                    onClick={ ( e ) =>
                                    {
                                        e.stopPropagation();
                                        toggleDrawer( true )( e );
                                    } }
                                    className="nav-icon-btn w-9 cursor-pointer h-9 bg-[#EFEFEF] rounded-lg flex justify-center items-center"
                                >
                                    <img
                                        className="w-3.5"
                                        src={ plusIcon }
                                        alt=""
                                        style={ { transition: "transform 0.2s ease" } }
                                    />
                                </div>
                            </Tooltip>
                        </div>

                        <div className="h-full w-px bg-[#efefef]"> </div>

                        { isAuthenticated ? (
                            <Tooltip title="Profile">
                                <div className="avatar-btn cursor-pointer" onClick={ () => navigate( "/profile" ) }>
                                    <Avatar
                                        src={ user?.profileImage == null ? userAvatar : user.profileImage }
                                        alt="User Profile"
                                        sx={ {
                                            width: 35,
                                            height: 35,
                                            cursor: "pointer",
                                            objectFit: "cover",
                                        } }
                                    />
                                </div>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Login">
                                <div
                                    onClick={ () => navigate( "/signin" ) }
                                    className="nav-icon-btn w-9 cursor-pointer h-9 bg-[#EFEFEF] rounded-lg flex justify-center items-center"
                                >
                                    <img className="w-4" src={ logoutIcon } alt="" />
                                </div>
                            </Tooltip>
                        ) }
                    </div>
                </div>
            </div>

            <CreateNewTaskForm toggleDrawer={ toggleDrawer } open={ open } />
        </>
    );
};

export default Navbar;