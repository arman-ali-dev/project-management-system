import { Button, MenuItem, Select } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CreateNewTaskForm from "./CreateNewTaskForm";

const TaskStatusCard = () =>
{
    const [ open, setOpen ] = React.useState( false );
    const [ visible, setVisible ] = useState( false );
    const [ hovered, setHovered ] = useState( false );
    const cardRef = useRef( null );

    useEffect( () =>
    {
        const observer = new IntersectionObserver(
            ( [ entry ] ) =>
            {
                if ( entry.isIntersecting )
                {
                    setTimeout( () => setVisible( true ), 200 );
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if ( cardRef.current ) observer.observe( cardRef.current );
        return () => observer.disconnect();
    }, [] );

    const toggleDrawer = ( value ) => ( event ) =>
    {
        if (
            event.type === "keydown" &&
            ( event.key === "Tab" || event.key === "Shift" )
        ) return;
        setOpen( value );
    };

    const statusItems = [
        { label: "To-Do", color: "#157FD7", bgColor: "rgba(21,127,215,.2)", count: "+12", width: "35%" },
        { label: "In Progress", color: "#F55600", bgColor: "rgba(245,86,0,.2)", count: "+30", width: "25%" },
        { label: "Done", color: "#18A322", bgColor: "rgba(24,163,34,.2)", count: "+12", width: "40%" },
    ];

    return (
        <>
            <div
                ref={ cardRef }
                onClick={ toggleDrawer( false ) }
                onMouseEnter={ () => setHovered( true ) }
                onMouseLeave={ () => setHovered( false ) }
                className="rounded-2xl flex flex-col justify-between px-6 py-5 bg-white h-full"
                style={ {
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                    transition: "opacity 0.55s ease 0.2s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.2s, box-shadow 0.25s ease",
                    boxShadow: hovered
                        ? "0 16px 40px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.05)"
                        : "0 2px 8px rgba(0,0,0,0.06)",
                } }
            >
                <div>
                    {/* Header */ }
                    <div className="flex justify-between items-center">
                        <h3 className="text-[16px] font-medium" style={ { opacity: 0.85 } }>
                            Task Status
                        </h3>
                        <Select
                            defaultValue=""
                            displayEmpty
                            className="outline-none text-[13px] font-medium w-21.5"
                            sx={ {
                                height: "32px",
                                borderRadius: "8px",
                                backgroundColor: "#ffffff",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: "1px solid #E0E0E0",
                                    transition: "border-color 0.2s ease",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#BCBCBC",
                                },
                                "& .MuiSelect-select": {
                                    paddingLeft: "10px",
                                    paddingRight: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    opacity: ".8",
                                },
                                "& .MuiSvgIcon-root": {
                                    right: "2px",
                                    fontSize: "18px",
                                },
                            } }
                        >
                            <MenuItem value="" sx={ { fontSize: "13px" } }>Today</MenuItem>
                            <MenuItem value="status2" sx={ { fontSize: "13px" } }>This Week</MenuItem>
                            <MenuItem value="status3" sx={ { fontSize: "13px" } }>This Month</MenuItem>
                        </Select>
                    </div>

                    {/* Count */ }
                    <div className="mt-2">
                        <h3
                            className="font-semibold text-[25px]"
                            style={ {
                                opacity: 0.85,
                                transition: "color 0.2s ease",
                                color: hovered ? "#157FD7" : "#111",
                            } }
                        >
                            68
                        </h3>
                        <p className="font-medium text-[12px] -mt-0.5" style={ { opacity: 0.85 } }>
                            Task Right Now This Month
                        </p>
                    </div>

                    {/* Animated Progress Bar */ }
                    <div className="flex gap-1 mt-5 overflow-hidden rounded-sm">
                        { [
                            { width: "40%", color: "#18A322", delay: 0 },
                            { width: "35%", color: "#157FD7", delay: 80 },
                            { width: "25%", color: "#F55600", delay: 160 },
                        ].map( ( bar, i ) => (
                            <span
                                key={ i }
                                className="inline-block h-1.5"
                                style={ {
                                    width: visible ? bar.width : "0%",
                                    backgroundColor: bar.color,
                                    transition: `width 0.8s cubic-bezier(0.22,1,0.36,1) ${ bar.delay + 400 }ms`,
                                    borderRadius: i === 0 ? "2px 0 0 2px" : i === 2 ? "0 2px 2px 0" : "0",
                                } }
                            />
                        ) ) }
                    </div>

                    {/* Status Rows */ }
                    <div className="mt-7 space-y-3">
                        { statusItems.map( ( item, i ) => (
                            <div
                                key={ i }
                                className={ `flex justify-between items-center pb-2 ${ i < statusItems.length - 1 ? "border-b border-[#CEC6C6]" : "" }` }
                                style={ {
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? "translateX(0)" : "translateX(-10px)",
                                    transition: `opacity 0.4s ease ${ 500 + i * 80 }ms, transform 0.4s ease ${ 500 + i * 80 }ms`,
                                } }
                            >
                                <div className="flex gap-1.5 items-center">
                                    <span
                                        className="inline-block h-4 w-4 rounded-sm"
                                        style={ {
                                            backgroundColor: item.color,
                                            transition: "transform 0.2s ease",
                                            transform: hovered ? "rotate(5deg) scale(1.1)" : "rotate(0deg) scale(1)",
                                        } }
                                    />
                                    <p className="text-[13px] mt-0.5 font-medium">{ item.label }</p>
                                </div>
                                <div
                                    className="text-[11px] px-2 py-0.5 rounded-sm font-medium"
                                    style={ {
                                        color: item.color,
                                        backgroundColor: item.bgColor,
                                        transition: "transform 0.2s ease",
                                        transform: hovered ? "scale(1.05)" : "scale(1)",
                                    } }
                                >
                                    { item.count }
                                </div>
                            </div>
                        ) ) }
                    </div>
                </div>

                {/* CTA Button */ }
                <div>
                    <Button
                        onClick={ ( e ) =>
                        {
                            e.stopPropagation();
                            toggleDrawer( true )( e );
                        } }
                        fullWidth
                        sx={ {
                            textTransform: "capitalize",
                            backgroundColor: "#000",
                            border: "1px solid #000",
                            color: "#fff",
                            paddingX: "20px",
                            fontSize: "13px",
                            borderRadius: "5px",
                            transition: "background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease !important",
                            "&:hover": {
                                backgroundColor: "#222 !important",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                            },
                            "&:active": {
                                transform: "scale(0.97)",
                            },
                        } }
                    >
                        <span>Create New Task</span>
                    </Button>
                </div>
            </div>

            <CreateNewTaskForm toggleDrawer={ toggleDrawer } open={ open } />
        </>
    );
};

export default TaskStatusCard;