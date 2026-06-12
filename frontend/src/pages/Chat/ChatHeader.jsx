import React, { useEffect, useRef, useState } from "react";
import searchIcon from "../../assets/search2.png";
import bellIcon from "../../assets/bell.png";
import tagIcon from "../../assets/tag.png";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import userAvatar from '../../assets/userAvatar.png'

const getAvatarColor = ( name ) =>
{
    const colors = [ "#497AF5", "#09C015", "#E8A020", "#FA2626", "#9B59B6", "#1ABC9C" ];
    return colors[ ( name?.charCodeAt( 0 ) || 0 ) % colors.length ];
};

const ChatHeader = () =>
{
    const [ showSearchInput, setShowSearchInput ] = useState( false );
    const searchRef = useRef( null );

    const { selectedChatRoom } = useSelector( ( state ) => state.chatRoom );
    const { user } = useSelector( ( state ) => state.user );

    const isPrivate = selectedChatRoom?.type === "PRIVATE";

    const otherParticipant = isPrivate
        ? selectedChatRoom?.participants?.find( ( p ) => p.id !== user?.id )
        : null;

    const displayName = isPrivate
        ? otherParticipant?.fullName || "Direct Message"
        : selectedChatRoom?.project?.name || "";

    const displaySubtitle = isPrivate
        ? otherParticipant?.email || ""
        : `${ selectedChatRoom?.project?.members?.length || 0 } Members`;

    const handleShowSearchInput = () => setShowSearchInput( true );

    useEffect( () =>
    {
        const handleClickOutside = ( event ) =>
        {
            if ( searchRef.current && !searchRef.current.contains( event.target ) )
                setShowSearchInput( false );
        };
        document.addEventListener( "mousedown", handleClickOutside );
        return () => document.removeEventListener( "mousedown", handleClickOutside );
    }, [] );

    return (
        <div className="px-4 flex justify-between items-center pb-1.5 pt-2 border-b border-[rgba(200,200,200,.5)]">
            <div className="flex items-center gap-2.5">
                { isPrivate ? (
                    <img
                        src={ otherParticipant.profileImage || userAvatar }
                        alt={ otherParticipant.fullName }
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <img src={ tagIcon } className="w-3.5 h-3.5" alt="" />
                ) }

                <div>
                    <p className="text-[13px] font-medium leading-tight">{ displayName }</p>
                    <p className="text-[11px] opacity-55">{ displaySubtitle }</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <IconButton onClick={ handleShowSearchInput } size="small">
                        <img src={ searchIcon } className="w-3.5 h-3.5" alt="" />
                        <div
                            ref={ searchRef }
                            className={ `dropdown ${ showSearchInput && "show" } bg-[#EFEFEF] z-30 max-w-73.5 w-65 absolute` }
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="shadow placeholder:text-[#464545] border-0 outline-0 text-[14px] pr-4 pl-8 py-1.5 w-full"
                                />
                                <img src={ searchIcon } className="w-3.5 h-3.5 left-3 absolute top-1/2 -translate-y-1/2" alt="" />
                            </div>
                        </div>
                    </IconButton>
                </div>
                <IconButton size="small">
                    <img src={ bellIcon } className="w-4 h-4" alt="" />
                </IconButton>
            </div>
        </div>
    );
};

export default ChatHeader;