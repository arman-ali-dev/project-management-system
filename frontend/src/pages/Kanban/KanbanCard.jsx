import React, { useState } from "react";
import chronometerIcon from "../../assets/chronometer.png";
import teamIcon from "../../assets/team.png";
import messageIcon from "../../assets/mes.png";
import { IconButton, Tooltip } from "@mui/material";
import plusIcon from "../../assets/plus.png";
import userAvatar from "../../assets/userAvatar.png";
import { Skeleton } from "@mui/material";
import { Draggable } from "@hello-pangea/dnd";
import AddMemberToTaskModal from "./AddMemberToTaskModal";

const KanbanCard = ( { task, idx, currentUserId, userRole } ) =>
{
    const [ open, setOpen ] = useState( false );

    const handleClose = () =>
    {
        setOpen( false );
    };

    const handleOpen = () =>
    {
        setOpen( true );
    };

    const canDrag =
        userRole === "ADMIN" ||
        task?.assignedTo.find( ( elem ) => elem.id == currentUserId );

    return (
        <>
            <Draggable
                isDragDisabled={ !canDrag }
                draggableId={ String( task.id ) }
                index={ idx }
            >
                { ( provided ) => (
                    <div
                        ref={ provided.innerRef }
                        { ...provided.draggableProps }
                        { ...provided.dragHandleProps }
                    >
                        <div className="border-[rgba(221,221,221,.7)] relative border px-5 py-4 rounded-md">
                            <h3 className="text-[14px] font-medium">
                                { idx + 1 }. { task.title }
                            </h3>
                            <p className="text-[12px] text-[#969696] mt-0.5 flex gap-3">
                                <span>
                                    { " " }
                                    { new Date( task.dueDate.split( "T" )[ 0 ] ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        },
                                    ) }
                                </span>{ " " }
                                <span> | </span>
                                <span className="flex items-center gap-1">
                                    <img
                                        src={ chronometerIcon }
                                        alt="chronometer icon"
                                        className="w-3 h-3 mr-1 inline-block"
                                    />
                                    { task.estimatedTime } Hours
                                </span>
                            </p>

                            <div className="space-x-2 mt-4">
                                <div
                                    style={ {
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
                                    } }
                                    className="text-[#497AF5] bg-[rgba(73,122,245,0.1)] px-3 py-2 rounded-md text-[12px] inline-block"
                                >
                                    { task.category }
                                </div>
                                <div className="text-[#E8D11E] bg-[rgba(240,222,80,0.2)] px-3 py-2 rounded-md text-[12px] inline-block">
                                    QA
                                </div>
                            </div>

                            <p className="text-[13px] font-medium mt-2.5">
                                { task?.description.split( " " ).slice( 0, 10 ).join( " " ) }
                                { task?.description.split( " " ).length > 10 && "..." }
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex gap-3 items-center">
                                    <div className="flex gap-1.5 items-center">
                                        <img
                                            src={ teamIcon }
                                            alt="team icon"
                                            className="w-4.5 h-4.5 "
                                        />
                                        <span className="text-[#969696] text-[11px]">
                                            { task.assignedTo.length }
                                        </span>
                                    </div>

                                    <div className="flex gap-1.5 items-center">
                                        <img
                                            src={ messageIcon }
                                            alt="message icon"
                                            className="w-3 h-3 "
                                        />
                                        <span className="text-[#969696] text-[11px]">0</span>
                                    </div>
                                </div>

                                <div className="flex">
                                    <IconButton
                                        onClick={ handleOpen }
                                        sx={ {
                                            width: 33,
                                            height: 33,
                                            backgroundColor: "#EFEFEF",
                                            cursor: "pointer",
                                            borderRadius: "50px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: "10px",
                                            "&:hover": {
                                                backgroundColor: "#EFEFEF",
                                            },
                                        } }
                                    >
                                        <img className="w-3" src={ plusIcon } alt="" />
                                    </IconButton>

                                    { task.assignedTo.map( ( member, idx ) => (
                                        <Tooltip title={ member.fullName }>
                                            <img
                                                className={ `w-8 h-8 cursor-default z-50 relative border-white  border rounded-full object-cover ${ idx !== task.assignedTo.length - 1 ? "-mr-4" : "" }` }
                                                src={ member?.profileImage || userAvatar }
                                                alt=""
                                            />
                                        </Tooltip>
                                    ) ) }
                                </div>
                            </div>

                            <div className="h-10 w-0.5 rounded-md bg-[#497AF5] lineShadow absolute left-0 top-4"></div>
                        </div>
                    </div>
                ) }
            </Draggable>

            <AddMemberToTaskModal
                taskId={ task.id }
                alreadyAssignedMembers={ task.assignedTo }
                open={ open }
                handleClose={ handleClose }
            />
        </>
    );
};

export const KanbanCardSkeleton = () =>
{
    return (
        <div className="border border-[rgba(221,221,221,.7)] px-5 py-4 rounded-md">
            <Skeleton variant="text" width="80%" height={ 22 } />
            <Skeleton variant="text" width="60%" height={ 16 } />

            <div className="flex gap-2 mt-4">
                <Skeleton variant="rounded" width={ 70 } height={ 28 } />
                <Skeleton variant="rounded" width={ 40 } height={ 28 } />
            </div>

            <Skeleton variant="text" width="100%" height={ 16 } className="mt-3" />
            <Skeleton variant="text" width="90%" height={ 16 } />

            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3">
                    <Skeleton variant="circular" width={ 24 } height={ 24 } />
                    <Skeleton variant="circular" width={ 24 } height={ 24 } />
                </div>

                <div className="flex gap-2">
                    <Skeleton variant="circular" width={ 32 } height={ 32 } />
                    <Skeleton variant="circular" width={ 32 } height={ 32 } />
                </div>
            </div>
        </div>
    );
};

export default KanbanCard;
