import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import plusIcon from "../../assets/plus.png";
import
{
    Select, MenuItem, Button, Snackbar, Alert,
    CircularProgress, IconButton,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { createProject } from "../../redux/admin/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import editIcon from "../../assets/edit2.png";
import { uploadToCloudinary } from "../../util/uploadToCloudinary";
import uploadIcon from "../../assets/upload.png";
import { fetchUsers } from "../../redux/admin/userSlice";
import userAvatar from "../../assets/userAvatar.png";
import removeIcon from "../../assets/remove.png";

// Shared animated input style helper
const inputClass = "border-[#BCBCBC] w-full outline-0 px-4 py-2 text-[15px] mt-1 border rounded-sm transition-all duration-200 focus:border-black focus:shadow-[0_0_0_2px_rgba(0,0,0,0.08)]";

const projectValidationSchema = Yup.object( {
    name: Yup.string().required( "Project name is required" ),
    url: Yup.string().url( "Enter a valid URL" ).required( "URL is required" ),
    description: Yup.string().required( "Description is required" ),
    organizationName: Yup.string().required( "Organization name is required" ),
    progress: Yup.number().min( 0 ).max( 100 ).required( "Progress is required" ),
    priority: Yup.string().required( "Priority is required" ),
    status: Yup.string().required( "Status is required" ),
    startDate: Yup.date().required( "Start date is required" ).typeError( "Start date is required" ),
    dueDate: Yup.date().required( "Due date is required" ).typeError( "Due date is required" ).min( Yup.ref( "startDate" ), "Due date cannot be before start date" ),
    logo: Yup.string().required( "Logo is required" ),
    members: Yup.array().required().min( 1, "At least one member must be included." ),
} );

const selectSx = {
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "& .MuiSelect-select": { paddingLeft: "16px", display: "flex", alignItems: "center" },
    transition: "box-shadow 0.2s ease",
    "&:hover": { boxShadow: "0 0 0 1px #bcbcbc" },
};

export default function AddProjectForm ( { toggleDrawer, open } )
{
    const dispatch = useDispatch();
    const [ openSnack, setOpenSnack ] = React.useState( false );
    const [ snackMessage, setSnackMessage ] = React.useState( "" );
    const [ snackType, setSnackType ] = React.useState( "success" );
    const { users, loading } = useSelector( ( state ) => state.adminUser );
    const [ search, setSearch ] = React.useState( "" );
    const logoInputRef = React.useRef( null );
    const [ uploading, setUploading ] = React.useState( false );
    const [ logoHovered, setLogoHovered ] = React.useState( false );

    React.useEffect( () => { dispatch( fetchUsers() ); }, [ dispatch ] );

    const filteredUsers = users?.filter( u =>
        u.fullName.toLowerCase().includes( search.toLowerCase() ) ||
        u.email.toLowerCase().includes( search.toLowerCase() )
    );

    const formik = useFormik( {
        initialValues: {
            name: "", url: "", description: "", organizationName: "",
            progress: "", priority: "", status: "", startDate: "", dueDate: "", logo: "", members: [],
        },
        validationSchema: projectValidationSchema,
        onSubmit: ( values, { resetForm } ) =>
        {
            const payload = { ...values, startDate: `${ values.startDate }T00:00:00`, endDate: `${ values.dueDate }T23:59:59` };
            dispatch( createProject( payload ) ).unwrap()
                .then( () =>
                {
                    setSnackType( "success" ); setSnackMessage( "Project Created" ); setOpenSnack( true );
                    resetForm(); toggleDrawer()( false );
                } )
                .catch( err => { setSnackType( "error" ); setSnackMessage( err || "Something went wrong" ); setOpenSnack( true ); } );
        },
    } );

    const { createProjectLoading } = useSelector( ( state ) => state.adminProject );

    const handleLogoChange = async ( e ) =>
    {
        const file = e.target.files[ 0 ];
        if ( !file ) return;
        if ( file.size > 10 * 1024 * 1024 ) { setSnackType( "error" ); setSnackMessage( "Image size must be less than 10 MB" ); setOpenSnack( true ); return; }
        try
        {
            setUploading( true );
            const logo = await uploadToCloudinary( file );
            formik.setFieldValue( "logo", logo );
        } catch ( err )
        {
            setSnackType( "error" ); setSnackMessage( err.message || "Image upload failed" ); setOpenSnack( true );
        } finally { setUploading( false ); }
    };

    const form = () => (
        <Box sx={ { width: 750 } } role="presentation" className="h-full overflow-auto">
            <div className="px-8 py-10">
                <h2 className="font-semibold flex gap-3 items-center">
                    <img src={ plusIcon } className="w-4" alt="" /> Add New Project
                </h2>

                <form onSubmit={ formik.handleSubmit } className="mt-5 space-y-4">
                    {/* Logo Upload */ }
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative flex-1 w-full group">
                            <div
                                className={ `w-full h-35 border-2 border-dashed border-[#BCBCBC] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden ${ formik.values.logo ? "border-solid" : "" }` }
                                onClick={ () => logoInputRef.current.click() }
                                onMouseEnter={ () => setLogoHovered( true ) }
                                onMouseLeave={ () => setLogoHovered( false ) }
                                style={ {
                                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                                    borderColor: logoHovered ? "#888" : undefined,
                                    boxShadow: logoHovered ? "0 0 0 3px rgba(0,0,0,0.05)" : "none",
                                } }
                            >
                                { formik.values.logo ? (
                                    <img
                                        src={ formik.values.logo }
                                        alt="Project Logo"
                                        className="w-full h-full object-cover"
                                        style={ { transition: "transform 0.3s ease", transform: logoHovered ? "scale(1.03)" : "scale(1)" } }
                                    />
                                ) : (
                                    <div
                                        className="flex flex-col items-center text-center px-3"
                                        style={ { transition: "transform 0.2s ease", transform: logoHovered ? "translateY(-3px)" : "translateY(0)" } }
                                    >
                                        <img src={ uploadIcon } className="w-6 mb-2 opacity-70" />
                                        <p className="text-[12px] text-[#616161] font-medium">Upload Project Logo</p>
                                        <span className="text-[11px] text-[#9E9E9E] mt-1">PNG, JPG up to 10MB</span>
                                    </div>
                                ) }
                            </div>

                            { uploading && (
                                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center"
                                    style={ { animation: "fadeIn 0.2s ease" } }
                                >
                                    <div className="w-7 h-7 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) }

                            { formik.values.logo && (
                                <div className="absolute bottom-2 right-2"
                                    style={ { opacity: logoHovered ? 1 : 0.7, transition: "opacity 0.2s ease" } }
                                >
                                    <IconButton
                                        onClick={ ( e ) => { e.stopPropagation(); logoInputRef.current.click(); } }
                                        sx={ {
                                            backgroundColor: "#000",
                                            "&:hover": { backgroundColor: "#333", transform: "scale(1.1)" },
                                            width: 32, height: 32,
                                            transition: "transform 0.15s ease !important",
                                        } }
                                    >
                                        <img src={ editIcon } className="w-3 h-3" alt="edit" />
                                    </IconButton>
                                </div>
                            ) }

                            <input ref={ logoInputRef } type="file" hidden accept="image/*" onChange={ handleLogoChange } />
                        </div>
                        { formik.touched.logo && formik.errors.logo && (
                            <p className="text-red-500 text-[12px] mt-1" style={ { animation: "fadeSlideDown 0.2s ease" } }>{ formik.errors.logo }</p>
                        ) }
                    </div>

                    {/* Name + URL */ }
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Project Name</label>
                            <input name="name" onChange={ formik.handleChange } onBlur={ formik.handleBlur } value={ formik.values.name } type="text" className={ inputClass } />
                            { formik.touched.name && formik.errors.name && <p className="text-red-500 text-[12px]">{ formik.errors.name }</p> }
                        </div>
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">URL</label>
                            <input name="url" onChange={ formik.handleChange } onBlur={ formik.handleBlur } value={ formik.values.url } type="text" className={ inputClass } />
                            { formik.touched.url && formik.errors.url && <p className="text-red-500 text-[12px]">{ formik.errors.url }</p> }
                        </div>
                    </div>

                    {/* Description */ }
                    <div>
                        <label className="text-[#616161] text-[14px]">Description</label>
                        <textarea name="description" onChange={ formik.handleChange } onBlur={ formik.handleBlur } value={ formik.values.description } rows="4"
                            className={ `${ inputClass } resize-none` }
                        />
                        { formik.touched.description && formik.errors.description && <p className="text-red-500 text-[12px]">{ formik.errors.description }</p> }
                    </div>

                    {/* Organization + Progress */ }
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Organization Name</label>
                            <input name="organizationName" onChange={ formik.handleChange } onBlur={ formik.handleBlur } value={ formik.values.organizationName } type="text" className={ inputClass } />
                            { formik.touched.organizationName && formik.errors.organizationName && <p className="text-red-500 text-[12px]">{ formik.errors.organizationName }</p> }
                        </div>
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Progress</label>
                            <input name="progress" onChange={ formik.handleChange } onBlur={ formik.handleBlur } value={ formik.values.progress } type="text" className={ inputClass } />
                            { formik.touched.progress && formik.errors.progress && <p className="text-red-500 text-[12px]">{ formik.errors.progress }</p> }
                        </div>
                    </div>

                    {/* Add Members */ }
                    <div>
                        <label className="text-[#616161] text-[14px]">Add Members</label>
                        <div className="relative">
                            <input type="text" value={ search } onChange={ e => setSearch( e.target.value ) } placeholder="Search user..."
                                className={ inputClass }
                            />
                            { formik.touched.members && formik.errors.members && <p className="text-red-500 text-[12px]">{ formik.errors.members }</p> }

                            { search && (
                                <div
                                    className="absolute w-full border-[#BCBCBC] bg-white border mt-1 z-20 max-h-56 overflow-y-auto rounded-sm"
                                    style={ { boxShadow: "0 8px 24px rgba(0,0,0,0.1)", animation: "fadeSlideDown 0.18s ease" } }
                                >
                                    { loading && [ 1, 2, 3 ].map( i => (
                                        <div key={ i } className="px-4 py-3 flex items-center gap-3 animate-pulse">
                                            <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                            <div className="h-3 w-32 bg-gray-300 rounded" />
                                        </div>
                                    ) ) }

                                    { !loading && filteredUsers.map( user =>
                                    {
                                        const alreadyAdded = formik.values.members.some( u => u.id === user.id );
                                        return (
                                            <div key={ user.id }
                                                className="px-4 py-2 flex justify-between items-center"
                                                style={ { transition: "background 0.15s ease" } }
                                                onMouseEnter={ e => e.currentTarget.style.background = "#f5f5f5" }
                                                onMouseLeave={ e => e.currentTarget.style.background = "white" }
                                            >
                                                <div className="flex gap-2 items-center">
                                                    <img src={ user.profileImage || userAvatar } className="w-6 h-6 rounded-full" />
                                                    <span className="text-sm">{ user.fullName }</span>
                                                </div>
                                                <Button
                                                    disabled={ alreadyAdded }
                                                    onClick={ () => formik.setFieldValue( "members", [ ...formik.values.members, user ] ) }
                                                    sx={ {
                                                        textTransform: "capitalize", fontSize: "12px",
                                                        backgroundColor: alreadyAdded ? "#aaa" : "#000",
                                                        color: "#fff",
                                                        transition: "background 0.15s ease, transform 0.15s ease !important",
                                                        "&:hover": { backgroundColor: alreadyAdded ? "#aaa !important" : "#333 !important", transform: "scale(1.03) !important" },
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

                        {/* Selected Members */ }
                        <div className="flex gap-2.5 mt-4 flex-wrap">
                            { formik.values.members.map( ( user, i ) => (
                                <div
                                    key={ user.id }
                                    className="relative"
                                    style={ {
                                        animation: "badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                                        animationDelay: `${ i * 40 }ms`,
                                    } }
                                >
                                    <img className="w-8.5 h-8.5 rounded-full object-cover" src={ user.profileImage || userAvatar } />
                                    <img
                                        className="w-3.5 cursor-pointer absolute top-0 -right-0.5"
                                        src={ removeIcon }
                                        style={ { transition: "transform 0.15s ease", transform: "scale(1)" } }
                                        onMouseEnter={ e => e.currentTarget.style.transform = "scale(1.2)" }
                                        onMouseLeave={ e => e.currentTarget.style.transform = "scale(1)" }
                                        onClick={ () => formik.setFieldValue( "members", formik.values.members.filter( u => u.id !== user.id ) ) }
                                    />
                                </div>
                            ) ) }
                        </div>
                    </div>

                    {/* Priority + Status */ }
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Priority</label>
                            <Select name="priority" value={ formik.values.priority } onChange={ formik.handleChange } fullWidth displayEmpty
                                className="border border-[#BCBCBC] w-full outline-none text-[15px] mt-1 rounded-sm h-10.5 box-border"
                                sx={ selectSx }
                            >
                                <MenuItem value="">Select Priority</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="LOW">Low</MenuItem>
                            </Select>
                            { formik.touched.priority && formik.errors.priority && <p className="text-red-500 text-[12px]">{ formik.errors.priority }</p> }
                        </div>
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Status</label>
                            <Select name="status" value={ formik.values.status } onChange={ formik.handleChange } fullWidth displayEmpty
                                className="border border-[#BCBCBC] w-full outline-none text-[15px] mt-1 rounded-sm h-10.5 box-border"
                                sx={ selectSx }
                            >
                                <MenuItem value="">Select Status</MenuItem>
                                <MenuItem value="ACTIVE">Active</MenuItem>
                                <MenuItem value="ON_HOLD">On Hold</MenuItem>
                                <MenuItem value="COMPLETED">Completed</MenuItem>
                            </Select>
                            { formik.touched.status && formik.errors.status && <p className="text-red-500 text-[12px]">{ formik.errors.status }</p> }
                        </div>
                    </div>

                    {/* Dates */ }
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Start Date</label>
                            <input name="startDate" onChange={ formik.handleChange } onBlur={ formik.handleBlur } value={ formik.values.startDate } type="date" className={ inputClass } />
                            { formik.touched.startDate && formik.errors.startDate && <p className="text-red-500 text-[12px] mt-1">{ formik.errors.startDate }</p> }
                        </div>
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Due Date</label>
                            <input name="dueDate" onChange={ formik.handleChange } onBlur={ formik.handleBlur } value={ formik.values.dueDate } type="date" className={ inputClass } />
                            { formik.touched.dueDate && formik.errors.dueDate && <p className="text-red-500 text-[12px] mt-1">{ formik.errors.dueDate }</p> }
                        </div>
                    </div>

                    {/* Actions */ }
                    <div className="flex gap-2 mt-10">
                        <Button
                            onClick={ formik.handleReset }
                            sx={ {
                                textTransform: "capitalize", border: "1px solid #BCBCBC", color: "#000", paddingX: "20px", fontSize: "14px",
                                transition: "background 0.18s ease, transform 0.15s ease !important",
                                "&:hover": { backgroundColor: "#f5f5f5 !important", transform: "translateY(-1px) !important" },
                                "&:active": { transform: "scale(0.97) !important" },
                            } }
                        >
                            <span className="font-medium">Reset Data</span>
                        </Button>

                        <Button
                            type="submit"
                            disabled={ createProjectLoading }
                            sx={ {
                                textTransform: "capitalize", backgroundColor: "#000", border: "1px solid #000", color: "#fff",
                                paddingX: "20px", fontSize: "14px", minWidth: "126px",
                                transition: "background 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease !important",
                                "&:hover": { backgroundColor: "#222 !important", transform: "translateY(-1px) !important", boxShadow: "0 4px 14px rgba(0,0,0,0.2) !important" },
                                "&:active": { transform: "scale(0.97) !important" },
                            } }
                        >
                            { createProjectLoading
                                ? <CircularProgress size={ 15 } sx={ { color: "#fff" } } />
                                : <span>Add Project</span>
                            }
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
                PaperProps={ { sx: { width: 750, borderRadius: "8px 0 0 8px", overflow: "visible" } } }
                anchor="right"
                open={ open }
            >
                <div
                    onClick={ toggleDrawer( false ) }
                    className="bg-white h-14 w-1.5 rounded-lg absolute top-1/2 -translate-y-1/2 -left-5 -translate-x-1/2 z-99999999 cursor-grab"
                    style={ { transition: "background 0.2s ease" } }
                    onMouseEnter={ e => e.currentTarget.style.backgroundColor = "#e0e0e0" }
                    onMouseLeave={ e => e.currentTarget.style.backgroundColor = "white" }
                />
                { form() }
            </Drawer>

            <Snackbar open={ openSnack } autoHideDuration={ 3000 } onClose={ () => setOpenSnack( false ) } anchorOrigin={ { vertical: "top", horizontal: "right" } }>
                <Alert onClose={ () => setOpenSnack( false ) } severity={ snackType } sx={ { width: "100%", fontSize: "13px" } }>
                    { snackMessage }
                </Alert>
            </Snackbar>
        </div>
    );
}