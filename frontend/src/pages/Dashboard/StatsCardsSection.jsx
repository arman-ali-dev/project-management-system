import React from "react";
import { useSelector } from "react-redux";
import StatsCard from "./StatsCard";
import layerIcon from "../../assets/layers.png";
import topIcon from "../../assets/top.png";
import top2Icon from "../../assets/top2.png";
import folderIcon from "../../assets/folder.png";
import checklistIcon from "../../assets/checklist2.png";
import groupIcon from "../../assets/group2.png";

const StatsCardsSection = () =>
{
    const { projects } = useSelector( ( state ) => state.adminProject );
    const { tasks } = useSelector( ( state ) => state.adminTask );
    const { users } = useSelector( ( state ) => state.adminUser );

    // ── Counts ────────────────────────────────────────────────────────────────
    const totalProjects = projects?.length || 0;
    const totalTasks = tasks?.length || 0;
    const totalMembers = users?.length || 0;

    // Project files — saare projects ke documents/supportDocuments count karo
    const totalFiles =
        projects?.reduce( ( sum, p ) =>
        {
            const projectFiles = p.documents?.length || 0;
            return sum + projectFiles;
        }, 0 ) || 0;

    return (
        <div className="grid grid-cols-4 gap-4">
            <StatsCard
                icon={ layerIcon }
                iconBg="#8127FF"
                statusIcon={ topIcon }
                label="Total Projects"
                num={ totalProjects }
                delay={ 0 }
            />
            <StatsCard
                icon={ folderIcon }
                iconBg="#F55600"
                statusIcon={ topIcon }
                label="Project Files"
                num={ totalFiles }
                delay={ 80 }
            />
            <StatsCard
                icon={ checklistIcon }
                iconBg="#157FD7"
                statusIcon={ top2Icon }
                label="Assigned Tasks"
                num={ totalTasks }
                delay={ 160 }
            />
            <StatsCard
                icon={ groupIcon }
                iconBg="#18A322"
                statusIcon={ topIcon }
                label="Team Members"
                num={ totalMembers }
                delay={ 240 }
            />
        </div>
    );
};

export default StatsCardsSection;
