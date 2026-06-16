// src/components/Kanban/KanbanCard.jsx
import React, { useState, useEffect } from "react";
import chronometerIcon from "../../assets/chronometer.png";
import teamIcon from "../../assets/team.png";
import messageIcon from "../../assets/mes.png";
import { IconButton, Tooltip } from "@mui/material";
import plusIcon from "../../assets/plus.png";
import { Skeleton } from "@mui/material";
import { Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import AddMemberToTaskModal from "./AddMemberToTaskModal";
import CommentDrawer from "./Commentdrawer";
import SubtaskDrawer from "./SubtaskDrawer";
import { getSubtasks, selectSubtasks } from "../../redux/member/subtaskSlice";
import checkIcon from '../../assets/checklist.png'

const KanbanCard = ( { task, idx, currentUserId, userRole } ) =>
{
    const dispatch = useDispatch();
    const [ hovered, setHovered ] = useState( false );

    const [ addMemberOpen, setAddMemberOpen ] = useState( false );
    const [ commentOpen, setCommentOpen ] = useState( false );
    const [ subtaskOpen, setSubtaskOpen ] = useState( false );

    const canDrag =
        userRole === "ADMIN" ||
        task?.assignedTo.find( ( elem ) => elem.id == currentUserId );

    const subtasks = useSelector( selectSubtasks( task.id ) );

    useEffect( () =>
    {
        dispatch( getSubtasks( task.id ) );
    }, [ task.id, dispatch ] );

    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter( ( s ) => s.completed ).length;

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
                                    { new Date( task.dueDate.split( "T" )[ 0 ] ).toLocaleDateString(
                                        "en-US",
                                        { month: "short", day: "numeric", year: "numeric" },
                                    ) }
                                </span>
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
                                            className="w-4.5 h-4.5"
                                        />
                                        <span className="text-[#969696] text-[11px]">
                                            { task.assignedTo.length }
                                        </span>
                                    </div>

                                    {/* Comments */ }
                                    <Tooltip title="View comments">
                                        <button
                                            onClick={ () => setCommentOpen( true ) }
                                            className="flex gap-1.5 items-center hover:opacity-70 transition-opacity"
                                        >
                                            <img
                                                src={ messageIcon }
                                                alt="message icon"
                                                className="w-3 h-3"
                                            />
                                            <span className="text-[#969696] text-[11px]">
                                                { task.assignedTo.length }
                                            </span>
                                        </button>


                                    </Tooltip>

                                    <Tooltip title="View subtasks">
                                        <button
                                            onClick={ () => setSubtaskOpen( true ) }
                                            className="flex gap-1.5 items-center hover:opacity-70 transition-opacity"
                                        >
                                            <img
                                                src={ checkIcon }
                                                alt="message icon"
                                                className="w-3 h-3"
                                            />
                                            { totalSubtasks > 0 && (
                                                <span
                                                    className={ `text-[11px] font-medium text-[#969696]` }
                                                >
                                                    { completedSubtasks }/{ totalSubtasks }
                                                </span>
                                            ) }
                                        </button>
                                    </Tooltip>
                                </div>

                                <div className="flex">
                                    <IconButton
                                        onClick={ () => setAddMemberOpen( true ) }
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
                                            "&:hover": { backgroundColor: "#EFEFEF" },
                                        } }
                                    >
                                        <img className="w-3" src={ plusIcon } alt="" />
                                    </IconButton>

                                    { task.assignedTo.map( ( m, idx ) => (
                                        <Tooltip key={ m.id } title={ m.fullName }>
                                            <div
                                                key={ idx }
                                                className={ `min-w-8 min-h-8 w-8 h-8 rounded-full object-cover flex items-center justify-center text-white text-[13px] font-semibold ${ idx !== task.assignedTo?.length - 1 ? "-mr-3.5 z-50 border-white border-2" : "" }` }
                                                style={ {
                                                    backgroundColor: "#9c9b9b",
                                                    transition: `transform 0.2s ease ${ idx * 35 }ms`,
                                                    transform: hovered
                                                        ? "scale(1.12) translateY(-2px)"
                                                        : "scale(1) translateY(0)",
                                                } }
                                            >
                                                { m.fullName?.charAt( 0 ).toUpperCase() }
                                            </div>
                                        </Tooltip>
                                    ) ) }
                                </div>
                            </div>

                            <div className="h-10 w-0.5 rounded-md bg-[#497AF5] lineShadow absolute left-0 top-4" />
                        </div>
                    </div>
                ) }
            </Draggable>

            <AddMemberToTaskModal
                taskId={ task.id }
                alreadyAssignedMembers={ task.assignedTo }
                open={ addMemberOpen }
                handleClose={ () => setAddMemberOpen( false ) }
            />

            <CommentDrawer
                open={ commentOpen }
                onClose={ () => setCommentOpen( false ) }
                task={ task }
                currentUserId={ currentUserId }
                userRole={ userRole }
            />

            <SubtaskDrawer
                open={ subtaskOpen }
                onClose={ () => setSubtaskOpen( false ) }
                task={ task }
                currentUserId={ currentUserId }
                userRole={ userRole }
            />
        </>
    );
};

export const KanbanCardSkeleton = () => (
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

export default KanbanCard;