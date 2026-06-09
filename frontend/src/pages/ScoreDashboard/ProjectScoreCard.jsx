import React from "react";

const getScoreColor = ( score, max = 130 ) =>
{
    if ( score >= max * 0.9 ) return "#09C015";
    if ( score >= max * 0.6 ) return "#497AF5";
    if ( score >= max * 0.3 ) return "#E8A020";
    return "#000";
};


const ProjectScoreCard = ( { ps } ) => (
    <div className="border border-[rgba(221,221,221,0.7)] rounded-xl px-5 py-4">
        <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-gray-800 truncate">
                { ps.projectName }
            </p>
            <span
                className="text-[13px] font-bold"
                style={ { color: getScoreColor( ps.score, ps.tasksCompleted * 130 ) } }
            >
                { ps.score } pts
            </span>
        </div>

        {/* Progress bar */ }
        <div className="h-1.5 w-full bg-[#F0F0F0] rounded-full mb-3">
            <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={ {
                    width: `${ Math.min( ( ps.score / ( ps.tasksCompleted * 130 ) ) * 100, 100 ) }%`,
                    backgroundColor: getScoreColor( ps.score, ps.tasksCompleted * 130 ),
                } }
            />
        </div>

        <div className="flex gap-3 text-[11px]">
            <span className="text-[#09C015]">{ ps.onTimeCount } on time</span>
            <span className="text-[#F5A623]">{ ps.earlyCount } early</span>
            <span className="text-[#FA2626]">{ ps.lateCount } late</span>
        </div>
    </div>
);

export default ProjectScoreCard