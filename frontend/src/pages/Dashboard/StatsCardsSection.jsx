import React from "react";
import StatsCard from "./StatsCard";
import layerIcon from "../../assets/layers.png";
import topIcon from "../../assets/top.png";
import top2Icon from "../../assets/top2.png";
import folderIcon from "../../assets/folder.png";
import checklistIcon from "../../assets/checklist2.png";
import groupIcon from "../../assets/group2.png";

const StatsCardsSection = () =>
{
    return (
        <div className="grid grid-cols-4 gap-4">
            <StatsCard
                icon={ layerIcon }
                iconBg="#8127FF"
                statusIcon={ topIcon }
                label="Total Projects"
                num={ 24 }
                delay={ 0 }
            />
            <StatsCard
                icon={ folderIcon }
                iconBg="#F55600"
                statusIcon={ topIcon }
                label="Project Files"
                num={ 12 }
                delay={ 80 }
            />
            <StatsCard
                icon={ checklistIcon }
                iconBg="#157FD7"
                statusIcon={ top2Icon }
                label="Assigned Tasks"
                num={ 138 }
                delay={ 160 }
            />
            <StatsCard
                icon={ groupIcon }
                iconBg="#18A322"
                statusIcon={ topIcon }
                label="Team Members"
                num={ 19 }
                delay={ 240 }
            />
        </div>
    );
};

export default StatsCardsSection;