import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { addMessage } from "../redux/member/chatSlice";
import { addNotification } from "../redux/member/notificationSlice";
import useDesktopNotification from "./Usedesktopnotification";

const WS_URL = "https://apislack.a2groups.org/ws";
// Live ke liye:
// const WS_URL = "https://apislack.a2groups.org/ws";

const getChatNotifBody = ( message ) =>
{
    if ( message.type === "TEXT" ) return message.content;
    if ( message.type === "IMAGE" ) return "📷 Sent a photo";
    if ( message.type === "VIDEO" ) return "🎥 Sent a video";
    return `📄 ${ message.fileName || "Sent a file" }`;
};

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
        if ( !currentUserId ) return;

        const token = localStorage.getItem( "jwt" );

        const client = new Client( {
            webSocketFactory: () => new SockJS( WS_URL ),
            connectHeaders: {
                Authorization: `Bearer ${ token }`,
            },
            reconnectDelay: 5000,

            onConnect: () =>
            {
                console.log( "Global WS connected, userId:", currentUserId );

                // 1. User-specific chat notification
                // Isse user app me kahin bhi ho, notification aayega.
                client.subscribe( `/topic/chat-user/${ currentUserId }`, ( message ) =>
                {
                    const received = JSON.parse( message.body );

                    if ( received.sender?.id === currentUserId ) return;

                    const roomId =
                        received.chatRoom?.id ||
                        received.roomId ||
                        received.chatRoomId ||
                        received.room?.id;

                    const notifTitle = received.sender?.fullName || "New Message";
                    const notifBody = getChatNotifBody( received );

                    dispatch(
                        addNotification( {
                            id: `chat-user-${ roomId || "room" }-${ Date.now() }`,
                            type: "CHAT",
                            title: notifTitle,
                            body: notifBody,
                            roomId,
                            roomName: received.chatRoom?.name || received.roomName,
                            createdAt: new Date().toISOString(),
                            read: false,
                        } )
                    );

                    if ( document.hidden )
                    {
                        showNotification( notifTitle, notifBody, {
                            tag: `chat-user-${ currentUserId }`,
                        } );
                    }
                } );

                // 2. Room messages
                // Isse chat open hone par messages realtime add honge.
                if ( chatRooms?.length )
                {
                    chatRooms.forEach( ( room ) =>
                    {
                        client.subscribe( `/topic/room/${ room.id }`, ( message ) =>
                        {
                            const received = JSON.parse( message.body );

                            dispatch( addMessage( received ) );

                            // Important:
                            // Yahan notification mat add karo,
                            // warna duplicate notification aa sakti hai.
                        } );
                    } );
                }

                // 3. Task status notification
                client.subscribe( `/topic/task-status/${ currentUserId }`, ( message ) =>
                {
                    const event = JSON.parse( message.body );

                    const title = "Task Status Updated";
                    const body = `"${ event.taskTitle }" is now ${ event.newStatus } - by ${ event.changedByName }`;

                    dispatch(
                        addNotification( {
                            id: `task-status-${ event.taskId }-${ Date.now() }`,
                            type: "TASK_STATUS",
                            title,
                            body,
                            taskId: event.taskId,
                            taskTitle: event.taskTitle,
                            newStatus: event.newStatus,
                            createdAt: new Date().toISOString(),
                            read: false,
                        } )
                    );

                    showNotification( title, body, {
                        tag: `task-status-${ event.taskId }`,
                    } );
                } );

                // 4. Task comment notification
                client.subscribe( `/topic/task-comment/${ currentUserId }`, ( message ) =>
                {
                    console.log( "Task comment event received:", message.body );

                    const event = JSON.parse( message.body );

                    const title = "💬 New Comment";
                    const body = `${ event.commenterName } commented on "${ event.taskTitle }"`;

                    dispatch(
                        addNotification( {
                            id: `comment-${ event.taskId }-${ Date.now() }`,
                            type: "COMMENT",
                            title,
                            body,
                            taskId: event.taskId,
                            taskTitle: event.taskTitle,
                            createdAt: new Date().toISOString(),
                            read: false,
                        } )
                    );

                    showNotification( title, body, {
                        tag: `task-comment-${ event.taskId }`,
                    } );
                } );
            },

            onStompError: ( frame ) =>
            {
                console.error( "Global WS broker error:", frame.headers[ "message" ] );
            },

            onWebSocketError: ( err ) =>
            {
                console.error( "Global WS error:", err );
            },
        } );

        client.activate();
        clientRef.current = client;

        return () =>
        {
            if ( clientRef.current?.active )
            {
                clientRef.current.deactivate();
            }
        };
    }, [ currentUserId, chatRooms, dispatch, showNotification ] );
};

export default useGlobalChat;