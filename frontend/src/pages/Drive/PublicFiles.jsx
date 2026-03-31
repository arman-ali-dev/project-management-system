import { IconButton } from "@mui/material";
import React, { useEffect, useRef } from "react";
import filterIcon from "../../assets/filter.png";
import plusIcon from "../../assets/plus.png";
import FileTable from "./FileTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicFiles, uploadDocument } from "../../redux/member/documentSlice";

const PublicFiles = () =>
{
    const dispatch = useDispatch();
    const fileInputRef = useRef( null );
    const { publicFiles, loading } = useSelector( ( state ) => state.document );

    useEffect( () =>
    {
        dispatch( fetchPublicFiles() );
    }, [ dispatch ] );

    const handleUpload = ( e ) =>
    {
        const file = e.target.files[ 0 ];
        if ( file )
        {
            dispatch( uploadDocument( { file, folderId: null } ) );
        }
    };

    return (
        <div className="bg-white shadow mt-4 rounded-lg px-5 py-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <h3 className="text-[14px] font-semibold">Public Files</h3>
                    <span className="py-1 px-3 bg-[rgba(217,217,217,.6)] text-[11px] font-medium text-[rgba(0,0,0,.5)] rounded-full">
                        { publicFiles?.length || 0 } Totals
                    </span>
                </div>

                <div className="flex gap-2">
                    <IconButton
                        sx={ {
                            width: 36,
                            height: 36,
                            backgroundColor: "#EFEFEF",
                            cursor: "pointer",
                            borderRadius: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "&:hover": { backgroundColor: "#EFEFEF" },
                        } }
                    >
                        <img src={ filterIcon } alt="" className="w-3.5" />
                    </IconButton>

                    <IconButton
                        onClick={ () => fileInputRef.current.click() }
                        sx={ {
                            width: 36,
                            height: 36,
                            backgroundColor: "#EFEFEF",
                            cursor: "pointer",
                            borderRadius: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "&:hover": { backgroundColor: "#EFEFEF" },
                        } }
                    >
                        <img className="w-3" src={ plusIcon } alt="" />
                    </IconButton>
                    <input
                        ref={ fileInputRef }
                        type="file"
                        className="hidden"
                        onChange={ handleUpload }
                    />
                </div>
            </div>

            <div className="mt-5">
                { loading ? (
                    <div className="space-y-3">
                        { Array( 3 ).fill( 0 ).map( ( _, i ) => (
                            <div key={ i } className="h-12 bg-gray-100 rounded animate-pulse" />
                        ) ) }
                    </div>
                ) : (
                    <FileTable files={ publicFiles } />
                ) }
            </div>
        </div>
    );
};

export default PublicFiles;