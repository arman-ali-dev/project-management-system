import React from "react";
import
    {
        Select,
        MenuItem,
        Modal,
        Box,
        IconButton,
        Button,
    } from "@mui/material";
import shareIcon from "../../assets/share3.png";
import { Link } from "react-router-dom";
import copyIcon from "../../assets/copy.png";
import profileIcon from "../../assets/profile.jpg";

const ShareDocumentModal = ( { open, handleClose } ) =>
{
    return (
        <Modal open={ open } onClose={ handleClose }>
            <Box
                sx={ {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: 24,
                    py: 3,
                    px: 2.5,
                    outline: "none",
                } }
            >
                <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl flex justify-center bg-black items-center">
                        <img src={ shareIcon } className="w-8 h-8" alt="" />
                    </div>

                    <div>
                        <h3 className="text-[15px] font-semibold">Share Project</h3>
                        <p className="text-[#686565] text-[13px] font-medium">
                            Manage the members than can access your document{ " " }
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-[#403F3F] text-[13px] font-medium">
                        Document Link
                    </p>

                    <div className="border-[#D3D3D3] border flex justify-between items-center px-4 py-1.5 rounded-md mt-0.5">
                        <Link className="text-[#171079] text-[13px] font-medium ">
                            https://shareprojectfilename.com/yvuidy98pdf
                        </Link>

                        <IconButton>
                            <img src={ copyIcon } className="w-4 h-4" alt="" />
                        </IconButton>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-[#403F3F] text-[13px] font-medium">
                        Search Members
                    </p>
                    <form className="flex gap-2 mt-0.5">
                        <div className="flex-1">
                            <input
                                className="text-[13px] outline-0 px-4 py-2 w-full border-[#D3D3D3] border rounded-md"
                                type="text"
                                placeholder="Search for names or emails..."
                            />
                        </div>
                        <Button
                            sx={ {
                                textTransform: "capitalize",
                                backgroundColor: "#000",
                                border: "1px solid #000",
                                color: "#fff",
                                paddingX: "20px",
                                fontSize: "13px",
                                borderRadius: "5px",
                            } }
                        >
                            <span>share</span>
                        </Button>
                    </form>
                </div>

                <div className="mt-4">
                    <p className="text-[#403F3F] text-[13px] font-medium">Members</p>

                    <div className="mt-3 space-y-3">
                        { [ 1, 1, 1 ].map( ( item, index ) => (
                            <div className="flex justify-between items-center">
                                <div key={ index } className="flex gap-2 items-center">
                                    <div>
                                        <img
                                            src={ profileIcon }
                                            className="w-9 h-9 rounded-full object-cover"
                                            alt=""
                                        />
                                    </div>
                                    <div className="mt-0.5">
                                        <p className="text-[13px] font-medium">Armaan Ali</p>
                                        <p className="text-[#535353] text-[12px] -mt-0.5">
                                            arman.ali.ahit@gmail.com
                                        </p>
                                    </div>
                                </div>
                                <Select
                                    defaultValue=""
                                    displayEmpty
                                    className="outline-none text-[13px] font-medium w-27.5"
                                    sx={ {
                                        height: "32px",
                                        borderRadius: "8px",
                                        backgroundColor: "#ffffff",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "1px solid #E0E0E0",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#BCBCBC",
                                        },
                                        "& .MuiSelect-select": {
                                            paddingLeft: "10px",
                                            paddingRight: "20px",
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "13px",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            right: "2px",
                                            fontSize: "18px",
                                        },
                                    } }
                                >
                                    <MenuItem value="" sx={ { fontSize: "13px" } }>
                                        Can Edit
                                    </MenuItem>
                                    <MenuItem value="status2" sx={ { fontSize: "13px" } }>
                                        Can View
                                    </MenuItem>
                                    <MenuItem value="status3" sx={ { fontSize: "13px" } }>
                                        Admin
                                    </MenuItem>
                                </Select>
                            </div>
                        ) ) }
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ShareDocumentModal;
