import React from "react";
import userAvatar from "../../assets/userAvatar.png";
import { Link } from "react-router-dom";


const MessageContent = ( { msg } ) =>
{
    switch ( msg.type )
    {
        case "IMAGE":
            return (
                <div>
                    <img
                        src={ msg.content }
                        alt="media"
                        className="max-w-55 rounded-lg cursor-pointer object-cover"
                        onClick={ () => window.open( msg.content, "_blank" ) }
                    />
                    { msg.caption && (
                        <p className="text-[12px] mt-1 text-gray-700">{ msg.caption }</p>
                    ) }
                </div>
            );

        case "VIDEO":
            return (
                <div>
                    <video controls className="max-w-55 rounded-lg">
                        <source src={ msg.content } />
                    </video>
                    { msg.caption && (
                        <p className="text-[12px] mt-1 text-gray-700">{ msg.caption }</p>
                    ) }
                </div>
            );

        case "FILE":
            return (
                <Link
                    to={ msg.content }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 underline text-[12px]"
                >
                    <span>📎</span>
                    <span>{ msg.fileName || "Download File" }</span>
                </Link>
            );

        default: // TEXT
            return <p className="text-[12px]">{ msg.content }</p>;
    }
};

const ChatArea = ( { messages, currentUserId } ) =>
{
    return (
        <div className="py-4 space-y-4">
            { messages.map( ( msg, index ) =>
            {
                const isMine = msg.sender?.id === currentUserId;
                const isMedia = [ "IMAGE", "VIDEO", "FILE" ].includes( msg.type );

                return (
                    <div
                        key={ index }
                        className={ `flex gap-3 items-start ${ isMine ? "justify-end" : "" }` }
                    >
                        { !isMine && (
                            <img
                                src={ msg.sender?.profileImage || userAvatar }
                                alt="Profile"
                                className="w-7.5 h-7.5 mt-1 rounded-full object-cover"
                            />
                        ) }

                        <div>
                            <div
                                className={ `flex gap-2 items-center ${ isMine ? "justify-end" : "" }` }
                            >
                                { !isMine && (
                                    <>
                                        <p className="text-[13px]">
                                            { msg.sender?.fullName || "User" }
                                        </p>
                                        <span className="h-1 w-1 bg-black rounded-full"></span>
                                    </>
                                ) }
                                <p className="opacity-30 text-[12px]">
                                    { msg.sentAt
                                        ? new Date( msg.sentAt ).toLocaleTimeString( [], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        } )
                                        : "" }
                                </p>
                                { isMine && (
                                    <>
                                        <span className="h-1 w-1 bg-black rounded-full"></span>
                                        <p className="text-[13px]">You</p>
                                    </>
                                ) }
                            </div>


                            <div
                                className={ `mt-0.5 ${ isMedia ? "" : "bg-[#EAEAEA] px-3 py-1.5 rounded-bl-lg rounded-tr-lg" }` }
                            >
                                <MessageContent msg={ msg } />
                            </div>
                        </div>
                    </div>
                );
            } ) }
        </div>
    );
};

export default ChatArea;
