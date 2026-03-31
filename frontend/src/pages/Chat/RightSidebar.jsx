import React, { useState } from "react";
import mediaIcon from "../../assets/media.png";
import filesIcon from "../../assets/files.png";
import downArrow from "../../assets/arrowDown.png";
import tagIcon from "../../assets/tag.png";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import
{
    faFilePdf,
    faFileWord,
    faFileExcel,
    faFilePowerpoint,
    faFileZipper,
    faFileLines,
    faFile
} from "@fortawesome/free-solid-svg-icons";

const PREVIEW_LIMIT = 4;
const FILE_PREVIEW_LIMIT = 1;


const RightSidebar = () =>
{
    const { selectedChatRoom } = useSelector( ( state ) => state.chatRoom );
    const { messages } = useSelector( ( state ) => state.chat );

    const [ selectedMedia, setSelectedMedia ] = useState( null );
    const [ showAllMedia, setShowAllMedia ] = useState( false );
    const [ allMediaIndex, setAllMediaIndex ] = useState( 0 );
    const mediaMessages = messages.filter( ( msg ) => msg.type === "IMAGE" || msg.type === "VIDEO" );
    const fileMessages = messages.filter( ( msg ) => msg.type === "FILE" );
    const [ showAllFiles, setShowAllFiles ] = useState( false );
    const previewMedia = mediaMessages.slice( 0, PREVIEW_LIMIT );
    const remaining = mediaMessages.length - PREVIEW_LIMIT;

    const openAllMedia = ( startIndex = 0 ) =>
    {
        setAllMediaIndex( startIndex );
        setShowAllMedia( true );
    };

    const MediaThumb = ( { msg, index, isOverlay = false, overlayCount = 0 } ) => (
        <div
            className="relative cursor-pointer rounded-lg overflow-hidden h-17 bg-gray-100 group"
            onClick={ () => isOverlay ? openAllMedia( index ) : setSelectedMedia( msg ) }
        >
            { msg.type === "IMAGE" ? (
                <img
                    src={ msg.content }
                    alt="media"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 relative">
                    <video src={ msg.content } className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="text-white text-xl">▶</span>
                    </div>
                </div>
            ) }

            { isOverlay && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                    <span className="text-white text-lg font-semibold">+{ overlayCount }</span>
                </div>
            ) }
        </div>
    );

    return (
        <>
            <div className="h-full w-full px-4 py-6 border-[rgba(200,200,200,.5)] border-l overflow-y-auto">

                <div className="border-b border-[rgba(200,200,200,.5)] pb-4 mb-3">
                    <div className="bg-[#EFEFEF] w-16 h-16 mx-auto rounded-full flex justify-center items-center">
                        <img src={ tagIcon } alt="tag icon" className="w-5" />
                    </div>
                    <h3 className="text-center mt-2 font-medium text-[13px]">
                        { selectedChatRoom?.project?.name }
                    </h3>
                    <p className="text-center font-medium text-[11px] opacity-65">
                        { selectedChatRoom?.project?.members.length } Members
                    </p>
                </div>

                <div className="border-b border-[rgba(200,200,200,.5)] pb-5 mb-4">
                    <h3 className="font-medium text-[13px]">Description</h3>
                    <p className="text-[12px]">
                        { selectedChatRoom?.project?.description?.split( " " ).slice( 0, 13 ).join( " " ) }
                        { selectedChatRoom?.project?.description?.split( " " ).length > 13 && "..." }
                    </p>
                </div>

                <div className="border-b border-[rgba(200,200,200,.5)] pb-5 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="flex gap-2 items-center font-medium">
                            <img className="w-4" src={ mediaIcon } alt="media icon" />
                            <span className="text-[13px] mt-0.5">
                                Media
                                { mediaMessages.length > 0 && (
                                    <span className="ml-1 opacity-50">({ mediaMessages.length })</span>
                                ) }
                            </span>
                        </h3>
                        { mediaMessages.length > PREVIEW_LIMIT && (
                            <button
                                onClick={ () => openAllMedia( 0 ) }
                                className="text-[11px] opacity-50 hover:opacity-100 transition-opacity"
                            >
                                See all
                            </button>
                        ) }
                    </div>

                    { mediaMessages.length === 0 ? (
                        <p className="text-[12px] opacity-40 text-center mt-4">No media shared yet</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            { previewMedia.map( ( msg, index ) =>
                            {
                                const isLastCell = index === PREVIEW_LIMIT - 1 && remaining > 0;
                                return (
                                    <MediaThumb
                                        key={ index }
                                        msg={ msg }
                                        index={ index }
                                        isOverlay={ isLastCell }
                                        overlayCount={ remaining + 1 }
                                    />
                                );
                            } ) }
                        </div>
                    ) }
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="flex gap-2 items-center font-medium">
                            <img className="w-4" src={ filesIcon } alt="media icon" />
                            <span className="text-[13px] mt-0.5">
                                Files
                                { fileMessages.length > 0 && (
                                    <span className="ml-1 opacity-50">({ fileMessages.length })</span>
                                ) }
                            </span>
                        </h3>
                        { fileMessages.length > FILE_PREVIEW_LIMIT && (
                            <button
                                onClick={ () => setShowAllFiles( true ) }
                                className="text-[11px] opacity-50 hover:opacity-100 transition-opacity"
                            >
                                See all
                            </button>
                        ) }
                    </div>

                    { fileMessages.length === 0 ? (
                        <p className="text-[12px] opacity-40 text-center mt-4">No files shared yet</p>
                    ) : (
                        <div className="space-y-2">
                            { fileMessages.slice( 0, FILE_PREVIEW_LIMIT ).map( ( msg, index ) => (
                                <Link
                                    key={ index }
                                    to={ msg.content }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-lg shadow-sm shrink-0">
                                        { getFileIcon( msg.fileName ) }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-medium truncate">
                                            { msg.fileName || "File" }
                                        </p>
                                        <p className="text-[11px] opacity-40">
                                            { msg.sender?.fullName || "User" } •{ " " }
                                            { msg.sentAt ? new Date( msg.sentAt ).toLocaleDateString() : "" }
                                        </p>
                                    </div>
                                    <span className="text-[11px] opacity-0 group-hover:opacity-40 transition-opacity">⬇</span>
                                </Link>
                            ) ) }
                        </div>
                    ) }
                </div>
            </div>

            { selectedMedia && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center"
                    onClick={ () => setSelectedMedia( null ) }
                >
                    <button
                        className="absolute top-4 right-4 text-white text-2xl font-bold z-10"
                        onClick={ () => setSelectedMedia( null ) }
                    >
                        ✕
                    </button>
                    <div className="absolute top-4 left-4 text-white">
                        <p className="text-sm font-medium">{ selectedMedia.sender?.fullName || "User" }</p>
                        <p className="text-xs opacity-50">
                            { selectedMedia.sentAt ? new Date( selectedMedia.sentAt ).toLocaleString() : "" }
                        </p>
                    </div>
                    <div className="max-w-[90vw] max-h-[80vh]" onClick={ ( e ) => e.stopPropagation() }>
                        { selectedMedia.type === "IMAGE" ? (
                            <img src={ selectedMedia.content } alt="full view" className="max-w-full max-h-[80vh] rounded-lg object-contain" />
                        ) : (
                            <video src={ selectedMedia.content } controls autoPlay className="max-w-full max-h-[80vh] rounded-lg" />
                        ) }
                        { selectedMedia.caption && (
                            <p className="text-white text-sm text-center mt-3 opacity-80">{ selectedMedia.caption }</p>
                        ) }
                    </div>
                    <Link
                        to={ selectedMedia.content }
                        target="_blank"
                        rel="noreferrer"
                        onClick={ ( e ) => e.stopPropagation() }
                        className="absolute bottom-6 bg-white/10 hover:bg-white/20 text-white text-[13px] px-4 py-2 rounded-full border border-white/20 transition-colors"
                    >
                        ⬇ Download
                    </Link>
                </div>
            ) }

            { showAllMedia && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex flex-col"
                    onClick={ () => setShowAllMedia( false ) }
                >
                    <div className="flex items-center justify-between px-5 py-4" onClick={ ( e ) => e.stopPropagation() }>
                        <h3 className="text-white font-medium">
                            All Media
                            <span className="ml-2 opacity-50 text-sm">({ mediaMessages.length })</span>
                        </h3>
                        <button
                            className="text-white text-2xl font-bold"
                            onClick={ () => setShowAllMedia( false ) }
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-4 overflow-hidden" onClick={ ( e ) => e.stopPropagation() }>
                        { mediaMessages[ allMediaIndex ]?.type === "IMAGE" ? (
                            <img
                                src={ mediaMessages[ allMediaIndex ].content }
                                alt="full view"
                                className="max-w-full max-h-full rounded-lg object-contain"
                            />
                        ) : (
                            <video
                                src={ mediaMessages[ allMediaIndex ]?.content }
                                controls
                                autoPlay
                                className="max-w-full max-h-full rounded-lg"
                            />
                        ) }
                    </div>

                    <div
                        className="flex gap-2 px-4 py-3 overflow-x-auto"
                        onClick={ ( e ) => e.stopPropagation() }
                    >
                        { mediaMessages.map( ( msg, index ) => (
                            <div
                                key={ index }
                                onClick={ () => setAllMediaIndex( index ) }
                                className={ `shrink-0 w-14 h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${ allMediaIndex === index ? "border-white" : "border-transparent opacity-60"
                                    }` }
                            >
                                { msg.type === "IMAGE" ? (
                                    <img src={ msg.content } alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                        <span className="text-white text-xs">▶</span>
                                    </div>
                                ) }
                            </div>
                        ) ) }
                    </div>
                </div>
            ) }

            { showAllFiles && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex flex-col"
                    onClick={ () => setShowAllFiles( false ) }
                >
                    <div
                        className="bg-white w-full max-w-md mx-auto mt-auto rounded-t-2xl flex flex-col max-h-[80vh]"
                        onClick={ ( e ) => e.stopPropagation() }
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="font-medium text-[14px]">
                                All Files
                                <span className="ml-2 opacity-50 text-[12px]">({ fileMessages.length })</span>
                            </h3>
                            <button
                                className="text-gray-500 text-xl cursor-pointer font-bold"
                                onClick={ () => setShowAllFiles( false ) }
                            >
                                ✕
                            </button>
                        </div>

                        <div className="overflow-y-auto px-4 py-3 space-y-2">
                            { fileMessages.map( ( msg, index ) => (
                                <Link
                                    key={ index }
                                    to={ msg.content }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-lg shadow-sm shrink-0">
                                        { getFileIcon( msg.fileName ) }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-medium truncate">
                                            { msg.fileName || "File" }
                                        </p>
                                        <p className="text-[11px] opacity-40">
                                            { msg.sender?.fullName || "User" } •{ " " }
                                            { msg.sentAt ? new Date( msg.sentAt ).toLocaleDateString() : "" }
                                        </p>
                                    </div>
                                    <span className="text-[11px] opacity-0 group-hover:opacity-40 transition-opacity">⬇</span>
                                </Link>
                            ) ) }
                        </div>
                    </div>
                </div>
            ) }
        </>
    );
};

const getFileIcon = ( fileName ) =>
{

    const ext = fileName.split( "." ).pop().toLowerCase();
    const icons = {
        pdf: <FontAwesomeIcon icon={ faFilePdf } />,
        doc: <FontAwesomeIcon icon={ faFileWord } />,
        docx: <FontAwesomeIcon icon={ faFileWord } />,
        xls: <FontAwesomeIcon icon={ faFileExcel } />,
        xlsx: <FontAwesomeIcon icon={ faFileExcel } />,
        zip: <FontAwesomeIcon icon={ faFileZipper } />,
        rar: <FontAwesomeIcon icon={ faFileZipper } />,
        ppt: <FontAwesomeIcon icon={ faFilePowerpoint } />,
        pptx: <FontAwesomeIcon icon={ faFilePowerpoint } />,
        txt: <FontAwesomeIcon icon={ faFileLines } />,
        default: <FontAwesomeIcon icon={ faFile } />
    };
    return icons[ ext ]
};

export default RightSidebar;