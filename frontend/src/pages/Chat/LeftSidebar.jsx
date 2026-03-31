import React from "react";
import mentionIcom from "../../assets/mention.png";
import { Link } from "react-router-dom";
import draftIcon from "../../assets/draft.png";
import bookmarkIcon from "../../assets/bookmark.png";
import channelIcon from "../../assets/channel.png";
import downArrow from "../../assets/arrowDown.png";
import tagIcon from "../../assets/tag.png";
import groupIcon from "../../assets/group.png";
import userAvatar from "../../assets/userAvatar.png";
import { useDispatch, useSelector } from "react-redux";
import { selectChatRoom } from "../../redux/member/chatRoomSlice";

const LeftSidebar = () =>
{
    const { chatRooms } = useSelector( ( state ) => state.chatRoom );
    const { selectedChatRoom } = useSelector( ( state ) => state.chatRoom );
    const dispatch = useDispatch();

    const handleSelectChatRoom = ( room ) => () =>
    {
        dispatch( selectChatRoom( room ) );
    };

    console.log( "s c, ", selectedChatRoom );


    return (
        <>
            <div className="h-full w-full px-4 py-6 border-[rgba(200,200,200,.5)] border-r">
                <ul className="space-y-2 border-b border-[rgba(200,200,200,.5)] pb-4 mb-3.5">
                    <li className="relative">
                        <Link className="text-[13px] opacity-75 flex items-center gap-1.5 hover:opacity-100 transition-all duration-75">
                            <img className="w-4 h-4" src={ mentionIcom } alt="mention icon" />
                            <span className="mt-px">Mentions</span>
                        </Link>

                        <span className="bg-[rgba(250,38,38,.9)] absolute right-0 top-1/2 -translate-y-1/2 opacity-80 flex justify-center items-center text-[10px] text-white h-5.5 w-5.5 rounded-lg">
                            2
                        </span>
                    </li>

                    <li className="relative">
                        <Link className="text-[13px] opacity-75 flex items-center gap-1.5 hover:opacity-100 transition-all duration-75">
                            <img className="w-4 h-4" src={ draftIcon } alt="draft icon" />
                            <span className="mt-px">Drafts</span>
                        </Link>
                    </li>
                    <li className="relative">
                        <Link className="text-[13px] opacity-75 flex items-center gap-1.5 hover:opacity-100 transition-all duration-75">
                            <img className="w-4 h-4" src={ bookmarkIcon } alt="bookmark icon" />
                            <span className="mt-px">Bookmarks</span>
                        </Link>
                    </li>
                </ul>

                <div className=" mb-3.5">
                    <div className="flex justify-between items-center">
                        <h3 className="flex gap-2 items-center font-medium">
                            <img className="w-4 h-4" src={ channelIcon } alt="channel icon" />
                            <span className="text-[13px]">Projects</span>
                        </h3>

                        <img
                            className="w-2 h-2 cursor-no-drop"
                            src={ downArrow }
                            alt="down arrow icon"
                        />
                    </div>

                    <ul className="space-y-2 border-b border-[rgba(200,200,200,.5)] pb-4 mt-3 ">
                        { chatRooms?.map( ( c ) => (
                            <li onClick={ handleSelectChatRoom( c ) } className="relative">
                                <Link
                                    className={ `text-[13px] ${ c.id !== selectedChatRoom?.id ? "opacity-75" : "" } flex items-center gap-1.5 hover:opacity-100 transition-all duration-75` }
                                >
                                    <img className="w-3.5 h-3.5" src={ tagIcon } alt="tag icon" />
                                    <span className="mt-px">{ c?.project?.name }</span>
                                </Link>


                            </li>
                        ) ) }
                    </ul>
                </div>

                <div>
                    <div className="flex justify-between items-center">
                        <h3 className="flex gap-2 items-center font-medium">
                            <img className="w-4 h-4" src={ groupIcon } alt="group icon" />
                            <span className="text-[13px] mt-1">Team Messages</span>
                        </h3>

                        <img
                            className="w-2 h-2 mt-1 cursor-no-drop"
                            src={ downArrow }
                            alt="down arrow icon"
                        />
                    </div>

                    <ul className="mt-4 space-y-3">
                        { selectedChatRoom?.project?.members?.map( ( m ) => (
                            <li key={ m.id } className="flex cursor-pointer items-center gap-2.5">
                                <img
                                    src={ m.profileImage || userAvatar }
                                    alt="profile icon"
                                    className="w-6 h-6  rounded-full object-cover"
                                />
                                <p className=" text-[13px]">{ m?.fullName }</p>
                            </li>
                        ) ) }
                    </ul>
                </div>
            </div>
        </>
    );
};

export default LeftSidebar;
