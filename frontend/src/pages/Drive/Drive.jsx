import React, { useRef, useState } from "react";
import searchIcon from "../../assets/search.png";
import { Alert, IconButton, Snackbar } from "@mui/material";
import settingIcon from "../../assets/setting.png";
import RecentFiles from "./RecentFIles";
import PublicFiles from "./PublicFiles";
import plusIcon from "../../assets/plus.png";
import FileDetails from "./FIleDetails";
import { useDispatch } from "react-redux";
import { uploadDocument } from "../../redux/member/documentSlice";
import { uploadToCloudinary } from "../../util/uploadToCloudinary";

const Drive = () =>
{
    const dispatch = useDispatch();
    const fileInputRef = useRef( null );
    const [ openSnack, setOpenSnack ] = useState( false );
    const [ snackMessage, setSnackMessage ] = useState( "" );
    const [ snackType, setSnackType ] = useState( "success" );

    const [ uploading, setUploading ] = useState( false );

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const handleUpload = async ( e ) =>
    {
        const file = e.target.files[ 0 ];
        if ( file.size > MAX_FILE_SIZE )
        {
            setSnackType( "error" );
            setSnackMessage( `${ file.name } exceeds 50MB` );
            setOpenSnack( true );

            console.log( `${ file.name } exceeds 50MB` );
        }


        try
        {
            setUploading( true );
            const url = await uploadToCloudinary( file );

            console.log( file );

            const document = {
                fileName: file.name,
                fileUrl: url,
                fileType:
                    file?.format?.toString().toUpperCase() ||
                    file.type.split( "/" )[ 1 ].toUpperCase(),
                visibility: "PUBLIC",
                fileSize: Math.round( file.size ),
            }



            dispatch( uploadDocument( { document, folderId: null } ) );

        } catch ( err )
        {
            console.error( "Upload failed", err );
            setSnackType( "error" );
            setSnackMessage( err?.message || "Upload failed" );
            setOpenSnack( true );
        } finally
        {
            setUploading( false );
        }
    };



    return (
        <>
            <div className="mt-4 mx-8 relative">
                <div className="bg-white shadow flex justify-between items-center rounded-lg px-5 py-2.5">
                    <div className="flex gap-2 items-center">
                        <div className="bg-[#EFEFEF] h-8 w-8 rounded-lg flex justify-center items-center">
                            <img className="w-3" src={ searchIcon } alt="" />
                        </div>
                        <input
                            className="placeholder:text-[#000000] border-0 mt-1 outline-0 text-[13px] placeholder:text-[13px] opacity-80"
                            type="text"
                            placeholder="Search files and folders..."
                        />
                    </div>

                    <div className="flex gap-2">
                        <IconButton
                            sx={ {
                                width: 36,
                                height: 36,
                                backgroundColor: "#EFEFEF",
                                cursor: "pointer",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                "&:hover": { backgroundColor: "#EFEFEF" },
                            } }
                        >
                            <img src={ settingIcon } alt="" className="w-4" />
                        </IconButton>

                        <IconButton
                            onClick={ () => fileInputRef.current.click() }
                            sx={ {
                                width: 36,
                                height: 36,
                                backgroundColor: "#EFEFEF",
                                cursor: "pointer",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                "&:hover": { backgroundColor: "#EFEFEF" },
                            } }
                        >
                            <img className="w-3.5" src={ plusIcon } alt="" />
                        </IconButton>
                        <input
                            ref={ fileInputRef }
                            type="file"
                            className="hidden"
                            onChange={ handleUpload }
                        />
                    </div>
                </div>

                <RecentFiles />
                <div className="grid grid-cols-4">
                    <div className="col-span-3 mr-3">
                        <PublicFiles />
                    </div>
                    <FileDetails />
                </div>
            </div>


            <Snackbar
                open={ openSnack }
                autoHideDuration={ 3000 }
                onClose={ () => setOpenSnack( false ) }
                anchorOrigin={ { vertical: "top`", horizontal: "right" } }
            >
                <Alert
                    onClose={ () => setOpenSnack( false ) }
                    severity={ snackType }
                    sx={ {
                        width: "100%",
                        fontSize: "13px",
                    } }
                >
                    { snackMessage }
                </Alert>
            </Snackbar>
        </>
    );
};

export default Drive;