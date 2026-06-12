import React, { useEffect, useRef, useState } from "react";
import { Drawer, IconButton, CircularProgress, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import
    {
        getComments,
        addComment,
        deleteComment,
        clearComments,
        selectComments,
        selectCLoading,
        selectCError,
        selectCSending,
        selectCSendError,
    } from "../../redux/member/commentSlice";
import userAvatar from "../../assets/userAvatar.png";

const formatDate = ( iso ) =>
    new Date( iso ).toLocaleString( "en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
    } );

const CommentBubble = ( {
    comment,
    currentUserId,
    userRole,
    taskId,
    dispatch,
} ) =>
{
    const isOwner = comment.authorId === currentUserId || userRole === "ADMIN";

    const handleDelete = () =>
    {
        dispatch( deleteComment( { taskId, commentId: comment.id } ) );
    };

    return (
        <div className="flex gap-3 group">
            <img
                src={ comment.authorImage || userAvatar }
                alt={ comment.authorName }
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-gray-800 truncate">
                        { comment.authorName }
                    </span>
                    <span className="text-[11px] text-gray-400 shrink-0">
                        { formatDate( comment.createdAt ) }
                    </span>
                </div>
                <p className="text-[13px] text-gray-700 mt-0.5 leading-relaxed wrap-break-word">
                    { comment.content }
                </p>
            </div>

            { isOwner && (
                <Tooltip title="Delete comment">
                    <button
                        onClick={ handleDelete }
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-red-400 hover:text-red-600 shrink-0 mt-0.5"
                    >
                        Delete
                    </button>
                </Tooltip>
            ) }
        </div>
    );
};

const CommentDrawer = ( { open, onClose, task, currentUserId, userRole } ) =>
{
    const dispatch = useDispatch();
    const taskId = task?.id;

    const comments = useSelector( selectComments( taskId ) );
    const loading = useSelector( selectCLoading( taskId ) );
    const error = useSelector( selectCError( taskId ) );
    const sending = useSelector( selectCSending );
    const sendError = useSelector( selectCSendError );

    const [ text, setText ] = useState( "" );
    const bottomRef = useRef( null );

    const canComment =
        userRole === "ADMIN" ||
        task?.assignedTo?.some( ( u ) => u.id === currentUserId );

    useEffect( () =>
    {
        if ( !open || !taskId ) return;
        dispatch( getComments( taskId ) );

        return () => dispatch( clearComments( taskId ) );
    }, [ open, taskId, dispatch ] );

    useEffect( () =>
    {
        bottomRef.current?.scrollIntoView( { behavior: "smooth" } );
    }, [ comments.length ] );

    const handleSend = () =>
    {
        const trimmed = text.trim();
        if ( !trimmed || sending ) return;
        dispatch( addComment( { taskId, content: trimmed } ) );
        setText( "" );
    };

    const handleKeyDown = ( e ) =>
    {
        if ( e.key === "Enter" && !e.shiftKey )
        {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Drawer anchor="right" open={ open } onClose={ onClose }>
            <div className="w-95 h-full flex flex-col bg-white">
                {/* ── header ── */ }
                <div className="px-5 py-4 border-b flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                            Comments
                        </p>
                        <h2 className="text-[15px] font-semibold text-gray-800 mt-0.5 leading-tight truncate">
                            { task?.title }
                        </h2>
                    </div>
                    <IconButton size="small" onClick={ onClose }>
                        <span className="text-gray-400 text-xl leading-none">✕</span>
                    </IconButton>
                </div>

                <div className="h-0.5 w-full bg-black opacity-30" />

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                    { loading && (
                        <div className="flex justify-center py-10">
                            <CircularProgress size={ 24 } sx={ { color: "#497AF5" } } />
                        </div>
                    ) }

                    { error && !loading && (
                        <p className="text-center text-[13px] text-red-400 py-4">{ error }</p>
                    ) }

                    { !loading && !error && comments.length === 0 && (
                        <p className="text-center text-[13px] text-gray-400 py-10">
                            No comments yet.{ canComment ? " Be the first!" : "" }
                        </p>
                    ) }

                    { !loading &&
                        comments.map( ( c ) => (
                            <CommentBubble
                                key={ c.id }
                                comment={ c }
                                currentUserId={ currentUserId }
                                userRole={ userRole }
                                taskId={ taskId }
                                dispatch={ dispatch }
                            />
                        ) ) }

                    <div ref={ bottomRef } />
                </div>

                { canComment ? (
                    <div className="px-5 py-4 border-t">
                        <div className="flex gap-2 items-end">
                            <textarea
                                rows={ 1 }
                                value={ text }
                                onChange={ ( e ) => setText( e.target.value ) }
                                onKeyDown={ handleKeyDown }
                                placeholder="Write a comment… (Enter to send)"
                                className="flex-1 resize-none text-[13px] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-black transition-colors"
                            />
                            <button
                                onClick={ handleSend }
                                disabled={ !text.trim() || sending }
                                className="h-9 px-4 rounded-lg  bg-black text-white text-[13px] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black transition-colors shrink-0"
                            >
                                { sending ? "…" : "Send" }
                            </button>
                        </div>

                        { sendError && (
                            <p className="text-[11px] text-red-400 mt-1">{ sendError }</p>
                        ) }
                        {/* <p className="text-[11px] text-gray-400 mt-1">
                            Shift+Enter for new line
                        </p> */}
                    </div>
                ) : (
                    <div className="px-5 py-4 border-t">
                        <p className="text-[12px] text-gray-400 text-center">
                            Only assigned members or admins can comment.
                        </p>
                    </div>
                ) }
            </div>
        </Drawer>
    );
};

export default CommentDrawer;
