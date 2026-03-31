import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../redux/admin/taskSlice";
import userAvatar from "../../assets/userAvatar.png";
import
{
    Tooltip,
    Skeleton,
    Pagination,
    IconButton,
    Menu,
    MenuItem,
    Divider,
} from "@mui/material";
import filterIcon from "../../assets/filter.png";

const TaskTable = () =>
{
    const [ filterAnchorEl, setFilterAnchorEl ] = React.useState( null );
    const openFilterDropDown = Boolean( filterAnchorEl );
    const [ visible, setVisible ] = useState( false );

    const handleClick = ( event ) => setFilterAnchorEl( event.currentTarget );
    const handleCloseFilterDropDown = () => setFilterAnchorEl( null );

    const dispatch = useDispatch();
    const [ status, setStatus ] = useState( null );
    const [ priority, setPriority ] = useState( null );

    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );
        if ( !token ) return;
        dispatch( fetchTasks( { status, priority } ) );
    }, [ dispatch, status, priority ] );

    useEffect( () =>
    {
        // Small delay so table fades in after cards
        setTimeout( () => setVisible( true ), 300 );
    }, [] );

    const { tasks, loading } = useSelector( ( state ) => state.adminTask );

    const [ page, setPage ] = useState( 1 );
    const rowsPerPage = 7;
    const safeTasks = Array.isArray( tasks ) ? tasks : [];
    const startIndex = ( page - 1 ) * rowsPerPage;
    const paginatedTasks = safeTasks.slice( startIndex, startIndex + rowsPerPage );
    const totalPages = Math.ceil( tasks?.length / rowsPerPage ) || 1;

    return (
        <div
            className="rounded-2xl px-6 py-5 mt-4 bg-white"
            style={ {
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s, box-shadow 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            } }
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[17px] font-semibold">Tasks</h2>

                <IconButton
                    onClick={ handleClick }
                    sx={ {
                        width: 36,
                        height: 36,
                        backgroundColor: "#EFEFEF",
                        cursor: "pointer",
                        borderRadius: "8px",
                        transition: "background 0.18s ease, transform 0.15s ease !important",
                        "&:hover": {
                            backgroundColor: "#e0e0e0 !important",
                            transform: "scale(1.07)",
                        },
                        "&:active": {
                            transform: "scale(0.93) !important",
                        },
                    } }
                >
                    <img
                        src={ filterIcon }
                        alt=""
                        className="w-4"
                        style={ {
                            transition: "transform 0.2s ease",
                            transform: openFilterDropDown ? "rotate(90deg)" : "rotate(0deg)",
                        } }
                    />
                </IconButton>

                <Menu
                    anchorEl={ filterAnchorEl }
                    open={ openFilterDropDown }
                    onClose={ handleCloseFilterDropDown }
                    PaperProps={ {
                        sx: {
                            width: 180,
                            borderRadius: "10px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            animation: "fadeSlideDown 0.2s ease",
                        },
                    } }
                    transformOrigin={ { horizontal: "right", vertical: "top" } }
                    anchorOrigin={ { horizontal: "right", vertical: "bottom" } }
                >
                    { [
                        { label: "All Tasks", action: () => { setStatus( null ); setPriority( null ); } },
                    ].map( ( item, i ) => (
                        <MenuItem key={ i } onClick={ () => { item.action(); handleCloseFilterDropDown(); } } sx={ { fontSize: "13px", fontWeight: 700 } }>
                            { item.label }
                        </MenuItem>
                    ) ) }
                    <Divider />
                    { [
                        { label: "To-Do Tasks", status: "TODO" },
                        { label: "Doing Tasks", status: "IN_PROGRESS" },
                        { label: "Done Tasks", status: "DONE" },
                    ].map( ( item, i ) => (
                        <MenuItem key={ i } onClick={ () => { setStatus( item.status ); setPriority( null ); handleCloseFilterDropDown(); } } sx={ { fontSize: "13px", fontWeight: 700 } }>
                            { item.label }
                        </MenuItem>
                    ) ) }
                    <Divider />
                    { [
                        { label: "High Priority", priority: "HIGH" },
                        { label: "Medium Priority", priority: "MEDIUM" },
                        { label: "Low Priority", priority: "LOW" },
                    ].map( ( item, i ) => (
                        <MenuItem key={ i } onClick={ () => { setStatus( null ); setPriority( item.priority ); handleCloseFilterDropDown(); } } sx={ { fontSize: "13px", fontWeight: 700 } }>
                            { item.label }
                        </MenuItem>
                    ) ) }
                </Menu>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr
                            className="text-[13px] font-semibold border-b border-gray-300"
                            style={ {
                                opacity: visible ? 1 : 0,
                                transition: "opacity 0.4s ease 0.4s",
                            } }
                        >
                            <th className="pb-4 pr-4">Title</th>
                            <th className="pb-4 px-4">Estimated Time</th>
                            <th className="pb-4 px-4">Assigned Date</th>
                            <th className="pb-4 px-4">Status</th>
                            <th className="pb-4 px-4">Due Date</th>
                            <th className="pb-4 px-4">Priority</th>
                            <th className="pb-4 pl-4">Assigned To</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        { loading
                            ? Array.from( { length: 5 } ).map( ( _, i ) => (
                                <TableSkeletonRow key={ i } />
                            ) )
                            : paginatedTasks?.map( ( task, index ) => (
                                <AnimatedTableRow
                                    key={ index }
                                    task={ task }
                                    index={ index }
                                    visible={ visible }
                                />
                            ) )
                        }
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-10 mb-2">
                <Pagination
                    count={ totalPages }
                    page={ page }
                    onChange={ ( event, value ) => setPage( value ) }
                    shape="rounded"
                    sx={ {
                        "& .MuiPaginationItem-root": {
                            transition: "background 0.15s ease, transform 0.15s ease",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                                transform: "scale(1.05)",
                            },
                        },
                        "& .Mui-selected": {
                            backgroundColor: "black !important",
                            color: "white !important",
                            "&:hover": {
                                backgroundColor: "#333 !important",
                            },
                        },
                    } }
                />
            </div>
        </div>
    );
};

