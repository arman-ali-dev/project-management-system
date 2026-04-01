import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import sendIcon from "../../assets/send.png";
import attachFileIcon from "../../assets/attach.png";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchMessages } from "../../redux/member/chatSlice";
import { uploadToCloudinary } from "../../util/uploadToCloudinary";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const getMessageType = ( file ) =>
{
    if ( file.type.startsWith( "image/" ) ) return "IMAGE";
    if ( file.type.startsWith( "video/" ) ) return "VIDEO";
    return "FILE";
};

const ChatContainer = () =>
{
    const dispatch = useDispatch();
    const { messages } = useSelector( ( state ) => state.chat );
    const { user } = useSelector( ( state ) => state.user );
    const { selectedChatRoom } = useSelector( ( state ) => state.chatRoom );
    const currentUserId = user?.id;

    const [ input, setInput ] = useState( "" );
    const [ uploading, setUploading ] = useState( false );

    const [ previewFile, setPreviewFile ] = useState( null );
    const [ previewUrl, setPreviewUrl ] = useState( null );
    const [ previewCaption, setPreviewCaption ] = useState( "" );

    const clientRef = useRef( null );
    const chatEndRef = useRef( null );
    const fileInputRef = useRef( null );

    useEffect( () =>
    {
        chatEndRef.current?.scrollIntoView( { behavior: "smooth" } );
    }, [ messages ] );

    useEffect( () =>
    {
        dispatch( fetchMessages( selectedChatRoom?.id ) );
    }, [ selectedChatRoom ] );

    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );
        const client = new Client( {
            webSocketFactory: () => new SockJS( "http://localhost:8080/ws" ),
            connectHeaders: { Authorization: `Bearer ${ token }` },
            reconnectDelay: 5000,
            onConnect: () =>
            {
                client.subscribe( `/topic/room/${ selectedChatRoom?.id }`, ( message ) =>
                {
                    const received = JSON.parse( message.body );
                    dispatch( addMessage( received ) );
                } );
            },
            onStompError: ( frame ) =>
                console.error( "Broker error:", frame.headers[ "message" ] ),
            onWebSocketError: ( error ) => console.error( "WebSocket error:", error ),
        } );
        client.activate();
        clientRef.current = client;
        return () =>
        {
            if ( client.active ) client.deactivate();
        };
    }, [ selectedChatRoom?.id ] );

    const handleFileChange = ( e ) =>
    {
        const file = e.target.files[ 0 ];
        if ( !file ) return;

        if ( file.size > MAX_FILE_SIZE )
        {
            alert( "File size must be less than 10 MB" );
            return;
        }

        setPreviewFile( file );
        setPreviewUrl( URL.createObjectURL( file ) );
        setPreviewCaption( "" );
        e.target.value = "";
    };

    const handleSendMedia = async () =>
    {
        if ( !previewFile ) return;
        try
        {
            setUploading( true );
            const fileUrl = await uploadToCloudinary( previewFile );
            const messageType = getMessageType( previewFile );

            clientRef.current.publish( {
                destination: `/app/chat.sendMessage/${ selectedChatRoom?.id }`,
                body: JSON.stringify( {
                    senderId: currentUserId,
                    content: fileUrl,
                    type: messageType,
                    fileName: previewFile.name,
                    caption: previewCaption || null,
                } ),
            } );
        } catch ( err )
        {
            alert( err.message || "Upload failed" );
        } finally
        {
            setUploading( false );
            closePreview();
        }
    };

    const closePreview = () =>
    {
        if ( previewUrl ) URL.revokeObjectURL( previewUrl );
        setPreviewFile( null );
        setPreviewUrl( null );
        setPreviewCaption( "" );
    };

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();
        if ( !input.trim() ) return;
        clientRef.current.publish( {
            destination: `/app/chat.sendMessage/${ selectedChatRoom?.id }`,
            body: JSON.stringify( {
                senderId: currentUserId,
                content: input,
                type: "TEXT",
            } ),
        } );
        setInput( "" );
    };

    const messageType = previewFile ? getMessageType( previewFile ) : null;

    return (
        <div className="h-full w-full flex flex-col relative">
            <ChatHeader />

            <div className="flex-1 flex flex-col min-h-0 pb-4">
                <div className="flex-1 overflow-y-auto px-4 chat-scroll min-h-0">
                    <ChatArea messages={ messages } currentUserId={ currentUserId } />
                    <div ref={ chatEndRef } />
                </div>

                <div className="pt-3 px-4">
                    <form className="relative" onSubmit={ handleSubmit }>
                        <input
                            value={ input }
                            onChange={ ( e ) => setInput( e.target.value ) }
                            type="text"
                            placeholder={ uploading ? "Uploading..." : "Write Message..." }
                            disabled={ uploading }
                            className="text-[13px] outline-0 border border-gray-300 w-full py-2.5 pl-10 pr-12 rounded-md disabled:opacity-60"
                        />
                        <input
                            ref={ fileInputRef }
                            type="file"
                            accept="image/*,video/*,application/pdf,.doc,.docx,.zip"
                            className="hidden"
                            onChange={ handleFileChange }
                        />
                        <img
                            src={ attachFileIcon }
                            alt="Attach"
                            onClick={ () => !uploading && fileInputRef.current?.click() }
                            className={ `absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 cursor-pointer ${ uploading ? "opacity-40" : "" }` }
                        />
                        <button
                            type="submit"
                            disabled={ uploading }
                            className="bg-black px-3 py-2 rounded-md absolute top-1/2 -translate-y-1/2 right-2 disabled:opacity-40"
                        >
                            <img
                                src={ sendIcon }
                                alt="Send"
                                className="w-4 h-4 filter invert"
                            />
                        </button>
                    </form>
                </div>
            </div>

            { previewFile && (
                <div className="absolute inset-0 bg-black/80 z-50 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={ closePreview }
                            className="text-white text-xl font-bold"
                        >
                            ✕
                        </button>
                        <p className="text-white text-sm font-medium truncate max-w-[60%]">
                            { previewFile.name }
                        </p>
                        <span className="text-white/50 text-xs">
                            { ( previewFile.size / 1024 ).toFixed( 1 ) } KB
                        </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
                        { messageType === "IMAGE" && (
                            <img
                                src={ previewUrl }
                                alt="preview"
                                className="max-h-full max-w-full rounded-lg object-contain"
                            />
                        ) }
                        { messageType === "VIDEO" && (
                            <video
                                src={ previewUrl }
                                controls
                                className="max-h-full max-w-full rounded-lg"
                            />
                        ) }
                        { messageType === "FILE" && (
                            <div className="bg-white/10 rounded-xl px-8 py-10 flex flex-col items-center gap-3">
                                <span className="text-5xl">📄</span>
                                <p className="text-white text-sm text-center break-all">
                                    { previewFile.name }
                                </p>
                            </div>
                        ) }
                    </div>

                    <div className="px-4 py-3 flex items-center gap-3">
                        <input
                            value={ previewCaption }
                            onChange={ ( e ) => setPreviewCaption( e.target.value ) }
                            placeholder="Add a caption..."
                            className="flex-1 bg-white/10 text-white placeholder-white/50 text-[13px] px-4 py-2.5 rounded-full outline-none border border-white/20"
                        />
                        <button
                            onClick={ handleSendMedia }
                            disabled={ uploading }
                            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 p-3 rounded-full transition-colors"
                        >
                            { uploading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block" />
                            ) : (
                                <img
                                    src={ sendIcon }
                                    alt="Send"
                                    className="w-5 h-5 filter invert"
                                />
                            ) }
                        </button>
                    </div>
                </div>
            ) }
        </div>
    );
};

export default ChatContainer;
