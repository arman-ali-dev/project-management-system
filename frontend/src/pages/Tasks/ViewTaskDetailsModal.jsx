import
{
    Box, Modal, Typography, Chip, Avatar, Divider, IconButton
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";

const ViewTaskDetailsModal = ( { task, open, handleClose } ) =>
{
    const [ mounted, setMounted ] = useState( false );

    useEffect( () =>
    {
        if ( open )
        {
            // Small delay for animation to trigger after modal renders
            requestAnimationFrame( () => setTimeout( () => setMounted( true ), 10 ) );
        } else
        {
            setMounted( false );
        }
    }, [ open ] );

    const handleDownload = async ( doc ) =>
    {
        try
        {
            const response = await fetch( doc.fileUrl );
            const blob = await response.blob();
            const url = window.URL.createObjectURL( blob );
            const a = document.createElement( "a" );
            a.href = url;
            a.download = doc.fileName;
            document.body.appendChild( a );
            a.click();
            a.remove();
            window.URL.revokeObjectURL( url );
        } catch ( error )
        {
            console.error( "Download failed", error );
        }
    };

    const getFileIcon = ( fileType ) =>
    {
        const type = fileType?.toUpperCase();
        if ( type === "PDF" ) return <PictureAsPdfIcon sx={ { fontSize: 18, color: "#DC2626" } } />;
        if ( [ "PNG", "JPG", "JPEG", "GIF", "WEBP" ].includes( type ) ) return <ImageIcon sx={ { fontSize: 18, color: "#059669" } } />;
        if ( [ "DOCX", "DOC", "TXT" ].includes( type ) ) return <DescriptionIcon sx={ { fontSize: 18, color: "#2563EB" } } />;
        return <InsertDriveFileIcon sx={ { fontSize: 18, color: "#6B7280" } } />;
    };

    const priorityBadgeCls = ( priority ) =>
        `px-3 py-1 text-[12px] font-semibold rounded ${ priority === "HIGH"
            ? "bg-[rgba(129,39,255,.2)] text-[#8127FF]"
            : priority === "LOW"
                ? "bg-[rgba(245,86,0,.2)] text-[#F55600]"
                : "bg-[rgba(21,127,215,.2)] text-[#157FD7]"
        }`;

    const categoryStyle = {
        color: task.category === "DESIGN" ? "#497AF5" : task.category === "DEVELOPMENT" ? "rgba(250,38,38,.7)" : "#09C015",
        backgroundColor: task.category === "DESIGN" ? "rgba(73,122,245,0.2)" : task.category === "DEVELOPMENT" ? "rgba(222,23,23,.2)" : "rgba(1,255,18,.3)",
    };

    return (
        <Modal
            open={ open }
            onClose={ handleClose }
            aria-labelledby="task-modal-title"
            sx={ {
                "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(3px)",
                    transition: "opacity 0.25s ease !important",
                },
            } }
        >
            <Box
                sx={ {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: mounted
                        ? "translate(-50%, -50%) scale(1)"
                        : "translate(-50%, -48%) scale(0.97)",
                    opacity: mounted ? 1 : 0,
                    width: 680,
                    maxHeight: "90vh",
                    bgcolor: "background.paper",
                    borderRadius: "14px",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "opacity 0.28s cubic-bezier(0.22,1,0.36,1), transform 0.28s cubic-bezier(0.22,1,0.36,1)",
                } }
            >
                {/* Header */ }
                <Box
                    sx={ {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        p: 3,
                        borderBottom: "1px solid #E5E7EB",
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(-6px)",
                        transition: "opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s",
                    } }
                >
                    <Box sx={ { flex: 1 } }>
                        <Typography
                            id="task-modal-title"
                            variant="h5"
                            sx={ { fontWeight: 600, color: "#111827", mb: 1.5 } }
                        >
                            { task.title }
                        </Typography>
                        <Box sx={ { display: "flex", gap: 1, flexWrap: "wrap" } }>
                            <span className={ priorityBadgeCls( task.priority ) }>
                                { task.status }
                            </span>
                            <span
                                style={ categoryStyle }
                                className="px-3 py-1.5 rounded-md text-[11px] font-medium inline-block"
                            >
                                { task.category }
                            </span>
                        </Box>
                    </Box>

                    <IconButton
                        onClick={ handleClose }
                        size="small"
                        sx={ {
                            color: "#6B7280",
                            transition: "background 0.15s ease, transform 0.15s ease, color 0.15s ease !important",

                        } }
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */ }
                <Box
                    sx={ {
                        overflowY: "auto",
                        p: 3,
                        flex: 1,
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(8px)",
                        transition: "opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s",
                    } }
                >
                    {/* Description */ }
                    <Box sx={ { mb: 3 } }>
                        <Typography variant="subtitle2" sx={ { fontWeight: 600, color: "#374151", mb: 1, fontSize: "13px", letterSpacing: "0.05em" } }>
                            DESCRIPTION
                        </Typography>
                        <Typography sx={ { color: "#4B5563", fontSize: "14px", lineHeight: 1.7 } }>
                            { task.description }
                        </Typography>
                    </Box>

                    <Divider sx={ { my: 3 } } />

                    {/* Details Grid */ }
                    <Box sx={ { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5, mb: 3 } }>
                        { [
                            {
                                icon: <PriorityHighIcon sx={ { fontSize: 16, color: "#6B7280" } } />,
                                label: "Priority",
                                content: <span className={ priorityBadgeCls( task.priority ) }>{ task.priority }</span>,
                                delay: 0,
                            },
                            {
                                icon: <CalendarTodayIcon sx={ { fontSize: 16, color: "#6B7280" } } />,
                                label: "Due Date",
                                content: <Typography sx={ { color: "#111827", fontSize: "14px", fontWeight: 500, mt: 0.5 } }>
                                    { new Date( task.dueDate ).toLocaleDateString( "en-US", { month: "short", day: "numeric", year: "numeric" } ) }
                                </Typography>,
                                delay: 60,
                            },
                            {
                                icon: <AccessTimeIcon sx={ { fontSize: 16, color: "#6B7280" } } />,
                                label: "Estimated Time",
                                content: <Typography sx={ { color: "#111827", fontSize: "14px", fontWeight: 500, mt: 0.5 } }>{ task.estimatedTime } hours</Typography>,
                                delay: 120,
                            },
                            {
                                icon: <FolderIcon sx={ { fontSize: 16, color: "#6B7280" } } />,
                                label: "Project",
                                content: <Typography sx={ { color: "#111827", fontSize: "14px", fontWeight: 500, mt: 0.5 } }>{ task.project.name }</Typography>,
                                delay: 180,
                            },
                        ].map( ( item, i ) => (
                            <Box
                                key={ i }
                                sx={ {
                                    opacity: mounted ? 1 : 0,
                                    transform: mounted ? "translateY(0)" : "translateY(6px)",
                                    transition: `opacity 0.3s ease ${ 0.18 + item.delay / 1000 }s, transform 0.3s ease ${ 0.18 + item.delay / 1000 }s`,
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "1px solid #F3F4F6",
                                    transition2: "background 0.15s ease",
                                    "&:hover": { backgroundColor: "#fafafa" },
                                } }
                            >
                                <Box sx={ { display: "flex", alignItems: "center", gap: 1, mb: 0.5 } }>
                                    { item.icon }
                                    <Typography variant="caption" sx={ { fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em" } }>
                                        { item.label }
                                    </Typography>
                                </Box>
                                { item.content }
                            </Box>
                        ) ) }
                    </Box>

                    <Divider sx={ { my: 3 } } />

                    {/* Assigned To */ }
                    <Box
                        sx={ {
                            mb: 3,
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? "translateY(0)" : "translateY(6px)",
                            transition: "opacity 0.3s ease 0.35s, transform 0.3s ease 0.35s",
                        } }
                    >
                        <Box sx={ { display: "flex", alignItems: "center", gap: 1, mb: 1.5 } }>
                            <PersonIcon sx={ { fontSize: 16, color: "#6B7280" } } />
                            <Typography variant="caption" sx={ { fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em" } }>
                                Assigned To
                            </Typography>
                        </Box>
                        <Box sx={ { display: "flex", gap: 1.5, flexWrap: "wrap" } }>
                            { task.assignedTo.map( ( user, i ) => (
                                <Box
                                    key={ user.id }
                                    sx={ {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        backgroundColor: "#F9FAFB",
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: "8px",
                                        border: "1px solid #E5E7EB",
                                        transition: "background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                                        cursor: "default",
                                        opacity: mounted ? 1 : 0,
                                        transform: mounted ? "scale(1)" : "scale(0.9)",
                                        transitionDelay: `${ 0.38 + i * 0.05 }s`,
                                        "&:hover": {
                                            backgroundColor: "#F3F4F6",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                                            transform: "translateY(-1px)",
                                        },
                                    } }
                                >
                                    <Avatar
                                        src={ user.profileImage }
                                        sx={ { width: 28, height: 28, fontSize: "12px", backgroundColor: "#6366F1" } }
                                    >
                                        { user.fullName.charAt( 0 ) }
                                    </Avatar>
                                    <Typography sx={ { fontSize: "13px", fontWeight: 500, color: "#111827" } }>
                                        { user.fullName }
                                    </Typography>
                                </Box>
                            ) ) }
                        </Box>
                    </Box>

                    {/* Labels */ }
                    { task.labels && task.labels.length > 0 && (
                        <Box sx={ { mb: 3 } }>
                            <Typography variant="caption" sx={ { fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em", display: "block", mb: 1.5 } }>
                                Labels
                            </Typography>
                            <Box sx={ { display: "flex", gap: 1, flexWrap: "wrap" } }>
                                { task.labels.map( ( label, i ) => (
                                    <Chip
                                        key={ i }
                                        label={ label }
                                        size="small"
                                        sx={ {
                                            backgroundColor: "#EEF2FF",
                                            color: "#4F46E5",
                                            fontWeight: 500,
                                            fontSize: "12px",
                                            transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                            "&:hover": { transform: "scale(1.05)", boxShadow: "0 2px 6px rgba(99,102,241,0.2)" },
                                        } }
                                    />
                                ) ) }
                            </Box>
                        </Box>
                    ) }

                    {/* Attachments */ }
                    { task.supportDocuments && task.supportDocuments.length > 0 && (
                        <Box>
                            <Box sx={ { display: "flex", alignItems: "center", gap: 1, mb: 1.5 } }>
                                <AttachFileIcon sx={ { fontSize: 16, color: "#6B7280" } } />
                                <Typography variant="caption" sx={ { fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em" } }>
                                    Attachments
                                </Typography>
                            </Box>
                            <Box sx={ { display: "flex", flexDirection: "column", gap: 1 } }>
                                { task.supportDocuments.map( ( doc, i ) => (
                                    <Box
                                        key={ i }
                                        sx={ {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            backgroundColor: "#F9FAFB",
                                            px: 2,
                                            py: 1.5,
                                            borderRadius: "8px",
                                            border: "1px solid #E5E7EB",
                                            transition: "background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                                            opacity: mounted ? 1 : 0,
                                            transitionDelay: `${ 0.4 + i * 0.06 }s`,
                                            "&:hover": {
                                                backgroundColor: "#F3F4F6",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                                                transform: "translateX(3px)",
                                            },
                                        } }
                                    >
                                        { getFileIcon( doc.fileType ) }
                                        <Typography sx={ { fontSize: "13px", color: "#374151", flex: 1 } }>
                                            { doc.fileName }
                                        </Typography>
                                        <Chip
                                            label={ doc.fileType }
                                            size="small"
                                            sx={ { height: "20px", fontSize: "10px", fontWeight: 600, backgroundColor: "#EEF2FF", color: "#4F46E5" } }
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={ () => handleDownload( doc ) }
                                            sx={ {
                                                color: "#6B7280",
                                                backgroundColor: "#FFF",
                                                border: "1px solid #E5E7EB",
                                                transition: "background 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease !important",
                                                "&:hover": {
                                                    backgroundColor: "#111",
                                                    color: "#fff",
                                                    borderColor: "#111",
                                                    transform: "scale(1.08)",
                                                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                                                },
                                            } }
                                        >
                                            <DownloadIcon sx={ { fontSize: 18 } } />
                                        </IconButton>
                                    </Box>
                                ) ) }
                            </Box>
                        </Box>
                    ) }
                </Box>

                {/* Footer */ }
                <Box
                    sx={ {
                        borderTop: "1px solid #E5E7EB",
                        px: 3,
                        py: 2,
                        backgroundColor: "#F9FAFB",
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(4px)",
                        transition: "opacity 0.3s ease 0.25s, transform 0.3s ease 0.25s",
                    } }
                >
                    <Typography sx={ { fontSize: "12px", color: "#6B7280" } }>
                        { new Date( task.createdAt ).toLocaleDateString( "en-US", {
                            month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                        } ) }
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default ViewTaskDetailsModal;