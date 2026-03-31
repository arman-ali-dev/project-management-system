import { Skeleton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import meIcon from "../../assets/me.png";
import Task from "./Task";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTasks, updateTaskStatus, updateTaskStatusLocal } from "../../redux/member/taskSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const SECTIONS = [
    { id: "TODO", label: "To-Do", color: "#157FD7", bg: "rgba(21,127,215,0.06)" },
    { id: "IN_PROGRESS", label: "Doing", color: "#F55600", bg: "rgba(245,86,0,0.06)" },
    { id: "DONE", label: "Done", color: "#18A322", bg: "rgba(24,163,34,0.06)" },
];


const useDragPortal = () =>
{
    const portalRef = useRef( null );

    if ( typeof document !== "undefined" && !portalRef.current )
    {
        const el = document.createElement( "div" );
        el.style.cssText = "position:fixed;top:0;left:0;z-index:9999;pointer-events:none;";
        document.body.appendChild( el );
        portalRef.current = el;
    }

    useEffect( () =>
    {
        return () =>
        {
            if ( portalRef.current && document.body.contains( portalRef.current ) )
            {
                document.body.removeChild( portalRef.current );
            }
        };
    }, [] );

    return portalRef.current;
};

// Wrap each Draggable child so it renders into the portal while dragging
const PortalAwareDraggable = ( { children, provided, snapshot } ) =>
{
    const portal = useDragPortal();
    const child = children( provided, snapshot );

    if ( snapshot.isDragging && portal )
    {
        return ReactDOM.createPortal( child, portal );
    }

    return child;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const TaskSkeleton = () => (
    <div className="space-y-2">
        { [ 1, 2, 3 ].map( ( i ) => (
            <div key={ i } className="bg-[#EFEFEF] w-full px-5 flex justify-between items-center py-2 rounded-xl">
                <div className="flex gap-7 items-center">
                    <Skeleton variant="rectangular" width={ 20 } height={ 20 } sx={ { borderRadius: "4px" } } />
                    <Skeleton variant="text" width={ 120 } height={ 20 } />
                </div>
                <Skeleton variant="text" width={ 150 } height={ 20 } />
                <Skeleton variant="text" width={ 100 } height={ 20 } />
                <div className="flex">
                    <Skeleton variant="circular" width={ 26 } height={ 26 } sx={ { marginRight: "-14px" } } />
                    <Skeleton variant="circular" width={ 26 } height={ 26 } />
                </div>
                <Skeleton variant="rectangular" width={ 80 } height={ 28 } sx={ { borderRadius: "6px" } } />
                <Skeleton variant="circular" width={ 36 } height={ 36 } />
            </div>
        ) ) }
    </div>
);

// ─── Section ──────────────────────────────────────────────────────────────────
const TaskSection = ( { sectionId, label, color, bg, tasks, loading, mounted, sectionIndex } ) =>
{
    const [ isDragOver, setIsDragOver ] = useState( false );

    return (
        <div
            className="mt-4 rounded-xl px-5 py-4"
            style={ {
                backgroundColor: isDragOver ? bg : "#fff",
                boxShadow: isDragOver
                    ? `0 0 0 2px ${ color }50, 0 8px 24px rgba(0,0,0,0.08)`
                    : "0 2px 8px rgba(0,0,0,0.06)",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: [
                    `opacity 0.45s ease ${ sectionIndex * 100 + 150 }ms`,
                    `transform 0.45s cubic-bezier(0.22,1,0.36,1) ${ sectionIndex * 100 + 150 }ms`,
                    "box-shadow 0.2s ease",
                    "background-color 0.2s ease",
                ].join( ", " ),
            } }
        >
            {/* Header */ }
            <div className="flex gap-2 items-center mb-3">
                <span style={ { width: 10, height: 10, borderRadius: "50%", backgroundColor: color, display: "inline-block", transition: "transform 0.2s", transform: isDragOver ? "scale(1.4)" : "scale(1)" } } />
                <p className="text-[15px] font-semibold">{ label }</p>
                <span className="text-[12px] font-semibold px-1.5 py-0.5 rounded-md" style={ { backgroundColor: `${ color }18`, color, minWidth: 22, textAlign: "center" } }>
                    { tasks?.length || 0 }
                </span>
            </div>

            {/* Body */ }
            { loading ? <TaskSkeleton /> : (
                <Droppable droppableId={ sectionId }>
                    { ( provided, snapshot ) =>
                    {
                        // sync without setState-during-render
                        if ( snapshot.isDraggingOver !== isDragOver )
                            setTimeout( () => setIsDragOver( snapshot.isDraggingOver ), 0 );

                        return (
                            <div
                                ref={ provided.innerRef }
                                { ...provided.droppableProps }
                                style={ {
                                    minHeight: 48,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    borderRadius: 8,
                                    padding: snapshot.isDraggingOver ? "4px" : 0,
                                    background: snapshot.isDraggingOver ? `${ color }0A` : "transparent",
                                    transition: "background 0.15s ease, padding 0.15s ease",
                                } }
                            >
                                { tasks?.map( ( task, index ) => (
                                    <Draggable
                                        key={ task.id }
                                        draggableId={ String( task.id ) }
                                        index={ index }
                                    >
                                        { ( provided, snapshot ) =>
                                        {
                                            const child = (
                                                <div
                                                    ref={ provided.innerRef }
                                                    { ...provided.draggableProps }
                                                    { ...provided.dragHandleProps }
                                                    // Keep DnD's style intact — only add borderRadius
                                                    style={ {
                                                        ...provided.draggableProps.style,
                                                        borderRadius: 12,
                                                    } }
                                                >
                                                    <Task task={ task } isDragging={ snapshot.isDragging } />
                                                </div>
                                            );

                                            // Portal: render dragging item on document.body to escape
                                            // any overflow:hidden / CSS transform on parent containers
                                            if ( snapshot.isDragging )
                                            {
                                                return ReactDOM.createPortal(
                                                    <div
                                                        ref={ provided.innerRef }
                                                        { ...provided.draggableProps }
                                                        { ...provided.dragHandleProps }
                                                        style={ {
                                                            ...provided.draggableProps.style,
                                                            borderRadius: 12,
                                                            // Slightly lift
                                                            filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.22))",
                                                        } }
                                                    >
                                                        <Task task={ task } isDragging={ true } />
                                                    </div>,
                                                    document.body
                                                );
                                            }

                                            return child;
                                        } }
                                    </Draggable>
                                ) ) }

                                { provided.placeholder }

                                { tasks?.length === 0 && (
                                    <p
                                        className="text-[13px] text-center py-3"
                                        style={ {
                                            color: snapshot.isDraggingOver ? color : "#bbb",
                                            border: `1.5px dashed ${ snapshot.isDraggingOver ? color + "80" : color + "40" }`,
                                            borderRadius: 10,
                                            fontWeight: snapshot.isDraggingOver ? 600 : 400,
                                            transition: "all 0.15s ease",
                                        } }
                                    >
                                        { snapshot.isDraggingOver ? "Drop here" : "No tasks" }
                                    </p>
                                ) }
                            </div>
                        );
                    } }
                </Droppable>
            ) }
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const MyTasks = () =>
{
    const dispatch = useDispatch();
    const [ mounted, setMounted ] = useState( false );

    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );
        if ( !token ) return;
        dispatch( fetchMyTasks() );
        requestAnimationFrame( () => setMounted( true ) );
    }, [ dispatch ] );

    const { tasks, loading } = useSelector( ( state ) => state.task );

    const byStatus = ( s ) => tasks?.filter( ( t ) => t.status === s ) ?? [];
    const tasksBySection = {
        TODO: byStatus( "TODO" ),
        IN_PROGRESS: byStatus( "IN_PROGRESS" ),
        DONE: byStatus( "DONE" ),
    };

    const onDragEnd = ( { destination, source, draggableId } ) =>
    {
        if ( !destination ) return;
        if ( destination.droppableId === source.droppableId && destination.index === source.index ) return;

        dispatch( updateTaskStatusLocal( { taskId: draggableId, status: destination.droppableId } ) );
        dispatch( updateTaskStatus( { taskId: draggableId, status: destination.droppableId } ) );
    };

    return (
        // DragDropContext must NOT be inside a CSS-transformed element.
        // Make sure no parent has transform/will-change/overflow:hidden.
        <DragDropContext onDragEnd={ onDragEnd }>
            <div
                className="mt-4 mx-8 relative"
                style={ { opacity: mounted ? 1 : 0, transition: "opacity 0.35s ease" } }
            >
                {/* Header */ }
                <div
                    className="bg-white flex items-center gap-2.5 rounded-lg px-5 py-2.5"
                    style={ {
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(-8px)",
                        transition: "opacity 0.4s ease, transform 0.4s ease",
                    } }
                >
                    <img className="w-7" src={ meIcon } alt="" />
                    <p className="text-[14px] font-semibold">My Tasks</p>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        { tasks?.length || 0 } total
                    </span>
                </div>

                { SECTIONS.map( ( s, i ) => (
                    <TaskSection
                        key={ s.id }
                        sectionId={ s.id }
                        label={ s.label }
                        color={ s.color }
                        bg={ s.bg }
                        tasks={ tasksBySection[ s.id ] }
                        loading={ loading }
                        mounted={ mounted }
                        sectionIndex={ i }
                    />
                ) ) }
            </div>
        </DragDropContext>
    );
};

export default MyTasks;