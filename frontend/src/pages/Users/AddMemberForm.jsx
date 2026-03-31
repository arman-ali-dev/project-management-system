import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import plusIcon from "../../assets/plus.png";
import
{
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../redux/admin/userSlice";

export default function AddMemberForm ( { toggleDrawer, open } )
{
    const dispatch = useDispatch();
    const [ openSnack, setOpenSnack ] = React.useState( false );
    const [ snackMessage, setSnackMessage ] = React.useState( "" );
    const [ snackType, setSnackType ] = React.useState( "success" );

    const formik = useFormik( {
        initialValues: {
            fullName: "",
            email: "",
            role: "",
            designation: "",
        },

        validationSchema: Yup.object( {
            fullName: Yup.string().trim().required( "Full name is required" ),

            email: Yup.string()
                .email( "Invalid email address" )
                .required( "Email is required" ),

            role: Yup.string().required( "Role is required" ),

            designation: Yup.string().required( "Role is required" ),
        } ),

        onSubmit: ( values, { resetForm } ) =>
        {
            console.log( "Add Member Payload:", values );

            dispatch( createUser( values ) )
                .unwrap()
                .then( () =>
                {
                    setSnackType( "success" );
                    setSnackMessage( "Member added successfully" );
                    setOpenSnack( true );

                    resetForm();
                    toggleDrawer()( false );
                } )
                .catch( ( err ) =>
                {
                    setSnackType( "error" );
                    setSnackMessage( err || "Something went wrong" );
                    setOpenSnack( true );
                } );




        },
    } );

    const { createUserLoading } = useSelector( ( state ) => state.adminUser );

    const form = () => (
        <Box sx={ { width: 750 } } role="presentation">
            <div className="px-8 py-10">
                <h2 className="font-semibold flex gap-3 items-center">
                    <img src={ plusIcon } className="w-4" alt="" /> Add New Member
                </h2>

                <form className="mt-5 space-y-4" onSubmit={ formik.handleSubmit }>
                    {/* Full Name + Email */ }
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={ formik.values.fullName }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                className="border-[#BCBCBC] w-full outline-0 px-4 py-2 text-[15px] mt-1 border rounded-sm"
                            />
                            { formik.touched.fullName && formik.errors.fullName && (
                                <p className="text-red-500 text-[12px] mt-1">
                                    { formik.errors.fullName }
                                </p>
                            ) }
                        </div>

                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={ formik.values.email }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                className="border-[#BCBCBC] w-full outline-0 px-4 py-2 text-[15px] mt-1 border rounded-sm"
                            />
                            { formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-[12px] mt-1">
                                    { formik.errors.email }
                                </p>
                            ) }
                        </div>
                    </div>

                    {/* Role + Designation */ }
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Role</label>

                            <Select
                                fullWidth
                                displayEmpty
                                name="role"
                                value={ formik.values.role }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                className="border border-[#BCBCBC] w-full text-[15px] mt-1 rounded-sm h-10.5"
                                sx={ {
                                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "& .MuiSelect-select": {
                                        paddingLeft: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                } }
                            >
                                <MenuItem value="">
                                    <em>Select Role</em>
                                </MenuItem>
                                <MenuItem value="MEMBER">Member</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                            </Select>

                            { formik.touched.role && formik.errors.role && (
                                <p className="text-red-500 text-[12px] mt-1">
                                    { formik.errors.role }
                                </p>
                            ) }
                        </div>

                        <div className="flex-1">
                            <label className="text-[#616161] text-[14px]">Designation</label>
                            <input
                                type="text"
                                name="designation"
                                value={ formik.values.designation }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                className="border-[#BCBCBC] w-full outline-0 px-4 py-2 text-[15px] mt-1 border rounded-sm"
                            />

                            { formik.touched.designation && formik.errors.designation && (
                                <p className="text-red-500 text-[12px] mt-1">
                                    { formik.errors.designation }
                                </p>
                            ) }
                        </div>
                    </div>

                    {/* Buttons */ }
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
                            <span className="font-medium">Reset Data</span>
                        </Button>

                        <Button
                            type="submit"
                            disabled={ createUserLoading }
                            sx={ {
                                textTransform: "capitalize",
                                backgroundColor: "#000",
                                border: "1px solid #000",
                                color: "#fff",
                                paddingX: "20px",
                                fontSize: "14px",
                                minWidth: "134px",
                            } }
                        >
                            { createUserLoading && (
                                <CircularProgress size={ 15 } sx={ { color: "#fff" } } />
                            ) }

                            { !createUserLoading && <span>Add Member</span> }

                        </Button>
                    </div>
                </form>
            </div>
        </Box>
    );

    return (
        <>
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
                    className="bg-white h-14 w-1.5 rounded-lg absolute top-1/2 -translate-y-1/2 -left-5 z-50 cursor-grab"
                />
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
        </>
    );
}
