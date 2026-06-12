import React, { useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import ChatContainer from "./ChatContainer";
import RightSidebar from "./RightSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatRooms } from "../../redux/member/chatRoomSlice";
import chatIcon from '../../assets/chat.png'

const EmptyState = () => (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-[#F0F4FF] flex items-center justify-center mb-4">
            <img src={ chatIcon } className="h-8" alt="" />
        </div>
        <p className="text-[15px] font-semibold text-gray-700">No chat selected</p>
        <p className="text-[12px] text-gray-400 mt-1">
            Select a project or a team member to start chatting
        </p>
    </div>
);

const Chat = () =>
{
    const dispatch = useDispatch();
    const { selectedChatRoom } = useSelector( ( state ) => state.chatRoom );

    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );
        if ( !token ) return;
        dispatch( fetchChatRooms() );
    }, [ dispatch ] );

    return (
        <div className="bg-white rounded-lg shadow h-[87vh] m-4">
            <div className="grid grid-cols-9 h-full">

                <div className="col-span-2">
                    <LeftSidebar />
                </div>

                { selectedChatRoom ? (
                    <>
                        <div className="col-span-5 h-full overflow-y-hidden">
                            <ChatContainer />
                        </div>
                        <div className="col-span-2">
                            <RightSidebar />
                        </div>
                    </>
                ) : (
                    <div className="col-span-7 border-l border-[rgba(200,200,200,.5)]">
                        <EmptyState />
                    </div>
                ) }

            </div>
        </div>
    );
};

export default Chat;