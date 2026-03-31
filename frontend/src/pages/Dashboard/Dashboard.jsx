import React, { useEffect, useState } from "react";
import StatsCardsSection from "./StatsCardsSection";
import FilesUploadedCard from "./FilesUploadedCard";
import TaskStatusCard from "./TaskStatusCard";
import TaskTable from "./TaskTable";

const Dashboard = () =>
{
    const [ mounted, setMounted ] = useState( false );

    useEffect( () =>
    {
        // Trigger mount animation
        requestAnimationFrame( () => setMounted( true ) );
    }, [] );

    return (
        <div
            className="mt-4 mx-8 relative"
            style={ {
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.3s ease",
            } }
        >
            {/* Stats Cards — stagger handled inside StatsCard */ }
            <StatsCardsSection />

            {/* Charts Row */ }
            <div className="grid grid-cols-6 gap-4 items-stretch mt-4">
                <div
                    className="col-span-4 h-full"
                    style={ {
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(16px)",
                        transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
                    } }
                >
                    <FilesUploadedCard />
                </div>

                <div
                    className="col-span-2 h-full"
                    style={ {
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(16px)",
                        transition: "opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s",
                    } }
                >
                    <TaskStatusCard />
                </div>
            </div>

            {/* Task Table */ }
            <div
                style={ {
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s",
                } }
            >
                <TaskTable />
            </div>
        </div>
    );
};

export default Dashboard;