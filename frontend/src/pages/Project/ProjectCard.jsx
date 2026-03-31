import React, { useEffect, useRef, useState } from "react";
import externalIcon from "../../assets/external.png";
import { Link, useNavigate } from "react-router-dom";
import clockIcon from "../../assets/clock.png";
import { CircularProgress, IconButton, Skeleton } from "@mui/material";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import EditProjectForm from "./editProjectForm";
import { useDispatch, useSelector } from "react-redux";
import { deleteProject } from "../../redux/admin/projectSlice";
import userAvatar from "../../assets/userAvatar.png";

const ProjectCard = ( { project, index = 0 } ) =>
{
  const navigate = useNavigate();
  const [ hovered, setHovered ] = useState( false );
  const [ visible, setVisible ] = useState( false );
  const [ progressAnimated, setProgressAnimated ] = useState( false );
  const cardRef = useRef( null );

  useEffect( () =>
  {
    const observer = new IntersectionObserver(
      ( [ entry ] ) =>
      {
        if ( entry.isIntersecting )
        {
          setTimeout( () =>
          {
            setVisible( true );
            setTimeout( () => setProgressAnimated( true ), 350 );
          }, index * 80 );
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if ( cardRef.current ) observer.observe( cardRef.current );
    return () => observer.disconnect();
  }, [] );

  const getDaysLeft = ( endDate ) =>
  {
    if ( !endDate ) return null;
    const today = new Date();
    const dueDate = new Date( endDate );
    today.setHours( 0, 0, 0, 0 );
    dueDate.setHours( 0, 0, 0, 0 );
    return Math.floor( ( dueDate - today ) / ( 1000 * 60 * 60 * 24 ) ) + 1;
  };

  const daysLeft = getDaysLeft( project?.endDate );
  const progressColor =
    project?.progress > 50
      ? "#18A322"
      : project?.progress === 50
        ? "#157FD7"
        : "#FA2626";

  const [ open, setOpen ] = React.useState( false );
  const [ selectedProject, setSelectedProject ] = React.useState( null );

  const toggleDrawer = ( value ) => ( event ) =>
  {
    if (
      event.type === "keydown" &&
      ( event.key === "Tab" || event.key === "Shift" )
    )
      return;
    setOpen( value );
  };

  const dispatch = useDispatch();
  const { deletedProjectId } = useSelector( ( state ) => state.adminProject );
  const { user } = useSelector( ( state ) => state.user );

  return (
    <>
      <div ref={ cardRef }>
        <div
          onClick={ () =>
          {
            navigate( `/projects/${ project.id }/kanban` );
            toggleDrawer( false )();
          } }
          onMouseEnter={ () => setHovered( true ) }
          onMouseLeave={ () => setHovered( false ) }
          className="bg-white group relative cursor-pointer rounded-xl px-6 py-5"
          style={ {
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.97)",
            transition: `opacity 0.45s ease ${ index * 80 }ms, transform 0.45s cubic-bezier(0.34,1.2,0.64,1) ${ index * 80 }ms, box-shadow 0.25s ease`,
            boxShadow: hovered
              ? "0 16px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)"
              : "0 2px 8px rgba(0,0,0,0.07)",
          } }
        >
          {/* Admin Actions */ }
          { user?.role === "ADMIN" && (
            <div
              className="absolute top-3 right-3 flex gap-1 z-50"
              onClick={ ( e ) => e.stopPropagation() }
              style={ {
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateY(0)" : "translateY(-6px)",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              } }
            >
              <IconButton
                size="small"
                onClick={ ( e ) =>
                {
                  setSelectedProject( project );
                  e.stopPropagation();
                  toggleDrawer( true )( e );
                } }
                sx={ {
                  transition:
                    "background 0.15s ease, transform 0.15s ease !important",
                  "&:hover": {
                    backgroundColor: "#f0f0f0 !important",
                    transform: "scale(1.1) !important",
                  },
                } }
              >
                <img className="w-4.5" src={ editIcon } alt="Edit" />
              </IconButton>

              <IconButton
                disabled={ deletedProjectId === project.id }
                size="small"
                onClick={ () => dispatch( deleteProject( project.id ) ) }
                sx={ {
                  transition:
                    "background 0.15s ease, transform 0.15s ease !important",
                  "&:hover": {
                    backgroundColor: "#fff0f0 !important",
                    transform: "scale(1.1) !important",
                  },
                } }
              >
                { deletedProjectId === project.id ? (
                  <CircularProgress size={ 14 } color="black" />
                ) : (
                  <img className="w-4" src={ deleteIcon } alt="Delete" />
                ) }
              </IconButton>
            </div>
          ) }

          {/* Logo */ }
          <img
            className="w-16 h-16 object-contain"
            src={ project?.logo }
            alt=""
            style={ {
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            } }
          />

          <h3
            className="font-medium text-[14px] mt-2.5"
            style={ { opacity: 0.8 } }
          >
            { project?.name }
          </h3>

          <Link
            to={ project?.url }
            onClick={ ( e ) => e.stopPropagation() }
            className="font-medium -mt-1 text-[12px] flex gap-1 items-center"
            target="_blank"
            rel="noopener noreferrer"
            style={ {
              color: "#747373",
              transition: "color 0.15s ease",
            } }
            onMouseEnter={ ( e ) => ( e.currentTarget.style.color = "#157FD7" ) }
            onMouseLeave={ ( e ) => ( e.currentTarget.style.color = "#747373" ) }
          >
            <img className="w-2.5" src={ externalIcon } alt="" />
            <span>{ project?.url }</span>
          </Link>

          <p className="text-[13.5px] font-medium mt-4">
            { project?.description.split( " " ).slice( 0, 10 ).join( " " ) }
            { project?.description.split( " " ).length > 10 && "..." }
          </p>

          {/* Animated Progress Bar */ }
          <div className="mt-5">
            <p
              className="text-[13px] text-right font-medium"
              style={ {
                transition: "color 0.3s ease",
                color: hovered ? progressColor : "inherit",
              } }
            >
              { project?.progress }%
            </p>
            <div className="h-1 w-full bg-[#D4D9D4] rounded-full overflow-hidden">
              <div
                style={ {
                  width: progressAnimated ? project?.progress + "%" : "0%",
                  backgroundColor: progressColor,
                  height: "100%",
                  borderRadius: "inherit",
                  transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)",
                } }
              />
            </div>
          </div>

          {/* Footer */ }
          <div className="mt-6 flex justify-between items-center">
            <div
              className="bg-[#ebebeb] rounded-md flex gap-2 items-center py-1.5 px-3 text-[#605D5D] text-[11px]"
              style={ {
                transition: "background 0.2s ease, transform 0.2s ease",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              } }
            >
              <img className="w-3" src={ clockIcon } alt="" />
              <span className="font-medium">
                { daysLeft > 1 && `${ daysLeft } days left` }
                { daysLeft === 1 && "Last day" }
                { daysLeft <= 0 && "Overdue" }
              </span>
            </div>

            <div className="flex">
              { project?.members?.map( ( m, idx ) => (
                <img
                  key={ idx }
                  className={ `min-w-8 min-h-8 w-8 h-8 rounded-full object-cover ${ idx !== project?.members?.length - 1 ? "-mr-3.5 z-50 border-white border" : "" }` }
                  src={ m.profileImage || userAvatar }
                  alt=""
                  style={ {
                    transition: `transform 0.2s ease ${ idx * 35 }ms`,
                    transform: hovered
                      ? "scale(1.12) translateY(-2px)"
                      : "scale(1) translateY(0)",
                  } }
                />
              ) ) }
            </div>
          </div>
        </div>
        <EditProjectForm
          selectedProject={ selectedProject }
          toggleDrawer={ toggleDrawer }
          open={ open }
        />
      </div>


    </>
  );
};

export default ProjectCard;

export const ProjectCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow px-6 py-5">
    <Skeleton
      variant="rectangular"
      width={ 55 }
      height={ 55 }
      sx={ { borderRadius: "8px" } }
    />
    <Skeleton height={ 18 } width="60%" sx={ { mt: 2 } } />
    <Skeleton height={ 14 } width="80%" />
    <Skeleton height={ 14 } width="100%" sx={ { mt: 2 } } />
    <Skeleton height={ 14 } width="90%" />
    <Skeleton height={ 14 } width="70%" />
    <Skeleton height={ 8 } width="100%" sx={ { mt: 3, borderRadius: "4px" } } />
    <div className="flex justify-between items-center mt-6">
      <Skeleton height={ 28 } width={ 100 } sx={ { borderRadius: "6px" } } />
      <div className="flex -space-x-3">
        <Skeleton variant="circular" width={ 32 } height={ 32 } />
        <Skeleton variant="circular" width={ 32 } height={ 32 } />
      </div>
    </div>
  </div>
);
