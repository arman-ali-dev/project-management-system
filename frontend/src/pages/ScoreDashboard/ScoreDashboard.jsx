// src/pages/Dashboard/ScoreDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import
{
    getMyScore,
    getLeaderboard,
    getUserScore,
} from "../../redux/member/scoreSlice";
import userAvatar from "../../assets/userAvatar.png";
import { CircularProgress } from "@mui/material";
import LeaderboardRow from "./LeaderBoardRow";
import ScoreDetail from "./ScoreDetails";

const getRank = ( score ) =>
{
    if ( score >= 400 )
        return { label: "Elite", color: "#F5A623", bg: "rgba(245,166,35,0.12)" };
    if ( score >= 250 )
        return { label: "Pro", color: "#497AF5", bg: "rgba(73,122,245,0.12)" };
    if ( score >= 100 )
        return { label: "Rising", color: "#09C015", bg: "rgba(9,192,21,0.12)" };
    return { label: "Starter", color: "#969696", bg: "rgba(150,150,150,0.12)" };
};



const ScoreDashboard = () =>
{
    const dispatch = useDispatch();
    const { user } = useSelector( ( state ) => state.user );
    const { myScore, leaderboard, selected, loading } = useSelector(
        ( state ) => state.score,
    );

    const isAdmin = user?.role === "ADMIN";
    const [ view, setView ] = useState( "main" ); // "main" | "detail"

    useEffect( () =>
    {
        if ( isAdmin )
        {
            dispatch( getLeaderboard() );
        } else
        {
            dispatch( getMyScore() );
        }
    }, [ isAdmin ] );

    const handleRowClick = ( userId ) =>
    {
        dispatch( getUserScore( userId ) );
        setView( "detail" );
    };

    if ( loading )
    {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress size={ 28 } sx={ { color: "#497AF5" } } />
            </div>
        );
    }

    return (
        <div className="mt-4 mx-8">
            { isAdmin && (
                <>
                    { view === "detail" && selected ? (
                        <ScoreDetail score={ selected } onBack={ () => setView( "main" ) } />
                    ) : (
                        <>
                            <div
                                className="bg-white rounded-lg px-5 py-2.5"
                                style={ {
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                    transition: "opacity 0.4s ease, transform 0.4s ease",
                                } }
                            >
                                <p className="text-[14px] font-semibold">Scores</p>
                                <p className="text-[12px] text-[#969696] mt-0.5 font-semibold">
                                    Task completion scores
                                </p>
                            </div>

                            { leaderboard.length === 0 ? (
                                <p className="text-center text-[13px] text-[#969696] py-16">
                                    No data yet.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    { leaderboard.map( ( score, idx ) => (
                                        <LeaderboardRow
                                            key={ score.userId }
                                            score={ score }
                                            rank={ idx + 1 }
                                            onClick={ () => handleRowClick( score.userId ) }
                                        />
                                    ) ) }
                                </div>
                            ) }
                        </>
                    ) }
                </>
            ) }

            { !isAdmin && myScore && (
                <>
                    {/* <div className="mb-5">
                        <h1 className="text-[18px] font-bold text-gray-800">My Score</h1>
                        <p className="text-[12px] text-[#969696] mt-0.5">Your task completion performance</p>
                    </div> */}

                    <div
                        className="bg-white rounded-lg px-5 py-2.5"
                        style={ {
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            transition: "opacity 0.4s ease, transform 0.4s ease",
                        } }
                    >
                        <p className="text-[14px] font-semibold">My Score</p>
                        <p className="text-[12px] text-[#969696] mt-0.5 font-semibold">
                            Your task completion performance
                        </p>
                    </div>

                    <ScoreDetail score={ myScore } onBack={ null } />
                </>
            ) }

            { !isAdmin && !myScore && !loading && (
                <p className="text-center text-[13px] text-[#969696] py-16">
                    No completed tasks yet.
                </p>
            ) }
        </div>
    );
};

export default ScoreDashboard;
