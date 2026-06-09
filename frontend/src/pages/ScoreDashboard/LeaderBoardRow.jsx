import React from 'react'
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

const LeaderboardRow = ( { score, rank, onClick } ) =>
{
    const rankInfo = getRank( score.totalScore );

    return (
        <div
            onClick={ onClick }
            className="flex items-center gap-4 mt-5 px-5 py-3.5 rounded-xl border border-[rgba(221,221,221,0.6)]  hover:bg-[rgba(73,122,245,0.03)] transition-all "
        >
            <img
                src={ score.profileImage || userAvatar }
                alt={ score.fullName }
                className="w-9 h-9 rounded-full object-cover shrink-0"
            />

            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-gray-800 truncate">
                    { score.fullName }
                </p>
                <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={ { color: rankInfo.color, backgroundColor: rankInfo.bg } }
                >
                    { rankInfo.label }
                </span>
            </div>

            <div className="flex gap-4 shrink-0 text-right">
                <div>
                    <p className="text-[13px] font-bold text-gray-800">
                        { score.totalScore }
                    </p>
                    <p className="text-[10px] text-[#969696]">Score</p>
                </div>
                <div>
                    <p className="text-[13px] font-bold text-[#09C015]">
                        { score.onTimeCount }
                    </p>
                    <p className="text-[10px] text-[#969696]">On time</p>
                </div>
                <div>
                    <p className="text-[13px] font-bold text-[#FA2626]">
                        { score.lateCount }
                    </p>
                    <p className="text-[10px] text-[#969696]">Late</p>
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-600">
                        { score.completionRate }%
                    </p>
                    <p className="text-[10px] text-[#969696]">Done</p>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardRow