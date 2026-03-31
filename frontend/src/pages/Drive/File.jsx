import React from "react";
import docIcon from "../../assets/doc.png";
import optionIcon from "../../assets/option.png";
import { useDispatch } from "react-redux";
import { setSelectedFile } from "../../redux/member/documentSlice";

const getFileIcon = ( fileName, fileType ) =>
{
    if ( !fileName ) return docIcon;
    const ext = fileName.split( "." ).pop()?.toLowerCase();

    return docIcon;
};

const File = ( { file } ) =>
{
    const dispatch = useDispatch();

    const handleClick = () =>
    {
        dispatch( setSelectedFile( file ) );
    };

    return (
        <>
            <div className="w-full cursor-pointer" onClick={ handleClick }>
                <div className="bg-[rgba(150,150,150,.1)] w-full h-34 border rounded-t-[18px] flex justify-center items-center border-[rgba(200,200,200,.5)] hover:bg-[rgba(150,150,150,.2)] transition-colors">
                    <img
                        src={ getFileIcon( file?.fileName, file?.fileType ) }
                        alt="Document Icon"
                        className="w-13 h-13"
                    />
                </div>

                <div className="rounded-b-[18px] py-1.5 flex justify-between items-center px-4 border border-[#C8C8C8]">
                    <p className="font-medium text-[13px] text-[#626262] truncate max-w-[80%]">
                        { file?.fileName || "filename.txt" }
                    </p>
                    <img
                        src={ optionIcon }
                        alt="Options Icon"
                        className="w-4.5 cursor-pointer h-4.5"
                    />
                </div>
            </div>
        </>
    );
};

export default File;