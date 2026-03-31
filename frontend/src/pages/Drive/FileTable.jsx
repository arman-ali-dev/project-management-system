import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import
{
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Box,
    Typography,
    Chip,
    IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import CodeIcon from "@mui/icons-material/Code";
import ShareDocumentModal from "./ShareDocumentModal";
import { useDispatch } from "react-redux";
import { deleteDocument, updateDocumentVisibility, setSelectedFile } from "../../redux/member/documentSlice";

const permissionStyles = {
    EDITOR: { color: "#09c015e6", bg: "#86878633" },
    Editor: { color: "#09c015e6", bg: "#86878633" },
    "View Only": { color: "#605d5de6", bg: "#60606033" },
    VIEWER: { color: "#605d5de6", bg: "#60606033" },
    ADMINISTRATOR: { color: "#fa2626e6", bg: "#de171733" },
    Administrator: { color: "#fa2626e6", bg: "#de171733" },
};

const getFileIcon = ( fileName ) =>
{
    if ( !fileName ) return <InsertDriveFileIcon />;
    const ext = fileName.split( "." ).pop()?.toLowerCase();
    if ( [ "jpg", "jpeg", "png", "gif", "webp" ].includes( ext ) ) return <ImageIcon />;
    if ( [ "html", "css", "js", "jsx", "ts", "tsx", "java", "py" ].includes( ext ) ) return <CodeIcon />;
    return <InsertDriveFileIcon />;
};

const formatDate = ( dateStr ) =>
{
    if ( !dateStr ) return "";
    const date = new Date( dateStr );
    return `${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`;
};

const formatSize = ( bytes ) =>
{
    if ( !bytes ) return "";
    if ( bytes >= 1e9 ) return `${ ( bytes / 1e9 ).toFixed( 0 ) } GB`;
    if ( bytes >= 1e6 ) return `${ ( bytes / 1e6 ).toFixed( 0 ) } MB`;
    if ( bytes >= 1e3 ) return `${ ( bytes / 1e3 ).toFixed( 0 ) } KB`;
    return `${ bytes } B`;
};

const FileTable = ( { files = [] } ) =>
{
    const dispatch = useDispatch();
    const [ anchorEl, setAnchorEl ] = useState( null );
    const [ activeFileId, setActiveFileId ] = useState( null );
    const [ openShareDocModal, setOpenShareDocModal ] = useState( false );
    const [ shareFile, setShareFile ] = useState( null );

    const open = Boolean( anchorEl );

    const handleClick = ( event, fileId ) =>
    {
        event.stopPropagation();
        setAnchorEl( event.currentTarget );
        setActiveFileId( fileId );
    };

    const handleClose = () =>
    {
        setAnchorEl( null );
        setActiveFileId( null );
    };

    const handleRowClick = ( file ) =>
    {
        dispatch( setSelectedFile( file ) );
    };

    const handleDelete = () =>
    {
        if ( activeFileId ) dispatch( deleteDocument( activeFileId ) );
        handleClose();
    };

    const handleShare = ( file ) =>
    {
        setShareFile( file );
        setOpenShareDocModal( true );
        handleClose();
    };

    const handleToggleVisibility = ( file ) =>
    {
        const newVisibility = file.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC";
        dispatch( updateDocumentVisibility( { fileId: file.id, visibility: newVisibility } ) );
        handleClose();
    };

    return (
        <>
            <TableContainer
                component={ Paper }
                elevation={ 0 }
                sx={ { border: "1px solid #eee" } }
            >
                <Table sx={ { minWidth: 650 } }>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={ { fontWeight: "bold", color: "#333" } }>File Name</TableCell>
                            <TableCell sx={ { fontWeight: "bold", color: "#333" } }>Last Modified</TableCell>
                            <TableCell sx={ { fontWeight: "bold", color: "#333" } }>File Permission</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { files.length > 0 ? (
                            files.map( ( row ) => (
                                <TableRow
                                    key={ row.id }
                                    hover
                                    onClick={ () => handleRowClick( row ) }
                                    sx={ { cursor: "pointer" } }
                                >
                                    {/* File Icon and Name */ }
                                    <TableCell>
                                        <Box sx={ { display: "flex", alignItems: "center", gap: 2 } }>
                                            <Avatar sx={ { bgcolor: "#f0f0f0", color: "#555" } }>
                                                { getFileIcon( row.fileName ) }
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={ { fontWeight: 600 } }>
                                                    { row.fileName }
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    { formatSize( row.fileSize ) }
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* Date */ }
                                    <TableCell>{ formatDate( row.updatedAt ) }</TableCell>

                                    {/* Permission Chip */ }
                                    <TableCell>
                                        <Chip
                                            label={ row.visibility || "PUBLIC" }
                                            size="small"
                                            sx={ {
                                                fontWeight: 600,
                                                color: permissionStyles[ row.visibility ]?.color || "#555",
                                                backgroundColor: permissionStyles[ row.visibility ]?.bg || "#eee",
                                                borderRadius: "12px",
                                            } }
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={ ( e ) => handleClick( e, row.id ) }
                                            aria-controls={ open ? "file-menu" : undefined }
                                            aria-haspopup="true"
                                            aria-expanded={ open ? "true" : undefined }
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ) )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={ 4 } align="center" sx={ { py: 4, color: "#aaa" } }>
                                    No files found
                                </TableCell>
                            </TableRow>
                        ) }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dropdown Menu */ }
            <Menu
                id="file-menu"
                anchorEl={ anchorEl }
                open={ open }
                onClose={ handleClose }
                MenuListProps={ { "aria-labelledby": "file-menu-button" } }
                PaperProps={ {
                    style: {
                        boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
                        minWidth: "140px",
                    },
                } }
            >
                <MenuItem onClick={ () => handleShare( files.find( f => f.id === activeFileId ) ) }>
                    Share
                </MenuItem>
                <MenuItem onClick={ () => handleToggleVisibility( files.find( f => f.id === activeFileId ) ) }>
                    Toggle Visibility
                </MenuItem>
                <MenuItem onClick={ handleClose }>View Details</MenuItem>
                <MenuItem onClick={ handleDelete } sx={ { color: "error.main" } }>
                    Delete
                </MenuItem>
            </Menu>

            <ShareDocumentModal
                open={ openShareDocModal }
                handleClose={ () => setOpenShareDocModal( false ) }
                file={ shareFile }
            />
        </>
    );
};

export default FileTable;