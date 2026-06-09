import React from "react";
import ProjectScoreCard from "./ProjectScoreCard";
import
{
    getMyScore,
    getLeaderboard,
    getUserScore,
} from "../../redux/member/scoreSlice";
import userAvatar from "../../assets/userAvatar.png";

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

const StatPill = ( { label, value, color } ) => (
    <div className="flex flex-col items-center bg-[#F7F7F7] rounded-xl px-4 py-3 min-w-20">
        <span className="text-[20px] font-bold" style={ { color } }>
            { value }
        </span>
        <span className="text-[11px] text-[#969696] mt-0.5">{ label }</span>
    </div>
);

const ScoreDetail = ( { score, onBack } ) =>
{
    const rankInfo = getRank( score.totalScore );

    return (
        <div className="mt-5">
            <div
                style={ {
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                } }
                className="bg-white rounded-lg px-6 py-5 mb-5 flex items-center gap-5"
            >
                <img
                    src={ score.profileImage || userAvatar }
                    alt={ score.fullName }
                    className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                    <h2 className="text-[17px] font-bold text-gray-800">
                        { score.fullName }
                    </h2>
                    <span
                        className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full"
                        style={ { color: rankInfo.color, backgroundColor: rankInfo.bg } }
                    >
                        { rankInfo.label }
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-[28px] font-bold text-gray-800">
                        { score.totalScore }
                    </p>
                    <p className="text-[12px] text-[#969696]">Total Score</p>
                </div>
            </div>

            <div className="flex gap-3 flex-wrap mb-5">
                <StatPill
                    label="Completed"
                    value={ score.tasksCompleted }
                    color="#000"
                />
                <StatPill label="On Time" value={ score.onTimeCount } color="#000" />
                <StatPill label="Early" value={ score.earlyCount } color="#000" />
                <StatPill label="Late" value={ score.lateCount } color="#000" />
                <StatPill
                    label="Done Rate"
                    value={ `${ score.completionRate }%` }
                    color="#000"
                />
            </div>

            <h3 className="text-[13px] font-semibold text-gray-700 mb-3">
                Project Breakdown
            </h3>
            <div className="space-y-3">
                { score.projectScores?.length === 0 ? (
                    <p className="text-[13px] text-[#969696] text-center py-6">
                        No completed tasks yet.
                    </p>
                ) : (
                    score.projectScores?.map( ( ps ) => (
                        <ProjectScoreCard key={ ps.projectId } ps={ ps } />
                    ) )
                ) }
            </div>
        </div>
    );
};

export default ScoreDetail