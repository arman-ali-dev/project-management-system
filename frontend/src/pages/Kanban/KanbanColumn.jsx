import React from "react";
import plusIcon from "../../assets/plus.png";
import { IconButton } from "@mui/material";
import KanbanCard, { KanbanCardSkeleton } from "./KanbanCard";
import menuIcon from "../../assets/menu.png";
import { Droppable } from "@hello-pangea/dnd";
import CreateNewTaskForm from "./CreateNewTaskForm";
import { useSelector } from "react-redux";

const KanbanColumn = ( { title, tasks, loading, projectId, status } ) =>
{
    const [ open, setOpen ] = React.useState( false );

    const toggleDrawer = ( value ) => ( event ) =>
    {
        if (
            event.type === "keydown" &&
            ( event.key === "Tab" || event.key === "Shift" )
        )
        {
            return;
        }
        setOpen( value );
    };

    const { user } = useSelector( ( state ) => state.user );

    return (
        <>
            <div
                onClick={ toggleDrawer( false ) }
                className="bg-white px-4 py-6  rounded-lg shadow w-85"
            >
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <IconButton
                            disabled={ user?.role !== "ADMIN" }
                            onClick={ ( e ) =>
                            {
                                e.stopPropagation();
                                toggleDrawer( true )( e );
                            } }
                            sx={ {
                                width: 38,
                                height: 38,
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                                backgroundColor: "#EFEFEF",

                                opacity: 1,
                                filter: "none",

                                "&.Mui-disabled": {
                                    backgroundColor: "#EFEFEF",
                                    opacity: 0.9,
                                    filter: "blur(1px)",
                                    cursor: "not-allowed",
                                },

                                "&:hover": {
                                    backgroundColor: "#EFEFEF",
                                },
                            } }
                        >
                            <img className="w-3.5" src={ plusIcon } alt="" />
                        </IconButton>

                        <p className="text-[15px] font-semibold ">{ title }</p>
                        <p className="text-[13px] font-semibold -mt-2 -ml-2">(3)</p>
                    </div>

                    <div>
                        <img src={ menuIcon } alt="menu icon" className="w-5 h-5 " />
                    </div>
                </div>

                <div className="mt-5 space-y-4">
                    <Droppable droppableId={ status }>
                        { ( provided ) => (
                            <div
                                ref={ provided.innerRef }
                                { ...provided.droppableProps }
                                className="mt-5 space-y-4 min-h-10"
                            >
                                { loading
                                    ? [ 1, 2 ].map( ( elem ) => <KanbanCardSkeleton key={ elem } /> )
                                    : tasks.map( ( task, idx ) => (
                                        <KanbanCard
                                            currentUserId={ user?.id }
                                            userRole={ user?.role }
                                            task={ task }
                                            idx={ idx }
                                            key={ task.id }
                                        />
                                    ) ) }
                                { provided.placeholder }
                            </div>
                        ) }
                    </Droppable>
                </div>
            </div>

            <CreateNewTaskForm
                status={ status }
                projectId={ projectId }
                toggleDrawer={ toggleDrawer }
                open={ open }
            />
        </>
    );
};

export default KanbanColumn;
