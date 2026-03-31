import React, { useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import ChatContainer from "./ChatContainer";
import RightSidebar from "./RightSidebar";
import { useDispatch } from "react-redux";
import { fetchChatRooms } from "../../redux/member/chatRoomSlice";

const Chat = () =>
{
    const dispatch = useDispatch();

    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );
        if ( !token ) return;

        dispatch( fetchChatRooms() );
    }, [ dispatch ] );

    return (
        <>
            <div className="bg-white rounded-lg shadow h-[87vh] m-4">
                <div className="grid grid-cols-9 h-full">
                    <div className="col-span-2">
                        <LeftSidebar />
                    </div>

                    <div className="col-span-5 h-full overflow-y-hidden">
                        <ChatContainer />
                    </div>

                    <div className="col-span-2">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;
