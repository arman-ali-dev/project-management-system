import React from "react";
import docIcon from "../../assets/doc.png";
import viewIcon from "../../assets/view.png";
import editIcon from "../../assets/edit.png";
import shareIcon from "../../assets/share.png";
import { useSelector } from "react-redux";

const permissionColor = {
    EDITOR: "#09c015e6",
    Editor: "#09c015e6",
    ADMINISTRATOR: "#fa2626e6",
    Administrator: "#fa2626e6",
    VIEWER: "#605d5de6",
    "View Only": "#605d5de6",
};

const formatDate = ( dateStr ) =>
{
    if ( !dateStr ) return "";
    const date = new Date( dateStr );
    return `${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`;
};

const formatSize = ( bytes ) =>
{
    if ( !bytes ) return "";
    if ( bytes >= 1e9 ) return `${ ( bytes / 1e9 ).toFixed( 0 ) } GB`;
    if ( bytes >= 1e6 ) return `${ ( bytes / 1e6 ).toFixed( 0 ) } MB`;
    if ( bytes >= 1e3 ) return `${ ( bytes / 1e3 ).toFixed( 0 ) } KB`;
    return `${ bytes } B`;
};

const FileDetails = () =>
{
    const { selectedFile } = useSelector( ( state ) => state.document );

    return (
        <div className="bg-white shadow mt-4 rounded-lg px-5 py-4">
            <h3 className="text-[14px] font-semibold border-b pb-2 border-[rgba(0,0,0,.3)]">
                File Details
            </h3>

            { selectedFile ? (
                <>
                    <div className="w-full mt-4">
                        <div className="bg-[rgba(150,150,150,.1)] py-6 w-full border rounded-[18px] flex justify-center items-center border-[rgba(200,200,200,.5)]">
                            <div className="text-center">
                                <img
                                    src={ docIcon }
                                    alt="Document Icon"
                                    className="w-13 h-13 mx-auto"
                                />
                                <p
                                    className="text-[12px] mt-1.5 font-medium"
                                    style={ { color: permissionColor[ selectedFile.visibility ] || "#555" } }
                                >
                                    { selectedFile.visibility || "PUBLIC" }
                                </p>
                                <h3 className="text-[13px] -mt-0.5 font-medium truncate max-w-[140px] mx-auto">
                                    { selectedFile.fileName }
                                </h3>
                                <p className="text-[13px]">
                                    Modified: { formatDate( selectedFile.updatedAt ) }
                                </p>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-[14px] mt-5 font-semibold border-b pb-2 border-[rgba(0,0,0,.3)]">
                        File Overview
                    </h3>

                    <div className="mt-3 space-y-1.5">
                        <div className="flex justify-between text-[13px] text-[#212121] font-medium">
                            <div className="flex items-center gap-1.5">
                                <img src={ viewIcon } alt="View Icon" className="w-4.5 mt-0.5 h-4.5 inline" />
                                <p>Views</p>
                            </div>
                            <p>{ selectedFile.views ?? 0 }</p>
                        </div>

                        <div className="flex justify-between text-[13px] text-[#212121] font-medium">
                            <div className="flex items-center gap-1.5">
                                <img src={ editIcon } alt="Edit Icon" className="w-4.5 mt-0.5 h-4.5 inline" />
                                <p>Edits</p>
                            </div>
                            <p>{ selectedFile.edits ?? 0 }</p>
                        </div>

                        <div className="flex justify-between text-[13px] text-[#212121] font-medium">
                            <div className="flex items-center gap-1.5">
                                <img src={ shareIcon } alt="Share Icon" className="w-4.5 mt-0.5 h-4.5 inline" />
                                <p>Size</p>
                            </div>
                            <p>{ formatSize( selectedFile.fileSize ) }</p>
                        </div>
                    </div>
                </>
            ) : (
                // Empty state
                <div className="w-full mt-4">
                    <div className="bg-[rgba(150,150,150,.1)] py-6 w-full border rounded-[18px] flex justify-center items-center border-[rgba(200,200,200,.5)]">
                        <div className="text-center">
                            <img src={ docIcon } alt="Document Icon" className="w-13 h-13 mx-auto opacity-40" />
                            <p className="text-[12px] mt-2 text-gray-400">Select a file to see details</p>
                        </div>
                    </div>

                    <h3 className="text-[14px] mt-5 font-semibold border-b pb-2 border-[rgba(0,0,0,.3)]">
                        File Overview
                    </h3>

                    <div className="mt-3 space-y-1.5">
                        <div className="flex justify-between text-[13px] text-[#212121] font-medium">
                            <div className="flex items-center gap-1.5">
                                <img src={ viewIcon } alt="View Icon" className="w-4.5 mt-0.5 h-4.5 inline" />
                                <p>Views</p>
                            </div>
                            <p className="text-gray-400">-</p>
                        </div>

                        <div className="flex justify-between text-[13px] text-[#212121] font-medium">
                            <div className="flex items-center gap-1.5">
                                <img src={ editIcon } alt="Edit Icon" className="w-4.5 mt-0.5 h-4.5 inline" />
                                <p>Edits</p>
                            </div>
                            <p className="text-gray-400">-</p>
                        </div>

                        <div className="flex justify-between text-[13px] text-[#212121] font-medium">
                            <div className="flex items-center gap-1.5">
                                <img src={ shareIcon } alt="Share Icon" className="w-4.5 mt-0.5 h-4.5 inline" />
                                <p>Size</p>
                            </div>
                            <p className="text-gray-400">-</p>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
};

export default FileDetails;