// Separate component for animated rows
const AnimatedTableRow = ( { task, index, visible } ) =>
{
    const [ rowHovered, setRowHovered ] = useState( false );

    return (
        <tr
            onMouseEnter={ () => setRowHovered( true ) }
            onMouseLeave={ () => setRowHovered( false ) }
            style={ {
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 0.35s ease ${ 500 + index * 60 }ms, transform 0.35s ease ${ 500 + index * 60 }ms, background 0.15s ease`,
                backgroundColor: rowHovered ? "#fafafa" : "transparent",
                cursor: "default",
            } }
        >
            <td className="py-4 pr-4 text-[13px] font-medium text-gray-700">
                { task.title }
            </td>

            <td className="py-4 px-4 text-[13px] font-medium text-gray-700">
                { task.estimatedTime } Hours
            </td>

            <td className="py-4 px-4 text-[13px] text-gray-600">
                { new Date( task.createdAt.split( "T" )[ 0 ] ).toLocaleDateString( "en-US", {
                    month: "short", day: "numeric", year: "numeric",
                } ) }
            </td>

            <td className="py-4 px-4">
                <span
                    className={ `px-3 py-1 text-[12px] font-semibold rounded ${ task.status === "IN_PROGRESS"
                        ? "bg-[rgba(245,86,0,.2)] text-[#F55600]"
                        : task.status === "TODO"
                            ? "bg-[rgba(21,127,215,.2)] text-[#157FD7]"
                            : "bg-[rgba(24,163,34,.2)] text-[#18A322]"
                        }` }
                    style={ {
                        display: "inline-block",
                        transition: "transform 0.2s ease",
                        transform: rowHovered ? "scale(1.04)" : "scale(1)",
                    } }
                >
                    { task.status }
                </span>
            </td>

            <td className="py-4 px-4 text-[13px] text-gray-600">
                { new Date( task.dueDate ).toLocaleDateString( "en-US", {
                    month: "short", day: "numeric", year: "numeric",
                } ) }
            </td>

            <td className="py-4 px-4">
                <span
                    className={ `px-3 py-1 text-[12px] font-semibold rounded ${ task.priority === "HIGH"
                        ? "bg-[rgba(129,39,255,.2)] text-[#8127FF]"
                        : task.priority === "LOW"
                            ? "bg-[rgba(245,86,0,.2)] text-[#F55600]"
                            : "bg-[rgba(21,127,215,.2)] text-[#157FD7]"
                        }` }
                    style={ {
                        display: "inline-block",
                        transition: "transform 0.2s ease",
                        transform: rowHovered ? "scale(1.04)" : "scale(1)",
                    } }
                >
                    { task.priority }
                </span>
            </td>

            <td className="py-4 px-4">
                <div className="flex items-center -space-x-2">
                    <div
                        className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-light"
                        style={ {
                            transition: "background 0.15s ease, transform 0.15s ease",
                            cursor: "pointer",
                        } }
                        onMouseEnter={ e => e.currentTarget.style.backgroundColor = "#e5e7eb" }
                        onMouseLeave={ e => e.currentTarget.style.backgroundColor = "" }
                    >
                        +
                    </div>
                    { task?.assignedTo?.map( ( u, i ) => (
                        <Tooltip key={ i } title={ u.fullName }>
                            <img
                                src={ u.profileImage || userAvatar }
                                alt="user"
                                className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                style={ {
                                    transition: "transform 0.2s ease",
                                    transform: rowHovered ? "scale(1.1)" : "scale(1)",
                                    transitionDelay: `${ i * 30 }ms`,
                                } }
                            />
                        </Tooltip>
                    ) ) }
                </div>
            </td>
        </tr>
    );
};

const TableSkeletonRow = () => (
    <tr>
        <td className="py-4 pr-4"><Skeleton variant="text" width="80%" height={ 20 } /></td>
        <td className="py-4 px-4"><Skeleton variant="text" width="60%" height={ 20 } /></td>
        <td className="py-4 px-4"><Skeleton variant="text" width="70%" height={ 20 } /></td>
        <td className="py-4 px-4"><Skeleton variant="rounded" width={ 90 } height={ 26 } /></td>
        <td className="py-4 px-4"><Skeleton variant="text" width="70%" height={ 20 } /></td>
        <td className="py-4 px-4"><Skeleton variant="rounded" width={ 70 } height={ 26 } /></td>
        <td className="py-4 px-4">
            <div className="flex gap-2">
                <Skeleton className="-mr-5" variant="circular" width={ 28 } height={ 28 } />
                <Skeleton variant="circular" width={ 28 } height={ 28 } />
            </div>
        </td>
    </tr>
);

export default TaskTable;