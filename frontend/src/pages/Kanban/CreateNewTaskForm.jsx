import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import
    {
        Select,
        MenuItem,
        Button,
        Snackbar,
        Alert,
        CircularProgress,
    } from "@mui/material";
import removeIcon from "../../assets/remove.png";
import uploadIcon from "../../assets/upload.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/admin/userSlice";
import userAvatar from "../../assets/userAvatar.png";
import { useFormik } from "formik";
import { uploadToCloudinary } from "../../util/uploadToCloudinary";
import * as Yup from "yup";
import { createTask } from "../../redux/admin/taskSlice";

const taskValidationSchema = Yup.object( {
    title: Yup.string().required( "Task Title is required" ),

    category: Yup.string().required( "Category is required" ),

    description: Yup.string().required( "Description is required" ),

    project: Yup.string().required( "Project is required" ),

    priority: Yup.string().required( "Priority is required" ),

    estimatedTime: Yup.number()
        .required( "Estimated time is required" )
        .positive( "Estimated time must be a positive number" ),

    dueDate: Yup.date()
        .required( "Due date is required" )
        .typeError( "Due date is required" ),

    assignedTo: Yup.array()
        .required( "Assigned to is required" )
        .min( 1, "At least one user must be assigned" ),
} );

export default function CreateNewTaskForm ( {
    toggleDrawer,
    open,
    status,
    projectId,
} )
{
    const { projects } = useSelector( ( state ) => state.adminProject );

    const dispatch = useDispatch();
    const { users, loading } = useSelector( ( state ) => state.adminUser );
    const [ openSnack, setOpenSnack ] = React.useState( false );
    const [ snackMessage, setSnackMessage ] = React.useState( "" );
    const [ snackType, setSnackType ] = React.useState( "success" );

    const [ search, setSearch ] = useState( "" );

    useEffect( () =>
    {
        dispatch( fetchUsers() );
    }, [ dispatch ] );

    const filteredUsers = users?.filter(
        ( u ) =>
            u.fullName.toLowerCase().includes( search.toLowerCase() ) ||
            u.email.toLowerCase().includes( search.toLowerCase() ),
    );

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    const [ dragActive, setDragActive ] = useState( false );
    const [ uploading, setUploading ] = useState( false );

    const formik = useFormik( {
        initialValues: {
            title: "",
            category: "",
            description: "",
            project: projectId,
            priority: "",
            estimatedTime: "",
            status: status,
            dueDate: "",
            assignedTo: [],
            documents: [],
        },
        validationSchema: taskValidationSchema,
        onSubmit: ( values ) =>
        {
            dispatch( createTask( values ) )
                .unwrap()
                .then( () =>
                {
                    setSnackType( "success" );
                    setSnackMessage( "Task Created" );
                    setOpenSnack( true );

                    formik.resetForm();
                    toggleDrawer()( false );
                } )
                .catch( ( err ) =>
                {
                    setSnackType( "error" );
                    // FIX: Convert error object to string message
                    setSnackMessage(
                        err?.message || err?.toString() || "Something went wrong",
                    );
                    setOpenSnack( true );
                } );
        },
    } );

    const uploadDocuments = async ( files ) =>
    {
        for ( let file of files )
        {
            if ( file.size > MAX_FILE_SIZE )
            {
                setSnackType( "error" );
                setSnackMessage( `${ file.name } exceeds 50MB` );
                setOpenSnack( true );

                console.log( `${ file.name } exceeds 50MB` );

                continue;
            }

            try
            {
                setUploading( true );
                const url = await uploadToCloudinary( file );

                console.log( file );

                formik.setFieldValue( "documents", [
                    {
                        fileName: file.name,
                        fileUrl: url,
                        fileType:
                            file?.format?.toString().toUpperCase() ||
                            file.type.split( "/" )[ 1 ].toUpperCase(),
                        visibility: "PUBLIC",
                        fileSize: Math.round( file.size ),
                    },
                    ...formik.values.documents,
                ] );
            } catch ( err )
            {
                console.error( "Upload failed", err );
                setSnackType( "error" );
                // FIX: Convert error object to string message
                setSnackMessage( err?.message || "Upload failed" );
                setOpenSnack( true );
            } finally
            {
                setUploading( false );
            }
        }
    };

    const handleBrowse = ( e ) =>
    {
        uploadDocuments( Array.from( e.target.files ) );
        e.target.value = "";
    };

    const handleDragOver = ( e ) =>
    {
        e.preventDefault();
        setDragActive( true );
    };

    const handleDragLeave = () =>
    {
        setDragActive( false );
    };

    const handleDrop = ( e ) =>
    {
        e.preventDefault();
        setDragActive( false );
        uploadDocuments( Array.from( e.dataTransfer.files ) );
    };

    const { createLoading } = useSelector( ( state ) => state.adminTask );

    const form = () => (
        <Box sx={ { width: 750 } } className="overflow-y-scroll" role="presentation">
            <div className="px-8 py-10">
                <h2 className="font-semibold ">Create New Task</h2>

                <form onSubmit={ formik.handleSubmit } className="mt-5 space-y-4">
                    <div className="flex gap-4 ">
                        <div className="flex-1">
                            <label className="text-[#616161]  text-[14px]">Task Title</label>
                            <input
                                name="title"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.title }
                                type="text"
                                className="border-[#BCBCBC] w-full outline-0 px-4 py-2 text-[15px] mt-1 border rounded-sm"
                            />
                            { formik.touched.title && formik.errors.title && (
                                <p className="text-red-500 text-[12px] ">
                                    { formik.errors.title }
                                </p>
                            ) }
                        </div>
                        <div className="flex-1">
                            <label className="text-[#616161]  text-[14px]">Category</label>
                            <Select
                                fullWidth
                                defaultValue=""
                                displayEmpty
                                name="category"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.category }
                                className="border border-[#BCBCBC] w-full outline-none mt-1 rounded-sm h-10.5 box-border"
                                sx={ {
                                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "& .MuiSelect-select": {
                                        paddingLeft: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "13px",
                                        fontWeight: "400",
                                        color: "#000",
                                    },
                                } }
                            >
                                <MenuItem
                                    defaultChecked
                                    value=""
                                    sx={ { fontSize: "13px", fontWeight: "600" } }
                                >
                                    Select Category
                                </MenuItem>
                                <MenuItem
                                    value="DESIGN"
                                    sx={ { fontSize: "13px", fontWeight: "600" } }
                                >
                                    Design
                                </MenuItem>

                                <MenuItem value="DEVELOPMENT" sx={ { fontSize: "13px" } }>
                                    Development
                                </MenuItem>

                                <MenuItem value="TESTING" sx={ { fontSize: "13px" } }>
                                    Testing
                                </MenuItem>

                                <MenuItem value="BUG" sx={ { fontSize: "13px" } }>
                                    Bug
                                </MenuItem>

                                <MenuItem value="RESEARCH" sx={ { fontSize: "13px" } }>
                                    Research
                                </MenuItem>
                            </Select>

                            { formik.touched.category && formik.errors.category && (
                                <p className="text-red-500 text-[12px] ">
                                    { formik.errors.category }
                                </p>
                            ) }
                        </div>
                    </div>

                    <div className="flex gap-4 ">
                        <div className="flex-1">
                            <label className="text-[#616161]  text-[14px]">Description</label>

                            <textarea
                                name="description"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.description }
                                rows="4"
                                className="border-[#BCBCBC] resize-none w-full outline-0 px-4 py-2 text-[15px] mt-1 border rounded-sm"
                            ></textarea>
                            { formik.touched.description && formik.errors.description && (
                                <p className="text-red-500 text-[12px] ">
                                    { formik.errors.description }
                                </p>
                            ) }
                        </div>
                    </div>

                    <div className="flex gap-4 ">
                        <div className="flex-1">
                            <label className="text-[#616161]  text-[14px]">Project</label>

                            <Select
                                name="project"
                                readOnly
                                value={ formik.values.project }
                                fullWidth
                                defaultValue=""
                                displayEmpty
                                className="border border-[#BCBCBC] w-full outline-none mt-1 rounded-sm h-10.5 box-border"
                                sx={ {
                                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "& .MuiSelect-select": {
                                        paddingLeft: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "13px",
                                        fontWeight: "400",
                                        color: "#000",
                                    },
                                } }
                            >
                                <MenuItem
                                    defaultChecked
                                    value=""
                                    sx={ { fontSize: "13px", fontWeight: "600" } }
                                >
                                    Select Project
                                </MenuItem>
                                { projects?.map( ( project ) => (
                                    <MenuItem
                                        key={ project.id }
                                        value={ project.id }
                                        sx={ { fontSize: "13px", fontWeight: "600" } }
                                    >
                                        { project.name }
                                    </MenuItem>
                                ) ) }
                            </Select>

                            { formik.touched.project && formik.errors.project && (
                                <p className="text-red-500 text-[12px] ">
                                    { formik.errors.project }
                                </p>
                            ) }
                        </div>

                        <div className="flex-1">
                            <label className="text-[#616161]  text-[14px]">Priority</label>

                            <Select
                                name="priority"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.priority }
                                fullWidth
                                defaultValue=""
                                displayEmpty
                                className="border border-[#BCBCBC] w-full outline-none mt-1 rounded-sm h-10.5 box-border"
                                sx={ {
                                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "& .MuiSelect-select": {
                                        paddingLeft: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "13px",
                                        fontWeight: "400",
                                        color: "#000",
                                    },
                                } }
                            >
                                <MenuItem
                                    defaultChecked
                                    value=""
                                    sx={ { fontSize: "13px", fontWeight: "600" } }
                                >
                                    Select Priority
                                </MenuItem>
                                <MenuItem
                                    value="HIGH"
                                    sx={ { fontSize: "13px", fontWeight: "600" } }
                                >
                                    High
                                </MenuItem>
                                <MenuItem value="MEDIUM" sx={ { fontSize: "13px" } }>
                                    Medium
                                </MenuItem>
                                <MenuItem value="LOW" sx={ { fontSize: "13px" } }>
                                    Low
                                </MenuItem>
                            </Select>

                            { formik.touched.priority && formik.errors.priority && (
                                <p className="text-red-500 text-[12px] ">
                                    { formik.errors.priority }
                                </p>
                            ) }
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">
                                Estimated Time (hours)
                            </label>
                            <input
                                name="estimatedTime"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.estimatedTime }
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="e.g. 2.5"
                                className="border-[#BCBCBC] w-full outline-0 px-4 py-2 text-[15px] mt-1 border rounded-sm"
                            />
                            <p className="text-[11px] text-[#9E9E9E] mt-1">
                                Approx time required to complete the task
                            </p>

                            { formik.touched.estimatedTime && formik.errors.estimatedTime && (
                                <p className="text-red-500 text-[12px] ">
                                    { formik.errors.estimatedTime }
                                </p>
                            ) }
                        </div>

                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Due Date</label>
                            <input
                                name="dueDate"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.dueDate }
                                type="date"
                                className="border-[#BCBCBC] w-full outline-0 px-4 py-2 text-[15px] mt-1 border rounded-sm"
                            />

                            { formik.touched.dueDate && formik.errors.dueDate && (
                                <p className="text-red-500 text-[12px] ">
                                    { formik.errors.dueDate }
                                </p>
                            ) }
                        </div>
                    </div>
                    <div>
                        <label className="text-[#616161] text-[14px]">Assigned To</label>

                        <div className="relative">
                            <input
                                type="text"
                                value={ search }
                                onChange={ ( e ) => setSearch( e.target.value ) }
                                placeholder="Search user..."
                                className="border-[#BCBCBC] w-full outline-0 px-4 py-2 text-[15px] mt-1 border rounded-sm"
                            />
                            { formik.touched.assignedTo && formik.errors.assignedTo && (
                                <p className="text-red-500 text-[12px] ">
                                    { formik.errors.assignedTo }
                                </p>
                            ) }

                            {/* Dropdown */ }
                            { search && (
                                <div className="absolute w-full border-[#BCBCBC] bg-white border mt-1 z-20 max-h-56 overflow-y-auto rounded-sm">
                                    {/* Skeletons */ }
                                    { loading &&
                                        [ 1, 2, 3 ].map( ( i ) => (
                                            <div
                                                key={ i }
                                                className="px-4 py-3 flex items-center gap-3 animate-pulse"
                                            >
                                                <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                                <div className="h-3 w-32 bg-gray-300 rounded" />
                                            </div>
                                        ) ) }

                                    {/* Users */ }
                                    { !loading &&
                                        filteredUsers.map( ( user ) =>
                                        {
                                            const alreadyAdded = formik.values.assignedTo.some(
                                                ( u ) => u.id === user.id,
                                            );

                                            return (
                                                <div
                                                    key={ user.id }
                                                    className="px-4 py-2 flex justify-between items-center hover:bg-gray-100"
                                                >
                                                    <div className="flex gap-2 items-center">
                                                        <img
                                                            src={ user.profileImage || userAvatar }
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                        <span className="text-sm">{ user.fullName }</span>
                                                    </div>

                                                    <Button
                                                        disabled={ alreadyAdded }
                                                        onClick={ () =>
                                                            formik.setFieldValue( "assignedTo", [
                                                                ...formik.values.assignedTo,
                                                                user,
                                                            ] )
                                                        }
                                                        sx={ {
                                                            textTransform: "capitalize",
                                                            fontSize: "12px",
                                                            backgroundColor: alreadyAdded ? "#aaa" : "#000",
                                                            color: "#fff",
                                                        } }
                                                    >
                                                        { alreadyAdded ? "Added" : "Add" }
                                                    </Button>
                                                </div>
                                            );
                                        } ) }
                                </div>
                            ) }
                        </div>

                        {/* Assigned users */ }
                        <div className="flex gap-2.5 mt-4">
                            { formik.values.assignedTo.map( ( user ) => (
                                <div key={ user.id } className="relative">
                                    <img
                                        className="w-8.5 h-8.5 rounded-full object-cover"
                                        src={ user.profileImage || userAvatar }
                                    />
                                    <img
                                        className="w-3.5 cursor-pointer absolute top-0 -right-0.5"
                                        src={ removeIcon }
                                        onClick={ () =>
                                            formik.setFieldValue(
                                                "assignedTo",
                                                formik.values.assignedTo.filter(
                                                    ( u ) => u.id !== user.id,
                                                ),
                                            )
                                        }
                                    />
                                </div>
                            ) ) }
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="text-[#616161] text-[14px]">
                            Upload Document
                        </label>
                        <label className="text-[#616161] text-[14px] block">
                            Drag and drop document to upload your support task
                        </label>

                        <div
                            onDragOver={ handleDragOver }
                            onDragLeave={ handleDragLeave }
                            onDrop={ handleDrop }
                            className={ `border-[#9F9F9F] text-center mt-3 border-dashed border-2
      ${ dragActive ? "bg-[#e9e9e9]" : "bg-[#F4EFEF]" }
      rounded-xl py-5 transition`}
                        >
                            <img
                                src={ uploadIcon }
                                className="w-14 mx-auto h-14 opacity-50"
                                alt=""
                            />

                            <p className="text-[#252323] font-medium text-[14px]">
                                Choose a file or drag & drop it here.
                            </p>

                            <p className="text-[#707070] text-[13px] mb-3">
                                txt, docx, pdf, jpeg, xlsx — Up to 50MB
                            </p>

                            <Button
                                onClick={ () => document.getElementById( "docInput" ).click() }
                                sx={ {
                                    textTransform: "capitalize",
                                    border: "1px solid #BCBCBC",
                                    color: "#000",
                                    paddingX: "20px",
                                    fontSize: "12px",
                                    borderRadius: "10px",
                                } }
                            >
                                <span className="font-medium">Browse Files</span>
                            </Button>

                            <input
                                id="docInput"
                                type="file"
                                hidden
                                multiple
                                accept=".txt,.doc,.docx,.pdf,.jpeg,.jpg,.xlsx,.png"
                                onChange={ handleBrowse }
                            />
                        </div>

                        {/* Uploading indicator */ }
                        { uploading && (
                            <p className="text-[12px] text-center mt-2 text-gray-500">
                                Uploading...
                            </p>
                        ) }

                        {/* Preview List */ }
                        { formik.values.documents.length > 0 && (
                            <div className="mt-4 space-y-2">
                                { formik.values.documents.map( ( doc, index ) => (
                                    <div
                                        key={ index }
                                        className="flex justify-between items-center bg-white border rounded-lg px-3 py-2"
                                    >
                                        <span className="text-[13px] truncate max-w-[320px]">
                                            { doc.fileName }
                                        </span>

                                        <button
                                            type="button"
                                            onClick={ () =>
                                            {
                                                const docs = [ ...formik.values.documents ];
                                                docs.splice( index, 1 );
                                                formik.setFieldValue( "documents", docs );
                                            } }
                                            className="text-red-500 text-[12px] font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) ) }
                            </div>
                        ) }
                    </div>

                    <div className="flex gap-2 mt-10">
                        <Button
                            type="button"
                            onClick={ () => formik.resetForm() }
                            sx={ {
                                textTransform: "capitalize",
                                border: "1px solid #BCBCBC",
                                color: "#000",
                                paddingX: "20px",
                                fontSize: "14px",
                            } }
                        >
                            <span className="font-medium"> Reset Data</span>
                        </Button>

                        <Button
                            type="submit"
                            disabled={ createLoading }
                            sx={ {
                                textTransform: "capitalize",
                                backgroundColor: "#000",
                                border: "1px solid #000",
                                color: "#fff",
                                paddingX: "20px",
                                fontSize: "14px",
                                minWidth: "127px",
                            } }
                        >
                            { createLoading && (
                                <CircularProgress size={ 15 } sx={ { color: "#fff" } } />
                            ) }

                            { !createLoading && <span>Create Task</span> }
                        </Button>
                    </div>
                </form>
            </div>
        </Box>
    );

    return (
        <div>
            <Drawer
                onClose={ toggleDrawer( false ) }
                PaperProps={ {
                    sx: {
                        width: 750,
                        borderRadius: "8px 0 0 8px",
                        overflow: "visible",
                    },
                } }
                anchor="right"
                open={ open }
            >
                <div
                    onClick={ toggleDrawer( false ) }
                    className="bg-white h-14 w-1.5 rounded-lg absolute top-1/2 -translate-y-1/2   -left-5 -translate-x-1/2  z-99999999 cursor-grab"
                ></div>
                { form() }
            </Drawer>

            <Snackbar
                open={ openSnack }
                autoHideDuration={ 3000 }
                onClose={ () => setOpenSnack( false ) }
                anchorOrigin={ { vertical: "top", horizontal: "right" } }
            >
                <Alert
                    onClose={ () => setOpenSnack( false ) }
                    severity={ snackType }
                    sx={ {
                        width: "100%",
                        fontSize: "13px",
                    } }
                >
                    { snackMessage }
                </Alert>
            </Snackbar>
        </div>
    );
}
