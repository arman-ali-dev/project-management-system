import React, { useEffect } from "react";
import { IconButton, Skeleton } from "@mui/material";
import speechIcon from "../../assets/speech.png";
import heartIcon from "../../assets/like.png";
import KanbanColumn from "./KanbanColumn";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import
{
    clearTasksProject,
    fetchTasksByProject,
    updateProjectTaskStatusLocal,
    updateTaskStatus,
} from "../../redux/member/taskSlice";
import { fetchProject } from "../../redux/member/projectSlice";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

const KanbanBoard = () =>
{
    const dispatch = useDispatch();
    const params = useParams();
    const { projectId } = params;

    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );
        if ( !token ) return;

        dispatch( fetchTasksByProject( projectId ) );
        dispatch( fetchProject( projectId ) );

        return () => dispatch( clearTasksProject() );
    }, [ projectId, dispatch ] );

    const { tasksByProject, loadingProjectTasks } = useSelector(
        ( state ) => state.task,
    );

    const todoTasks = tasksByProject?.filter( ( task ) => task.status === "TODO" );
    const doingTasks = tasksByProject?.filter(
        ( task ) => task.status === "IN_PROGRESS",
    );
    const reviewsTasks = tasksByProject?.filter(
        ( task ) => task.status === "REVIEW",
    );
    const doneTasks = tasksByProject?.filter( ( task ) => task.status === "DONE" );

    const { project, loading } = useSelector( ( state ) => state.project );

    const iconBtnStyle = {
        width: 36,
        height: 36,
        backgroundColor: "#EFEFEF",
        cursor: "pointer",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
            backgroundColor: "#EFEFEF",
        },
    };

    // Drag and Drop
    const onDragEnd = ( result ) =>
    {
        const { destination, source, draggableId } = result;

        if ( !destination ) return;

        // same column, same position
        if (
            destination.droppableId == source.droppableId &&
            destination.index == source.index
        )
        {
            return;
        }

        // droppableId = status
        const newStatus = destination.droppableId;

        dispatch(
            updateProjectTaskStatusLocal( {
                taskId: draggableId,
                status: newStatus,
            } ),
        );

        dispatch(
            updateTaskStatus( {
                taskId: draggableId,
                status: newStatus,
            } ),
        );
    };



    return (
        <>
            <div className="mt-4 mx-8 relative flex flex-col h-full">
                <div className="bg-white shadow flex justify-between items-center rounded-lg px-5 py-2.5">
                    <div className="flex gap-2 items-center">
                        <div>
                            { loading ? (
                                <Skeleton variant="rounded" width={ 32 } height={ 32 } />
                            ) : (
                                <img src={ project?.logo } alt="AHIT Logo" className="h-8" />
                            ) }
                        </div>

                        <div>
                            { loading ? (
                                <>
                                    <Skeleton variant="text" width={ 120 } height={ 18 } />
                                    <Skeleton variant="text" width={ 80 } height={ 14 } />
                                </>
                            ) : (
                                <>
                                    <h3 className="text-[13px] font-semibold m-0">
                                        { project?.name }
                                    </h3>
                                    <Link
                                        to="/projects"
                                        className="text-[11px] flex items-center text-[#555454] -mt-1 font-semibold"
                                    >
                                        Change Project
                                    </Link>
                                </>
                            ) }
                        </div>
                    </div>

                    <div className="flex gap-2">
                        { loading ? (
                            <>
                                <Skeleton variant="rounded" width={ 36 } height={ 36 } />
                                <Skeleton variant="rounded" width={ 36 } height={ 36 } />
                            </>
                        ) : (
                            <>
                                <IconButton sx={ iconBtnStyle }>
                                    <img src={ speechIcon } alt="" className="w-4" />
                                </IconButton>

                                <IconButton sx={ iconBtnStyle }>
                                    <img className="w-3.5" src={ heartIcon } alt="" />
                                </IconButton>
                            </>
                        ) }
                    </div>
                </div>
                <div className="mt-6 pb-4">
                    <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
                        <div className="flex gap-4 items-start min-w-max h-full pb-6">
                            <DragDropContext onDragEnd={ onDragEnd }>
                                <KanbanColumn
                                    title="To Do"
                                    status="TODO"
                                    tasks={ todoTasks }
                                    projectId={ project?.id }
                                    loading={ loadingProjectTasks }

                                />

                                <KanbanColumn
                                    title="In Progress"
                                    status="IN_PROGRESS"
                                    tasks={ doingTasks }
                                    projectId={ project?.id }
                                    loading={ loadingProjectTasks }
                                />

                                <KanbanColumn
                                    title="Reviews"
                                    status="REVIEW"
                                    projectId={ project?.id }
                                    tasks={ reviewsTasks }
                                    loading={ loadingProjectTasks }
                                />

                                <KanbanColumn
                                    title="Done"
                                    status="DONE"
                                    projectId={ project?.id }
                                    tasks={ doneTasks }
                                    loading={ loadingProjectTasks }
                                />
                            </DragDropContext>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KanbanBoard;
