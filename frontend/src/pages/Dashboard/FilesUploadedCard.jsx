import React, { useEffect, useRef, useState } from "react";
import trendIcon from "../../assets/trend.png";
import { MenuItem, Select } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const FilesUploadedCard = () =>
{
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
                    setTimeout( () => setVisible( true ), 100 );
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if ( cardRef.current ) observer.observe( cardRef.current );
        return () => observer.disconnect();
    }, [] );

    return (
        <div
            ref={ cardRef }
            onMouseEnter={ () => setHovered( true ) }
            onMouseLeave={ () => setHovered( false ) }
            className="rounded-2xl px-6 py-5 bg-white h-full"
            style={ {
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.55s ease 0.1s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s, box-shadow 0.25s ease",
                boxShadow: hovered
                    ? "0 16px 40px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.05)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
            } }
        >
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex gap-3 items-center">
                        <h3
                            className="text-[19px] font-medium"
                            style={ { opacity: 0.85 } }
                        >
                            Files Uploaded
                        </h3>
                        <img
                            src={ trendIcon }
                            className="w-6 h-6"
                            alt=""
                            style={ {
                                opacity: 0.75,
                                transform: hovered ? "rotate(-10deg) scale(1.15)" : "rotate(0deg) scale(1)",
                                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                            } }
                        />
                    </div>
                    <p className="text-[13px] font-medium" style={ { opacity: 0.75 } }>
                        Overview of Last 6 Month Document Activity
                    </p>
                </div>

                <Select
                    defaultValue=""
                    displayEmpty
                    className="outline-none text-[13px] font-medium w-32.5"
                    sx={ {
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        transition: "box-shadow 0.2s ease",
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #E0E0E0",
                            transition: "border-color 0.2s ease",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#BCBCBC",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#2bb381",
                            borderWidth: "1.5px",
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
                    <MenuItem value="" sx={ { fontSize: "13px" } }>Last 6 Months</MenuItem>
                    <MenuItem value="status2" sx={ { fontSize: "13px" } }>Can View</MenuItem>
                    <MenuItem value="status3" sx={ { fontSize: "13px" } }>Admin</MenuItem>
                </Select>
            </div>

            <div
                className="mt-5"
                style={ {
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
                } }
            >
                <div className="flex gap-2 items-center">
                    <span
                        className="h-3.5 w-3.5 rounded-full inline-block"
                        style={ {
                            backgroundColor: "#18A322",
                            opacity: 0.9,
                            transform: hovered ? "scale(1.3)" : "scale(1)",
                            transition: "transform 0.25s ease",
                        } }
                    />
                    <p className="text-[15px] mt-px" style={ { opacity: 0.8 } }>Files Uploaded</p>
                </div>

                <LineChart
                    xAxis={ [ {
                        data: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun" ],
                        scaleType: "band",
                        disableTicks: true,
                    } ] }
                    margin={ { left: -10, right: 20, top: 20, bottom: 0 } }
                    series={ [ {
                        data: [ 70, 150, 220, 350, 420, 580 ],
                        area: true,
                        color: "#2bb381",
                        curve: "linear",
                        showMark: true,
                    } ] }
                    height={ 320 }
                    sx={ {
                        "& .MuiAreaElement-root": {
                            fill: "url(#gradient-green)",
                            opacity: 0.2,
                        },
                        "& .MuiLineElement-root": {
                            strokeWidth: 2,
                            transition: "stroke-width 0.2s ease",
                        },
                        "& .MuiMarkElement-root": {
                            stroke: "#2bb381",
                            fill: "#fff",
                            strokeWidth: 2,
                            transition: "r 0.2s ease",
                        },
                        "& .MuiMarkElement-root:hover": {
                            r: "6",
                        },
                    } }
                >
                    <defs>
                        <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2bb381" stopOpacity={ 0.8 } />
                            <stop offset="95%" stopColor="#2bb381" stopOpacity={ 0 } />
                        </linearGradient>
                    </defs>
                </LineChart>
            </div>
        </div>
    );
};

export default FilesUploadedCard;