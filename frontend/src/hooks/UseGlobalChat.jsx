// src/hooks/useGlobalChat.js
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { addMessage } from "../redux/member/chatSlice";
import { addNotification } from "../redux/member/notificationSlice";
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
                console.log( "Global WS connected, userId:", currentUserId );

                chatRooms.forEach( ( room ) =>
                {
                    client.subscribe( `/topic/room/${ room.id }`, ( message ) =>
                    {
                        const received = JSON.parse( message.body );

                        console.log( "Full message:", received ); // ← poora object dekho

                        dispatch( addMessage( received ) );


                        if ( received.sender.id == currentUserId ) return;

                        const notifBody =
                            received.type === "TEXT" ? received.content :
                                received.type === "IMAGE" ? "📷 Sent a photo" :
                                    received.type === "VIDEO" ? "🎥 Sent a video" :
                                        `📄 ${ received.fileName || "Sent a file" }`;

                        const notifTitle = received.sender.fullName || room.name || "New Message";

                        dispatch( addNotification( {
                            id: Date.now(),
                            type: "CHAT",
                            title: notifTitle,
                            body: notifBody,
                            roomId: room.id,
                            roomName: room.name,
                            createdAt: new Date().toISOString(),
                            read: false,
                        } ) );

                        if ( document.hidden )
                        {
                            showNotification( notifTitle, notifBody, {
                                tag: `chat-room-${ room.id }`,
                            } );
                        }
                    } );
                } );

                client.subscribe(
                    `/topic/task-status/${ currentUserId }`,
                    ( message ) =>
                    {
                        console.log( "Task status event received:", message.body );
                        const event = JSON.parse( message.body );


                        const title = `Task Status Updated`;
                        const body = `"${ event.taskTitle }" is now ${ event.newStatus } - by ${ event.changedByName }`;

                        // Redux notification store
                        dispatch( addNotification( {
                            id: Date.now(),
                            type: "TASK_STATUS",
                            title,
                            body,
                            taskId: event.taskId,
                            taskTitle: event.taskTitle,
                            newStatus: event.newStatus,
                            createdAt: new Date().toISOString(),
                            read: false,
                        } ) );

                        showNotification( title, body, {
                            tag: `task-status-${ event.taskId }`,
                        } );
                    }
                );
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