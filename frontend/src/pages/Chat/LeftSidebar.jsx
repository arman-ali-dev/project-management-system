// src/components/Chat/LeftSidebar.jsx
import React, { useEffect } from "react";
import mentionIcon from "../../assets/mention.png";
import { Link } from "react-router-dom";
import draftIcon from "../../assets/draft.png";
import bookmarkIcon from "../../assets/bookmark.png";
import channelIcon from "../../assets/channel.png";
import downArrow from "../../assets/arrowDown.png";
import tagIcon from "../../assets/tag.png";
import groupIcon from "../../assets/group.png";
import { useDispatch, useSelector } from "react-redux";
import userAvatar from "../../assets/userAvatar.png";
import
{
    selectChatRoom,
    fetchPrivateRooms,
    openPrivateChat,
} from "../../redux/member/chatRoomSlice";
import { fetchAllUsers } from "../../redux/member/userSlice";

const getAvatarColor = ( name ) =>
{
    const colors = [
        "#497AF5",
        "#09C015",
        "#E8A020",
        "#FA2626",
        "#9B59B6",
        "#1ABC9C",
    ];
    return colors[ ( name?.charCodeAt( 0 ) || 0 ) % colors.length ];
};

const LeftSidebar = () =>
{
    const dispatch = useDispatch();
    const { chatRooms, selectedChatRoom, privateRooms } = useSelector(
        ( state ) => state.chatRoom,
    );
    const { user } = useSelector( ( state ) => state.user );
    const { users } = useSelector( ( state ) => state.user );

    useEffect( () =>
    {
        dispatch( fetchPrivateRooms() );
        dispatch( fetchAllUsers() );
    }, [] );

    const handleSelectChatRoom = ( room ) => () => dispatch( selectChatRoom( room ) );

    const handleOpenPrivateChat = ( memberId ) =>
        dispatch( openPrivateChat( memberId ) );

    const getOtherParticipant = ( room ) =>
        room.participants?.find( ( p ) => p.id !== user?.id );

    const otherUsers = users?.filter( ( u ) => u.id !== user?.id ) || [];

    console.log( "otherUsers", otherUsers );

    return (
        <div className="h-full w-full px-4 py-6 border-[rgba(200,200,200,.5)] border-r overflow-y-auto">
            <ul className="space-y-2 border-b border-[rgba(200,200,200,.5)] pb-4 mb-3.5">
                <li className="relative">
                    <Link className="text-[13px] opacity-75 flex items-center gap-1.5 hover:opacity-100 transition-all duration-75">
                        <img className="w-4 h-4" src={ mentionIcon } alt="" />
                        <span className="mt-px">Mentions</span>
                    </Link>
                    <span className="bg-[rgba(250,38,38,.9)] absolute right-0 top-1/2 -translate-y-1/2 opacity-80 flex justify-center items-center text-[10px] text-white h-5.5 w-5.5 rounded-lg">
                        2
                    </span>
                </li>
                <li>
                    <Link className="text-[13px] opacity-75 flex items-center gap-1.5 hover:opacity-100 transition-all duration-75">
                        <img className="w-4 h-4" src={ draftIcon } alt="" />
                        <span className="mt-px">Drafts</span>
                    </Link>
                </li>
                <li>
                    <Link className="text-[13px] opacity-75 flex items-center gap-1.5 hover:opacity-100 transition-all duration-75">
                        <img className="w-4 h-4" src={ bookmarkIcon } alt="" />
                        <span className="mt-px">Bookmarks</span>
                    </Link>
                </li>
            </ul>

            <div className="mb-3.5">
                <div className="flex justify-between items-center">
                    <h3 className="flex gap-2 items-center font-medium">
                        <img className="w-4 h-4" src={ channelIcon } alt="" />
                        <span className="text-[13px]">Projects</span>
                    </h3>
                    <img className="w-2 h-2 cursor-no-drop" src={ downArrow } alt="" />
                </div>
                <ul className="space-y-2 border-b border-[rgba(200,200,200,.5)] pb-4 mt-3">
                    { chatRooms?.map( ( c ) => (
                        <li
                            key={ c.id }
                            onClick={ handleSelectChatRoom( c ) }
                            className="relative cursor-pointer"
                        >
                            <span
                                className={ `text-[13px] ${ c.id !== selectedChatRoom?.id ? "opacity-75" : "font-medium" } flex items-center gap-1.5 hover:opacity-100 transition-all duration-75` }
                            >
                                <img className="w-3.5 h-3.5" src={ tagIcon } alt="" />
                                { c?.project?.name }
                            </span>
                        </li>
                    ) ) }
                </ul>
            </div>

            <div className="mb-3.5">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="flex gap-2 items-center font-medium">
                        <img className="w-4 h-4" src={ groupIcon } alt="" />
                        <span className="text-[13px] mt-1">Users</span>
                    </h3>
                    <img className="w-2 h-2 mt-1 cursor-no-drop" src={ downArrow } alt="" />
                </div>

                <ul className="space-y-2">
                    { otherUsers.map( ( u ) => (
                        <li
                            key={ u.id }
                            onClick={ () => handleOpenPrivateChat( u.id ) }
                            className={ `flex cursor-pointer items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors ${ selectedChatRoom?.type === "PRIVATE" &&
                                selectedChatRoom?.participants?.some( ( p ) => p.id === u.id )
                                ? "bg-[#F0F4FF]"
                                : ""
                                }` }
                        >
                            <img
                                src={ u.profileImage || userAvatar }
                                alt={ u.fullName }
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <p className="text-[13px] truncate">{ u.fullName }</p>
                        </li>
                    ) ) }
                </ul>
            </div>

            {/* { privateRooms?.length > 0 && (
                <div>
                    <h3 className="text-[12px] text-[#969696] uppercase tracking-wide mb-2 mt-2">Direct Messages</h3>
                    <ul className="space-y-2">
                        { privateRooms.map( ( room ) =>
                        {
                            const other = getOtherParticipant( room );
                            if ( !other ) return null;
                            return (
                                <li
                                    key={ room.id }
                                    onClick={ handleSelectChatRoom( room ) }
                                    className={ `flex cursor-pointer items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors ${ selectedChatRoom?.id === room.id ? "bg-[#F0F4FF]" : "" }` }
                                >
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0"
                                        style={ { backgroundColor: getAvatarColor( other.fullName ) } }
                                    >
                                        { other.fullName?.charAt( 0 ).toUpperCase() }
                                    </div>
                                    <p className="text-[13px] truncate">{ other.fullName }</p>
                                </li>
                            );
                        } ) }
                    </ul>
                </div>
            ) } */}
        </div>
    );
};

export default LeftSidebar;
