import React, { useEffect } from "react";
import UserTable from "./UserTable";
import { IconButton, Pagination } from "@mui/material";
import plusIcon from "../../assets/plus.png";
import searchIcon from "../../assets/search.png";
import AddMemberForm from "./AddMemberForm";
import filterIcon from "../../assets/filter.png";

import { Divider, Menu, MenuItem, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, searchUsers } from "../../redux/admin/userSlice";

const Users = () =>
{
    const dispatch = useDispatch();

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

    // Filter
    const [ status, setStatus ] = React.useState( null );

    const [ filterAnchorEl, setFilterAnchorEl ] = React.useState( null );
    const openFilterDropDown = Boolean( filterAnchorEl );

    const handleClick = ( event ) =>
    {
        setFilterAnchorEl( event.currentTarget );
    };

    const handleCloseFilterDropDown = () =>
    {
        setFilterAnchorEl( null );
    };

    // Search
    const [ search, setSearch ] = React.useState( "" );

    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );

        if ( !token )
        {
            window.location.href = "/login";
            return;
        }
        if ( search.trim() === "" )
        {
            dispatch( fetchUsers( status ) );
        } else
        {
            dispatch( searchUsers( search ) );
        }
    }, [ search, status, dispatch ] );




    const { loading } = useSelector(
        ( state ) => state.adminUser,
    );

    return (
        <>
            <div className=" mt-4 mx-8 relative">
                <div
                    onClick={ toggleDrawer( false ) }
                    className="bg-white shadow flex justify-between items-center rounded-lg px-5 py-2.5"
                >
                    <div className="flex gap-2 items-center">
                        <div className="bg-[#EFEFEF] h-8 w-8 rounded-lg flex justify-center items-center">
                            <img className="w-3" src={ searchIcon } alt="" />
                        </div>
                        <input
                            value={ search }
                            onChange={ ( e ) => setSearch( e.target.value ) }
                            className="placeholder:text-[#000000] w-125 border-0 mt-1 outline-0 text-[13px] placeholder:text-[13px] opacity-80"
                            type="text"
                            placeholder="Search for names, emails or designations..."
                        />
                    </div>

                    <div className="flex gap-2">
                        <div>
                            <IconButton
                                onClick={ handleClick }
                                sx={ {
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
                                } }
                            >
                                <img src={ filterIcon } alt="" className="w-4" />
                            </IconButton>

                            <Menu
                                anchorEl={ filterAnchorEl }
                                open={ openFilterDropDown }
                                onClose={ handleCloseFilterDropDown }
                                PaperProps={ {
                                    sx: { width: 180, borderRadius: "8px" },
                                } }
                            >
                                <MenuItem
                                    sx={ { fontSize: "13px", fontWeight: 700 } }
                                    onClick={ () =>
                                    {
                                        setStatus( "ACTIVE" );
                                        handleCloseFilterDropDown();
                                    } }
                                >
                                    Active
                                </MenuItem>

                                <MenuItem
                                    sx={ { fontSize: "13px", fontWeight: 700 } }
                                    onClick={ () =>
                                    {
                                        setStatus( "INACTIVE" );
                                        handleCloseFilterDropDown();
                                    } }
                                >
                                    Inactive
                                </MenuItem>

                                <MenuItem
                                    sx={ { fontSize: "13px" } }
                                    onClick={ () =>
                                    {
                                        setStatus( null );
                                        handleCloseFilterDropDown();
                                    } }
                                >
                                    Clear Filter
                                </MenuItem>
                            </Menu>
                        </div>

                        <IconButton
                            onClick={ ( e ) =>
                            {
                                e.stopPropagation();
                                toggleDrawer( true )( e );
                            } }
                            sx={ {
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
                            } }
                        >
                            <img className="w-3.5" src={ plusIcon } alt="" />
                        </IconButton>
                    </div>
                </div>
                <div className="bg-white shadow mt-4 rounded-lg px-5 py-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[16px] font-semibold">Users List</h3>
                    </div>

                    <UserTable />
                </div>
            </div>

            <AddMemberForm toggleDrawer={ toggleDrawer } open={ open } />
        </>
    );
};


export default Users;
