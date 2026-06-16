// src/components/Kanban/SubtaskDrawer.jsx
import React, { useEffect, useState } from "react";
import
{
    Drawer,
    IconButton,
    CircularProgress,
    Checkbox,
    Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import
{
    getSubtasks,
    addSubtask,
    toggleSubtaskComplete,
    deleteSubtask,
    clearSubtasks,
    selectSubtasks,
    selectSTLoading,
    selectSTError,
    selectSTSending,
    selectSTSendError,
} from "../../redux/member/subtaskSlice";
import userAvatar from "../../assets/userAvatar.png";



const SubtaskRow = ( { subtask, taskId, canToggle, canManage, dispatch } ) =>
{
    const handleToggle = () =>
    {
        if ( !canToggle ) return;
        dispatch( toggleSubtaskComplete( { taskId, subtaskId: subtask.id } ) );
    };

    const handleDelete = () =>
    {
        dispatch( deleteSubtask( { taskId, subtaskId: subtask.id } ) );
    };

    return (
        <div className="flex items-start gap-3 group py-2.5 border-b border-gray-100 last:border-0">
            <Checkbox
                checked={ subtask.completed }
                onChange={ handleToggle }
                disabled={ !canToggle }
                size="small"
                sx={ {
                    padding: 0,
                    mt: "1px",
                    color: "#d1d5db",
                    "&.Mui-checked": { color: "#09C015" },
                } }
            />

            <div className="flex-1 min-w-0">
                <p
                    className={ `text-[13px] leading-snug ${ subtask.completed ? "line-through text-gray-400" : "text-gray-800" }` }
                >
                    { subtask.title }
                </p>

                { subtask.assignedToName && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <img
                            src={ userAvatar }
                            alt={ subtask.assignedToName }
                            className="w-4 h-4 rounded-full object-cover"
                        />

                        <span className="text-[11px] text-gray-400">
                            { subtask.assignedToName }
                        </span>
                    </div>
                ) }
            </div>

            { canManage && (
                <Tooltip title="Delete subtask">
                    <button
                        onClick={ handleDelete }
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-red-400 hover:text-red-600 mt-1"
                    >
                        ✕
                    </button>
                </Tooltip>
            ) }
        </div>
    );
};

const SubTaskDrawer = ( { open, onClose, task, currentUserId, userRole } ) =>
{
    const dispatch = useDispatch();
    const taskId = task?.id;

    const subtasks = useSelector( selectSubtasks( taskId ) );
    const loading = useSelector( selectSTLoading( taskId ) );
    const error = useSelector( selectSTError( taskId ) );
    const sending = useSelector( selectSTSending );
    const sendError = useSelector( selectSTSendError );

    const [ title, setTitle ] = useState( "" );
    const [ assignedToId, setAssignedToId ] = useState( "" );

    const isAdmin = userRole === "ADMIN";

    const isAssignedToTask = task?.assignedTo?.some(
        ( u ) => u.id === currentUserId,
    );
    const canToggle = isAdmin || isAssignedToTask;
    const canManage = isAdmin; // add / delete

    useEffect( () =>
    {
        if ( !open || !taskId ) return;
        dispatch( getSubtasks( taskId ) );
        return () => dispatch( clearSubtasks( taskId ) );
    }, [ open, taskId, dispatch ] );

    const total = subtasks.length;
    const completed = subtasks.filter( ( s ) => s.completed ).length;
    const progress = total === 0 ? 0 : Math.round( ( completed / total ) * 100 );

    const handleAdd = () =>
    {
        const trimmed = title.trim();
        if ( !trimmed || sending ) return;
        dispatch(
            addSubtask( {
                taskId,
                title: trimmed,
                assignedToId: assignedToId || null,
            } ),
        );
        setTitle( "" );
        setAssignedToId( "" );
    };

    const handleKeyDown = ( e ) =>
    {
        if ( e.key === "Enter" )
        {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <Drawer anchor="right" open={ open } onClose={ onClose }>
            <div className="w-95 h-full flex flex-col bg-white">
                {/* ── header ── */ }
                <div className="px-5 py-4 border-b flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                            Subtasks
                        </p>
                        <h2 className="text-[15px] font-semibold text-gray-800 mt-0.5 leading-tight truncate">
                            { task?.title }
                        </h2>
                    </div>
                    <IconButton size="small" onClick={ onClose }>
                        <span className="text-gray-400 text-xl leading-none">✕</span>
                    </IconButton>
                </div>

                { total > 0 && (
                    <div className="px-5 py-3 border-b">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[12px] text-gray-500">
                                { completed } of { total } completed
                            </span>
                            <span className="text-[12px] font-semibold text-gray-700">
                                { progress }%
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#09C015] rounded-full transition-all duration-300"
                                style={ { width: `${ progress }%` } }
                            />
                        </div>
                    </div>
                ) }

                <div className="flex-1 overflow-y-auto px-5 py-3 chat-scroll">
                    { loading && (
                        <div className="flex justify-center py-10">
                            <CircularProgress size={ 24 } sx={ { color: "#497AF5" } } />
                        </div>
                    ) }

                    { error && !loading && (
                        <p className="text-center text-[13px] text-red-400 py-4">{ error }</p>
                    ) }

                    { !loading && !error && subtasks.length === 0 && (
                        <p className="text-center text-[13px] text-gray-400 py-10">
                            No subtasks yet.{ isAdmin ? " Add one below." : "" }
                        </p>
                    ) }

                    { !loading &&
                        subtasks.map( ( s ) => (
                            <SubtaskRow
                                key={ s.id }
                                subtask={ s }
                                taskId={ taskId }
                                canToggle={ canToggle }
                                canManage={ canManage }
                                dispatch={ dispatch }
                            />
                        ) ) }
                </div>

                { isAdmin ? (
                    <div className="px-5 py-4 border-t space-y-2">
                        <input
                            value={ title }
                            onChange={ ( e ) => setTitle( e.target.value ) }
                            onKeyDown={ handleKeyDown }
                            placeholder="Add a subtask…"
                            className="w-full text-[13px] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-black transition-colors"
                        />

                        <div className="flex gap-2">
                            <select
                                value={ assignedToId }
                                onChange={ ( e ) => setAssignedToId( e.target.value ) }
                                className="flex-1 text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 outline-none text-gray-600"
                            >
                                <option value="">Assign to </option>
                                { task?.assignedTo?.map( ( m ) => (
                                    <option key={ m.id } value={ m.id }>
                                        { m.fullName }
                                    </option>
                                ) ) }
                            </select>

                            <button
                                onClick={ handleAdd }
                                disabled={ !title.trim() || sending }
                                className="px-4 py-1.5 rounded-lg bg-black text-white text-[12px] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black transition-colors"
                            >
                                { sending ? "…" : "Add" }
                            </button>
                        </div>

                        { sendError && (
                            <p className="text-[11px] text-red-400">{ sendError }</p>
                        ) }
                    </div>
                ) : (
                    <div className="px-5 py-4 border-t">
                        <p className="text-[12px] text-gray-400 text-center">
                            { canToggle
                                ? "You can mark subtasks as complete."
                                : "Only admins can manage subtasks." }
                        </p>
                    </div>
                ) }
            </div>
        </Drawer>
    );
};

export default SubTaskDrawer;