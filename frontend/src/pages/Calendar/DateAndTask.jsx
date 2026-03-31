import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DateAndTask = ( { date, isPrevMonth, hasTask, taskCount, tasks, monthYear } ) =>
{
    const [ openModal, setOpenModal ] = useState( false );

    const handleOpenModal = () =>
    {
        if ( hasTask && tasks && tasks.length > 0 )
        {
            setOpenModal( true );
        }
    };

    const handleCloseModal = () =>
    {
        setOpenModal( false );
    };

    return (
        <>
            <div
                onClick={ handleOpenModal }
                className={ `w-[14.28%] border border-[rgba(200,200,200,0.8)] rounded-lg px-4 py-4 ${ hasTask ? 'bg-[rgba(217,217,217,0.1)] cursor-pointer hover:bg-[rgba(217,217,217,0.2)]' : ''
                    } ${ isPrevMonth ? 'opacity-60' : '' } transition-all` }
            >
                <h2
                    className={ `text-[20px] font-semibold ${ isPrevMonth ? 'text-[#969696]' : hasTask ? 'text-black' : 'text-[#969696]'
                        }` }
                >
                    { date }
                </h2>
                <p
                    className={ `text-[15px] mt-3 font-semibold ${ hasTask ? 'text-[#2D69FF]' : 'text-[#969696]'
                        }` }
                >
                    { taskCount } task{ taskCount !== 1 ? 's' : '' }
                </p>
            </div>

            {/* Modal to show tasks */ }
            <Dialog
                open={ openModal }
                onClose={ handleCloseModal }
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
                    <span className="text-lg font-semibold">
                        { date } { monthYear }
                    </span>
                    <IconButton onClick={ handleCloseModal }>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="space-y-3 py-2">
                        { tasks && tasks.length > 0 ? (
                            tasks.map( ( task, index ) => (
                                <div
                                    key={ task.id || index }
                                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-[16px] font-semibold text-black mb-2">
                                                { task.title }
                                            </h3>
                                            { task.description && (
                                                <p className="text-[14px] text-gray-600 mb-2">
                                                    { task.description }
                                                </p>
                                            ) }
                                            <div className="flex gap-3 items-center flex-wrap">
                                                { task.status && (
                                                    <span
                                                        className={ `px-3 py-1 rounded-full text-[12px] font-medium ${ task.status === "IN_PROGRESS"
                                                            ? "bg-[rgba(245,86,0,.2)] text-[#F55600]"
                                                            : task.status === "TODO"
                                                                ? "bg-[rgba(21,127,215,.2)] text-[#157FD7]"
                                                                : "bg-[rgba(24,163,34,.2)] text-[#18A322]"
                                                            }` }
                                                    >
                                                        { task.status }
                                                    </span>
                                                ) }
                                                { task.priority && (
                                                    <span
                                                        className={ `px-3 py-1 rounded-full text-[12px] font-medium ${ task.priority === "HIGH"
                                                            ? "bg-[rgba(129,39,255,.2)] text-[#8127FF]"
                                                            : task.priority === "LOW"
                                                                ? "bg-[rgba(245,86,0,.2)] text-[#F55600]"
                                                                : "bg-[rgba(21,127,215,.2)] text-[#157FD7]"
                                                            }` }
                                                    >
                                                        { task.priority }
                                                    </span>
                                                ) }
                                                { task.category && (
                                                    <span style={ {
                                                        color:
                                                            task.category === "DESIGN"
                                                                ? "#497AF5"
                                                                : task.category === "DEVELOPMENT"
                                                                    ? "rgba(250,38,38,.7)"
                                                                    : "#09C015",
                                                        backgroundColor:
                                                            task.category === "DESIGN"
                                                                ? "rgba(73,122,245,0.2)"
                                                                : task.category === "DEVELOPMENT"
                                                                    ? "rgba(222,23,23,.2)"
                                                                    : "rgba(1,255,18,.3)",
                                                    } } className="px-3 py-1 rounded-full text-[12px] font-medium">
                                                        { task.category }
                                                    </span>
                                                ) }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) )
                        ) : (
                            <p className="text-center text-gray-500 py-4">No tasks found</p>
                        ) }
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DateAndTask;