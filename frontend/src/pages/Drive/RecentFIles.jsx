import React, { useEffect } from "react";
import File from "./File";
import filter2Icon from "../../assets/filter2.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentFiles } from "../../redux/member/documentSlice";

const RecentFiles = () =>
{
    const dispatch = useDispatch();
    const { recentFiles, loading } = useSelector( ( state ) => state.document );

    useEffect( () =>
    {
        dispatch( fetchRecentFiles() );
    }, [ dispatch ] );

    return (
        <div className="bg-white shadow mt-4 rounded-lg px-5 py-4">
            <div className="flex justify-between items-center">
                <h3 className="text-[14px] font-semibold">Recent Files</h3>

                <div className="flex gap-1 items-center cursor-pointer">
                    <img src={ filter2Icon } alt="Filter Icon" className="w-4 h-4" />
                    <p className="text-[12px] font-medium text-[#555454]">Newest First</p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mt-3">
                { loading ? (
                    // Skeleton loaders
                    Array( 5 ).fill( 0 ).map( ( _, i ) => (
                        <div key={ i } className="w-full animate-pulse">
                            <div className="bg-gray-200 w-full h-34 rounded-t-[18px]"></div>
                            <div className="bg-gray-100 rounded-b-[18px] py-3 px-4">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ) )
                ) : recentFiles?.length > 0 ? (
                    recentFiles.map( ( file ) => (
                        <File key={ file.id } file={ file } />
                    ) )
                ) : (
                    <p className="col-span-5 text-center text-[13px] text-gray-400 py-4">
                        No recent files
                    </p>
                ) }
            </div>
        </div>
    );
};

export default RecentFiles;