import searchIcon from "../../assets/search.png";
import React, { useEffect, useState } from "react";
import plusIcon from "../../assets/plus.png";
import filterIcon from "../../assets/filter.png";
import ProjectCard, { ProjectCardSkeleton } from "./ProjectCard";
import AddProjectForm from "./AddProjectForm";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, searchProjects } from "../../redux/admin/projectSlice";

const Projects = () =>
{
    const dispatch = useDispatch();
    const [ status, setStatus ] = useState( null );
    const [ priority, setPriority ] = useState( null );
    const [ search, setSearch ] = useState( "" );
    const [ mounted, setMounted ] = useState( false );

    useEffect( () =>
    {
        requestAnimationFrame( () => setMounted( true ) );
    }, [] );

    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );
        if ( !token )
        {
            window.location.href = "/login";
            return;
        }
        if ( search.trim() === "" ) dispatch( fetchProjects( { status, priority } ) );
        else dispatch( searchProjects( search ) );
    }, [ dispatch, status, priority, search ] );

    const [ open, setOpen ] = React.useState( false );
    const toggleDrawer = ( value ) => ( event ) =>
    {
        if (
            event.type === "keydown" &&
            ( event.key === "Tab" || event.key === "Shift" )
        )
            return;
        setOpen( value );
    };

    const [ filterAnchorEl, setFilterAnchorEl ] = React.useState( null );
    const openFilterDropDown = Boolean( filterAnchorEl );

    const { projects, loading } = useSelector( ( state ) => state.adminProject );

    const filterOptions = [
        {
            type: "item",
            label: "All Projects",
            action: () =>
            {
                setStatus( null );
                setPriority( null );
            },
        },
        { type: "divider" },
        {
            type: "item",
            label: "Active Projects",
            action: () =>
            {
                setStatus( "ACTIVE" );
                setPriority( null );
            },
        },
        {
            type: "item",
            label: "Completed Projects",
            action: () =>
            {
                setStatus( "COMPLETED" );
                setPriority( null );
            },
        },
        {
            type: "item",
            label: "On Hold",
            action: () =>
            {
                setStatus( "ON_HOLD" );
                setPriority( null );
            },
        },
        { type: "divider" },
        {
            type: "item",
            label: "High Priority",
            action: () =>
            {
                setPriority( "HIGH" );
                setStatus( null );
            },
        },
        {
            type: "item",
            label: "Medium Priority",
            action: () =>
            {
                setPriority( "MEDIUM" );
                setStatus( null );
            },
        },
        {
            type: "item",
            label: "Low Priority",
            action: () =>
            {
                setPriority( "LOW" );
                setStatus( null );
            },
        },
    ];

    return (
        <>
            <div
                className="mt-4 mx-8 relative"
                style={ { opacity: mounted ? 1 : 0, transition: "opacity 0.3s ease" } }
            >
                {/* Search & Filter Bar */ }
                <div
                    onClick={ toggleDrawer( false ) }
                    className="bg-white flex justify-between items-center rounded-lg px-5 py-2.5"
                    style={ {
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(-10px)",
                        transition: "opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s",
                    } }
                >
                    <div
                        className="flex gap-2 items-center bg-[#EFEFEF] px-3 rounded-lg"
                        style={ { minWidth: 220 } }
                    >
                        <div className="h-8 w-8 flex justify-center items-center flex-shrink-0">
                            <img className="w-3" src={ searchIcon } alt="" />
                        </div>
                        <input
                            value={ search }
                            onChange={ ( e ) => setSearch( e.target.value ) }
                            className="border-0 mt-1 outline-0 text-[13px] placeholder:text-[13px] bg-transparent w-full"
                            style={ { opacity: 0.8 } }
                            type="text"
                            placeholder="Search a project..."
                        />
                    </div>

                    <div className="flex gap-2">
                        <IconButton
                            onClick={ ( e ) => setFilterAnchorEl( e.currentTarget ) }
                            sx={ {
                                width: 36,
                                height: 36,
                                backgroundColor: openFilterDropDown ? "#e0e0e0" : "#EFEFEF",
                                borderRadius: "8px",
                                transition:
                                    "background 0.18s ease, transform 0.15s ease !important",
                                "&:hover": {
                                    backgroundColor: "#e0e0e0 !important",
                                    transform: "scale(1.06) !important",
                                },
                                "&:active": { transform: "scale(0.93) !important" },
                            } }
                        >
                            <img
                                src={ filterIcon }
                                alt=""
                                className="w-4"
                                style={ {
                                    transition: "transform 0.2s ease",
                                    transform: openFilterDropDown
                                        ? "rotate(90deg)"
                                        : "rotate(0deg)",
                                } }
                            />
                        </IconButton>

                        <Menu
                            anchorEl={ filterAnchorEl }
                            open={ openFilterDropDown }
                            onClose={ () => setFilterAnchorEl( null ) }
                            PaperProps={ {
                                sx: {
                                    width: 180,
                                    borderRadius: "10px",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                    mt: 0.5,
                                },
                            } }
                            transformOrigin={ { horizontal: "right", vertical: "top" } }
                            anchorOrigin={ { horizontal: "right", vertical: "bottom" } }
                        >
                            { filterOptions.map( ( opt, i ) =>
                                opt.type === "divider" ? (
                                    <Divider key={ i } />
                                ) : (
                                    <MenuItem
                                        key={ i }
                                        onClick={ () =>
                                        {
                                            opt.action();
                                            setFilterAnchorEl( null );
                                        } }
                                        sx={ {
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            transition: "background 0.15s ease",
                                        } }
                                    >
                                        { opt.label }
                                    </MenuItem>
                                ),
                            ) }
                        </Menu>

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
                                borderRadius: "8px",
                                transition:
                                    "background 0.18s ease, transform 0.2s ease !important",
                                "&:hover": {
                                    backgroundColor: "#e0e0e0 !important",
                                    transform: "scale(1.06) !important",
                                },
                                "&:active": { transform: "scale(0.93) !important" },
                            } }
                        >
                            <img className="w-3.5" src={ plusIcon } alt="" />
                        </IconButton>
                    </div>
                </div>

                {/* Cards Grid */ }
                <div className="grid grid-cols-3 gap-5 mt-6">
                    { loading
                        ? Array.from( { length: 3 } ).map( ( _, i ) => (
                            <ProjectCardSkeleton key={ i } />
                        ) )
                        : projects.map( ( project, index ) => (
                            <ProjectCard project={ project } key={ project.id } index={ index } />
                        ) ) }
                </div>
            </div>

            <AddProjectForm toggleDrawer={ toggleDrawer } open={ open } />
        </>
    );
};

export default Projects;
