import React, { useEffect, useState } from "react";
import searchIcon from "../../assets/search.png";
import chevronIcon from "../../assets/chevron.png";
import { IconButton } from "@mui/material";
import DateAndTask from "./DateAndTask";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksCalendar, fetchTasksByDateRange } from "../../redux/member/taskSlice";

const Calendar = () =>
{
    const dispatch = useDispatch();
    const { calendarTasks, loadingCalendar, tasksByDate } = useSelector( ( state ) => state.task );

    const currentDate = new Date();
    const [ currentMonth, setCurrentMonth ] = useState( currentDate.getMonth() );
    const [ currentYear, setCurrentYear ] = useState( currentDate.getFullYear() );

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysInMonth = new Date( currentYear, currentMonth + 1, 0 ).getDate();
    const firstDayOfMonth = new Date( currentYear, currentMonth, 1 ).getDay();
    const daysInPrevMonth = new Date( currentYear, currentMonth, 0 ).getDate();

    useEffect( () =>
    {
        // Fetch task counts
        dispatch( fetchTasksCalendar( { month: currentMonth + 1, year: currentYear } ) );

        // Fetch full task details for the month
        dispatch( fetchTasksByDateRange( { month: currentMonth + 1, year: currentYear } ) );
    }, [ dispatch, currentMonth, currentYear ] );

    const prevMonthDays = Array.from( { length: firstDayOfMonth }, ( _, i ) =>
    {
        return {
            date: daysInPrevMonth - ( firstDayOfMonth - 1 - i ),
            isPrevMonth: true,
        };
    } );

    const currentMonthDates = Array.from( { length: daysInMonth }, ( _, i ) =>
    {
        return { date: i + 1, isPrevMonth: false, isNextMonth: false };
    } );

    const calendarDays = [ ...prevMonthDays, ...currentMonthDates ];

    const totalCells = Math.ceil( calendarDays.length / 7 ) * 7;
    const nextMonthDaysNeeded = totalCells - calendarDays.length;

    const nextMonthDays = Array.from( { length: nextMonthDaysNeeded }, ( _, i ) =>
    {
        return { date: i + 1, isNextMonth: true };
    } );

    const allDays = [ ...calendarDays, ...nextMonthDays ];

    const weeks = [];
    for ( let i = 0; i < allDays.length; i += 7 )
    {
        weeks.push( allDays.slice( i, i + 7 ) );
    }

    const handlePrevMonth = () =>
    {
        if ( currentMonth === 0 )
        {
            setCurrentMonth( 11 );
            setCurrentYear( currentYear - 1 );
        } else
        {
            setCurrentMonth( currentMonth - 1 );
        }
    };

    const handleNextMonth = () =>
    {
        if ( currentMonth === 11 )
        {
            setCurrentMonth( 0 );
            setCurrentYear( currentYear + 1 );
        } else
        {
            setCurrentMonth( currentMonth + 1 );
        }
    };

    const renderDay = ( dayObj ) =>
    {
        if ( !dayObj )
        {
            return <div className="w-[14.28%] min-h-25"></div>;
        }

        const { date, isPrevMonth, isNextMonth } = dayObj;

        let taskCount = 0;
        let tasksForDate = [];

        if ( !isPrevMonth && !isNextMonth && calendarTasks )
        {
            const dateKey = `${ currentYear }-${ String( currentMonth + 1 ).padStart( 2, '0' ) }-${ String( date ).padStart( 2, '0' ) }`;
            taskCount = calendarTasks[ dateKey ] || 0;

            // Get full task details for this date
            tasksForDate = tasksByDate?.[ dateKey ] || [];
        }

        const hasTask = taskCount > 0;

        return (
            <DateAndTask
                key={ `${ isPrevMonth ? 'prev' : isNextMonth ? 'next' : 'current' }-${ date }` }
                date={ date }
                hasTask={ hasTask }
                isPrevMonth={ isPrevMonth || isNextMonth }
                taskCount={ taskCount }
                tasks={ tasksForDate }
                monthYear={ `${ monthNames[ currentMonth ] } ${ currentYear }` }
            />
        );
    };

    return (
        <>
            <div className="mt-4 mx-8 relative">
                <div className="bg-white shadow flex justify-between items-center rounded-lg px-5 py-2.5">
                    <div className="flex gap-2 items-center">
                        <div className="bg-[#EFEFEF] h-8 w-8 rounded-lg flex justify-center items-center">
                            <img className="w-3" src={ searchIcon } alt="" />
                        </div>
                        <input
                            className="placeholder:text-[#000000] border-0 mt-1 outline-0 text-[13px] placeholder:text-[13px] opacity-80"
                            type="text"
                            placeholder="Search task, project..."
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow mt-6 px-6 py-5">
                    <div className="flex gap-6 items-center justify-center">
                        <IconButton
                            onClick={ handlePrevMonth }
                            sx={ {
                                width: 35,
                                height: 35,
                                backgroundColor: "#000",
                                cursor: "pointer",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                "&:hover": {
                                    backgroundColor: "#000",
                                },
                            } }
                        >
                            <img className="w-6" src={ chevronIcon } alt="" />
                        </IconButton>
                        <p className="text-[15px] font-medium">
                            { monthNames[ currentMonth ] } { currentYear }
                        </p>
                        <IconButton
                            onClick={ handleNextMonth }
                            sx={ {
                                width: 35,
                                height: 35,
                                backgroundColor: "#000",
                                cursor: "pointer",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                "&:hover": {
                                    backgroundColor: "#000",
                                },
                            } }
                        >
                            <img className="w-6 rotate-180" src={ chevronIcon } alt="" />
                        </IconButton>
                    </div>

                    <div className="flex justify-between mt-6 border-[rgba(200,200,200,.6)] border-t pt-5">
                        { [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ].map( ( day ) => (
                            <p
                                key={ day }
                                className="opacity-70 font-medium text-[13px] uppercase w-[14.28%] text-center"
                            >
                                { day }
                            </p>
                        ) ) }
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow mt-4 px-5 py-6">
                    { loadingCalendar ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Loading calendar...</p>
                        </div>
                    ) : (
                        weeks.map( ( week, weekIndex ) => (
                            <div key={ weekIndex } className="flex gap-3 mb-3 last:mb-0">
                                { week.map( ( day ) => renderDay( day ) ) }
                            </div>
                        ) )
                    ) }
                </div>
            </div>
        </>
    );
};

export default Calendar;