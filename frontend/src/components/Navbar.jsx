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
import { useDispatch, useSelector } from "react-redux";
import
{
    clearNotifications,
    markAllRead,
    fetchNotifications,
    clearNotificationsFromDb
} from "../redux/member/notificationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import
{
    faCheck,
    faArrowsRotate,
    faClipboard,
    faComment,
} from "@fortawesome/free-solid-svg-icons";


const Navbar = () =>
{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ open, setOpen ] = useState( false );
    const [ showNotifications, setShowNotifications ] = useState( false );
    const { isAuthenticated } = useSelector( ( state ) => state.auth );
    const [ showReminders, setShowReminders ] = useState( false );

    const notificationRef = useRef( null );
    const remindersRef = useRef( null );

    const { reminders } = useSelector( ( state ) => state.reminder );
    const { notifications } = useSelector( ( state ) => state.notification );
    const { user } = useSelector( ( state ) => state.user );

    const unreadCount = notifications.filter( ( n ) => !n.read ).length;

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

    useEffect( () =>
    {
        if ( isAuthenticated )
        {
            dispatch( fetchNotifications() );
        }
    }, [ isAuthenticated, dispatch ] );

    const handleShowReminders = () =>
    {
        setShowReminders( ( prev ) => !prev );
        setShowNotifications( false );
    };


    const handleShowNotifications = () =>
    {
        console.log( "Bell Clicked" );

        if ( showNotifications )
        {
            console.log( "Closing by bell" );
            setShowNotifications( false );
            dispatch( clearNotificationsFromDb() );
            return;
        }

        console.log( "Opening" );
        setShowNotifications( true );
        setShowReminders( false );
        dispatch( markAllRead() );
    };

    useEffect( () =>
    {
        const handleClickOutside = ( event ) =>
        {
            const clickedOutsideNotifications =
                notificationRef.current &&
                !notificationRef.current.contains( event.target );

            const clickedOutsideReminders =
                remindersRef.current &&
                !remindersRef.current.contains( event.target );

            if ( clickedOutsideNotifications && clickedOutsideReminders )
            {
                if ( showNotifications )
                {
                    console.log( "Closing by outside click" );
                    dispatch( clearNotificationsFromDb() );
                }

                setShowNotifications( false );
                setShowReminders( false );
            }
        };

        document.addEventListener( "mousedown", handleClickOutside );

        return () =>
        {
            document.removeEventListener( "mousedown", handleClickOutside );
        };
    }, [ showNotifications, dispatch ] );

    const getNotificationBadgeText = ( elem ) =>
    {
        switch ( elem.type )
        {
            case "TASK_STATUS":
                return "Task";

            case "COMMENT":
                return "Comment";

            case "CHAT":
                return "Message";

            default:
                return "Notification";
        }
    };

    const getNotificationIcon = ( elem ) =>
    {
        if ( elem.type === "TASK_STATUS" )
        {
            return elem.newStatus === "DONE"
                ? faCheck
                : elem.newStatus === "IN_PROGRESS"
                    ? faArrowsRotate
                    : faClipboard;
        }

        if ( elem.type === "COMMENT" )
        {
            return faComment;
        }

        return null;
    };

    return (
        <>
            <div
                className="px-10 py-4 flex relative w-full justify-between bg-white"
                style={ {
                    boxShadow: "0 1px 0 #efefef, 0 2px 8px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.2s ease",
                } }
            >
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
                                                transform: showReminders
                                                    ? "rotate(-15deg) scale(1.1)"
                                                    : "rotate(0deg) scale(1)",
                                            } }
                                        />
                                        { reminders?.length > 0 && (
                                            <span className="badge-dot bg-[#FA2626] absolute -top-0.5 -right-1 opacity-80 flex justify-center items-center text-[9px] text-white h-3.5 w-3.5 rounded-full">
                                                { reminders?.length > 9 ? "9+" : reminders?.length }
                                            </span>
                                        ) }
                                    </div>
                                </Tooltip>

                                <div
                                    ref={ remindersRef }
                                    className={ `dropdown ${ showReminders ? "show" : ""
                                        } bg-[#EFEFEF] z-999 max-w-73.5 h-77.5 w-65 absolute` }
                                >
                                    <div className="border-b border-b-[#ccc] px-3 py-1.25">
                                        <p className="text-black text-[14px] font-semibold">
                                            Task Reminders
                                        </p>
                                    </div>

                                    { reminders?.length === 0 ? (
                                        <p className="text-center text-[12px] text-gray-400 py-8">
                                            No reminders yet
                                        </p>
                                    ) : (
                                        reminders?.slice( 0, 4 ).map( ( elem, index ) => (
                                            <div
                                                key={ index }
                                                className={ `notification-row flex relative p-2.5 border-b border-b-[#e1e8ed] gap-3 items-start ${ index % 2 !== 0 ? "bg-[#dadada]" : ""
                                                    }` }
                                                style={ {
                                                    animationDelay: `${ index * 0.05 }s`,
                                                    animation: showReminders
                                                        ? `fadeSlideDown 0.2s ease ${ index * 0.05
                                                        }s both`
                                                        : "none",
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
                                        ) )
                                    ) }
                                </div>
                            </div>

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
                                                transform: showNotifications
                                                    ? "rotate(20deg) scale(1.1)"
                                                    : "rotate(0deg) scale(1)",
                                            } }
                                        />

                                        { unreadCount > 0 && (
                                            <span className="badge-dot bg-[#FA2626] absolute -top-0.5 -right-1 opacity-80 flex justify-center items-center text-[9px] text-white h-3.5 w-3.5 rounded-full">
                                                { unreadCount > 9 ? "9+" : unreadCount }
                                            </span>
                                        ) }
                                    </div>
                                </Tooltip>

                                <div
                                    ref={ notificationRef }
                                    className={ `dropdown ${ showNotifications ? "show" : ""
                                        } bg-[#EFEFEF] z-999 max-w-73.5 h-77.5 w-65 absolute` }
                                >
                                    <div className="border-b border-b-[#ccc] px-3 py-1.25">
                                        <p className="text-black text-[14px] font-semibold">
                                            { unreadCount } new notification
                                            { unreadCount !== 1 ? "s" : "" }
                                        </p>
                                    </div>

                                    { notifications.length === 0 ? (
                                        <p className="text-center text-[12px] text-gray-400 py-8">
                                            No notifications yet
                                        </p>
                                    ) : (
                                        notifications.slice( 0, 4 ).map( ( elem, index ) =>
                                        {
                                            const icon = getNotificationIcon( elem );

                                            return (
                                                <div
                                                    key={ elem.id || index }
                                                    className={ `notification-row flex relative p-3 border-b border-[#ECECEC] gap-3 items-start transition-colors hover:bg-[#F8F9FA] ${ !elem.read ? "bg-[#FAFAFA]" : "bg-white"
                                                        }` }
                                                    style={ {
                                                        animation: showNotifications
                                                            ? `fadeSlideDown 0.2s ease ${ index * 0.05 }s both`
                                                            : "none",
                                                    } }
                                                >
                                                    {/* Icon */ }
                                                    <div>
                                                        { icon ? (
                                                            <div className="min-w-8 min-h-8 w-8 h-8 rounded-full flex items-center justify-center bg-[#F3F4F6] text-[#555] text-[12px] border border-[#E5E7EB]">
                                                                <FontAwesomeIcon icon={ icon } />
                                                            </div>
                                                        ) : (
                                                            <img
                                                                className="min-w-8 object-cover min-h-8 w-8 h-8 rounded-full border border-[#E5E7EB]"
                                                                src={ elem.profileUrl || userAvatar }
                                                                alt=""
                                                            />
                                                        ) }
                                                    </div>

                                                    {/* Content */ }
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[#111827] font-semibold text-[13px] truncate">
                                                            { elem.title || elem.username }
                                                        </p>

                                                        <p className="text-[#6B7280] text-[12px] leading-relaxed mt-0.5">
                                                            { elem.body || elem.message }
                                                        </p>

                                                        <p className="text-[#9CA3AF] text-[11px] mt-1">
                                                            { elem.createdAt
                                                                ? new Date( elem.createdAt ).toLocaleTimeString( [], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                } )
                                                                : elem.time }
                                                        </p>
                                                    </div>

                                                    {/* Badge */ }
                                                    <p
                                                        className={ `inline-block text-[10px] px-2 py-0.5 rounded-full absolute top-2 right-2 font-medium ${ !elem.read
                                                            ? "bg-[#111827] text-white"
                                                            : "bg-[#F3F4F6] text-[#666]"
                                                            }` }
                                                    >
                                                        { getNotificationBadgeText( elem ) }
                                                    </p>
                                                </div>
                                            );
                                        } )
                                    ) }
                                    <div className="absolute bottom-0 w-full">
                                        <Button
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

                            <Tooltip
                                title={
                                    user?.role === "MEMBER"
                                        ? "Only Admin can create tasks"
                                        : "Create Task"
                                }
                            >
                                <div
                                    onClick={ ( e ) =>
                                    {
                                        if ( user?.role === "MEMBER" ) return;
                                        e.stopPropagation();
                                        toggleDrawer( true )( e );
                                    } }
                                    className={ `w-9 h-9 rounded-lg flex justify-center items-center ${ user?.role === "MEMBER"
                                        ? "bg-[#EFEFEF] opacity-50 cursor-not-allowed"
                                        : "nav-icon-btn bg-[#EFEFEF] cursor-pointer"
                                        }` }
                                >
                                    <img className="w-3.5" src={ plusIcon } alt="" />
                                </div>
                            </Tooltip>
                        </div>

                        <div className="h-full w-px bg-[#efefef]"> </div>

                        { isAuthenticated ? (
                            <Tooltip title="Profile">
                                <div
                                    className="avatar-btn cursor-pointer"
                                    onClick={ () => navigate( "/profile" ) }
                                >
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