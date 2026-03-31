import React, { useEffect, useRef, useState } from "react";
import searchIcon from "../../assets/search2.png";
import bellIcon from "../../assets/bell.png";
import tagIcon from "../../assets/tag.png";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";

const ChatHeader = () =>
{
    const [ showSearchInput, setShowSearchInput ] = useState( false );

    const searchRef = useRef( null );

    const handleShowSearchInput = () =>
    {
        setShowSearchInput( true );
    };

    useEffect( () =>
    {
        const handleClickOutside = ( event ) =>
        {
            if ( searchRef.current && !searchRef.current.contains( event.target ) )
            {
                setShowSearchInput( false );
            }
        };

        document.addEventListener( "mousedown", handleClickOutside );

        return () =>
        {
            document.removeEventListener( "mousedown", handleClickOutside );
        };
    }, [] );

    const { selectedChatRoom } = useSelector( ( state ) => state.chatRoom );

    return (
        <>
            <div className="px-4 flex justify-between items-center pb-1.5 pt-2 border-b border-[rgba(200,200,200,.5)]">
                <div>
                    <div className="flex gap-2 items-center">
                        <img src={ tagIcon } className="w-3.5 h-3.5" alt="" />
                        <p className="text-[13px] font-medium mt-0.5">
                            { selectedChatRoom?.project?.name }
                        </p>
                    </div>

                    <p className="text-[12px]  opacity-65">
                        { selectedChatRoom?.project?.members.length } Members
                    </p>
                </div>

                <div className="flex items-center gap-3 ">
                    <div className="relative">
                        <IconButton onClick={ handleShowSearchInput } size="small">
                            <img src={ searchIcon } className="w-3.5 h-3.5" alt="" />

                            <div
                                ref={ searchRef }
                                className={ `dropdown ${ showSearchInput && "show"
                                    }  bg-[#EFEFEF]  z-30 max-w-73.5 w-65 absolute` }
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className=" shadow placeholder:text-[#464545] border-0 outline-0  text-[14px] pr-4 pl-8 py-1.5 w-full"
                                    />

                                    <img
                                        src={ searchIcon }
                                        className="w-3.5 h-3.5 left-3 absolute top-1/2 -translate-y-1/2"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </IconButton>
                    </div>
                    <IconButton size="small">
                        <img src={ bellIcon } className="w-4 h-4" alt="" />
                    </IconButton>
                </div>
            </div>
        </>
    );
};

export default ChatHeader;
