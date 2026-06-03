// src/hooks/useGlobalChat.js
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { addMessage } from "../redux/member/chatSlice";
import useDesktopNotification from "./Usedesktopnotification";

const useGlobalChat = () =>
{
    const dispatch = useDispatch();
    const clientRef = useRef( null );

    const { showNotification } = useDesktopNotification();
    const { chatRooms } = useSelector( ( state ) => state.chatRoom );
    const { user } = useSelector( ( state ) => state.user );
    const currentUserId = user?.id;

    useEffect( () =>
    {
        if ( !chatRooms?.length || !currentUserId ) return;

        const token = localStorage.getItem( "jwt" );

        const client = new Client( {
            webSocketFactory: () => new SockJS( "https://apislack.a2groups.org/ws" ),
            connectHeaders: { Authorization: `Bearer ${ token }` },
            reconnectDelay: 5000,

            onConnect: () =>
            {
                chatRooms.forEach( ( room ) =>
                {
                    client.subscribe( `/topic/room/${ room.id }`, ( message ) =>
                    {
                        const received = JSON.parse( message.body );

                        dispatch( addMessage( received ) );

                        if ( received.senderId === currentUserId ) return;

                        const title = received.senderName || room.name || "New Message";
                        const body =
                            received.type === "TEXT"
                                ? received.content
                                : received.type === "IMAGE"
                                    ? "📷 Sent a photo"
                                    : received.type === "VIDEO"
                                        ? "🎥 Sent a video"
                                        : `📄 ${ received.fileName || "Sent a file" }`;

                        showNotification( title, body, {
                            tag: `chat-room-${ room.id }`,
                        } );
                    } );
                } );
            },

            onStompError: ( frame ) =>
                console.error( "Global WS broker error:", frame.headers[ "message" ] ),
            onWebSocketError: ( err ) =>
                console.error( "Global WS error:", err ),
        } );

        client.activate();
        clientRef.current = client;

        return () =>
        {
            if ( client.active ) client.deactivate();
        };

    }, [ chatRooms, currentUserId ] );
};

export default useGlobalChat;