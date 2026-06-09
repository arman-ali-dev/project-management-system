import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import layoutIcon from "../assets/layout.png";
import chartIcon from "../assets/chart.png";
import monitorIcon from "../assets/monitor.png";
import checklistIcon from "../assets/checklist.png";
import calenderIcon from "../assets/calendar.png";
import chatIcon from "../assets/chat.png";
import driveIcon from "../assets/drive.png";
import usersIcon from "../assets/users.png";
import logoutIcon from "../assets/logout.png";
import scoreIcon from "../assets/score.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/member/authSlice";

const manu = [
    { label: "Dashboard", icon: chartIcon, path: "/dashboard" },
    { label: "Projects", icon: monitorIcon, path: "/projects" },
    { label: "My Tasks", icon: checklistIcon, path: "/my-tasks" },
    { label: "Calender", icon: calenderIcon, path: "/calendar" },
    { label: "Chat", icon: chatIcon, path: "/chat" },
    { label: "Drive", icon: driveIcon, path: "/drive" },
    { label: "Users", icon: usersIcon, path: "/users" },
    { label: "Scores", icon: scoreIcon, path: "/scores" },
];

const Sidebar = () =>
{
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ isLoggingOut, setIsLoggingOut ] = useState( false );

    const { user } = useSelector( ( state ) => state.user );

    const handleLogout = () =>
    {
        setIsLoggingOut( true );
        setTimeout( () =>
        {
            dispatch( logout() );
            navigate( "/signin" );
        }, 300 );
    };

    const filteredMenu = manu.filter( ( item ) =>
    {
        if (
            ( item.path === "/users" && user?.role !== "ADMIN" ) ||
            ( item.path === "/dashboard" && user?.role !== "ADMIN" )
        )
        {
            return false;
        }
        return true;
    } );

    return (
        <>
            <div
                className="bg-white fixed left-0 top-0 h-screen w-76.25 z-50"
                style={ {
                    boxShadow: "2px 0 16px rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.3s ease",
                } }
            >
                {/* Header */ }
                <div className="flex items-center gap-12 border-[#efefef] border-r pl-3 pr-14 border-b h-17.25 shadow ">
                    <Link
                        className="text-[21px] font-bold"
                        style={ {
                            transition: "opacity 0.2s ease, letter-spacing 0.2s ease",
                        } }
                        onMouseEnter={ e => { e.currentTarget.style.opacity = "0.7"; } }
                        onMouseLeave={ e => { e.currentTarget.style.opacity = "1"; } }
                    >
                        <img
                            src="https://a2groups.org/assets/a2glogo-cf360e03.png"
                            alt="A2 Groups Logo"
                            className="w-28 h-18 object-contain"
                        />
                    </Link>

                    {/* <div
                        className="sidebar-logo-icon bg-black h-9 w-9 rounded-xl flex justify-center items-center"
                        style={ { cursor: "pointer" } }
                    >
                        <img className="w-4" src={ layoutIcon } alt="" />
                    </div> */}
                </div>

                {/* Nav Items */ }
                <ul className="px-6 mt-10 space-y-1">
                    { filteredMenu.map( ( item, idx ) =>
                    {
                        const isActive = location.pathname.startsWith( item.path );

                        return (
                            <li
                                key={ idx }
                                className={ `sidebar-item pl-5 py-3 relative rounded-lg ${ isActive ? "bg-[#EFEFEF] sidebar-item-active" : "" }` }
                                style={ {
                                    animationDelay: `${ idx * 0.06 }s`,
                                } }
                            >
                                <Link
                                    to={ item.path }
                                    className="flex items-center gap-3"
                                >
                                    <img
                                        className="sidebar-icon w-5"
                                        src={ item.icon }
                                        alt=""
                                        style={ {
                                            filter: isActive ? "brightness(0.7)" : "brightness(0.9)",
                                            transition: "filter 0.2s ease",
                                        } }
                                    />
                                    <span
                                        className="text-[15px] mt-0.5"
                                        style={ {
                                            fontWeight: isActive ? 600 : 400,
                                            transition: "font-weight 0.15s ease",
                                        } }
                                    >
                                        { item.label }
                                    </span>
                                </Link>
                            </li>
                        );
                    } ) }
                </ul>

                {/* Logout */ }
                <div className="px-6 absolute bottom-6 w-full border-[#efefef] border-t pt-6">
                    <div
                        onClick={ handleLogout }
                        className="logout-btn pl-5 py-3 relative cursor-pointer w-full rounded-lg bg-[#EFEFEF]"
                        style={ {
                            opacity: isLoggingOut ? 0 : 1,
                            transform: isLoggingOut ? "translateX(-10px)" : "translateX(0)",
                            transition: "opacity 0.3s ease, transform 0.3s ease",
                        } }
                    >
                        <div className="flex items-center gap-3">
                            <img
                                className="w-5"
                                src={ logoutIcon }
                                alt=""
                                style={ { transition: "transform 0.2s ease" } }
                            />
                            <span className="text-[15px]">Logout</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;