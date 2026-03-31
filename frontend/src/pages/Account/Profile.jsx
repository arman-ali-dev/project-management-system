import
{
    Alert,
    Avatar,
    Button,
    CircularProgress,
    IconButton,
    Snackbar,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import editIcon from "../../assets/edit2.png";
import userAvatar from "../../assets/userAvatar.png";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { editProfile, fetchUserProfile } from "../../redux/member/userSlice";
import { uploadToCloudinary } from "../../util/uploadToCloudinary";

const Profile = () =>
{
    const dispatch = useDispatch();



    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );
        if ( !token ) return;

        dispatch( fetchUserProfile() )
    }, [ dispatch ] )



    const { user, loadingUpdate } = useSelector( ( state ) => state.user );

    const fileInputRef = useRef( null );
    const [ uploading, setUploading ] = useState( false );

    const [ openSnack, setOpenSnack ] = React.useState( false );
    const [ snackMessage, setSnackMessage ] = React.useState( "" );
    const [ snackType, setSnackType ] = React.useState( "success" );

    const formik = useFormik( {
        enableReinitialize: true,
        initialValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
            designation: user?.designation || "",
            profileImage: user?.profileImage || userAvatar,
        },

        validationSchema: Yup.object( {
            fullName: Yup.string().trim().required( "Full name is required" ),
            email: Yup.string().email( "Invalid email" ).required( "Email is required" ),
        } ),

        onSubmit: ( values ) =>
        {
            dispatch( editProfile( values ) )
                .unwrap()
                .then( () =>
                {
                    setSnackType( "success" );
                    setSnackMessage( "Profile updated successfully" );
                    setOpenSnack( true );
                } )
                .catch( ( err ) =>
                {
                    setSnackType( "error" );
                    setSnackMessage( err || "Something went wrong" );
                    setOpenSnack( true );
                } );
        },
    } );


    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const handleChangeImage = async ( e ) =>
    {
        const file = e.target.files[ 0 ];
        if ( !file ) return;

        if ( file.size > MAX_FILE_SIZE )
        {
            setSnackType( "error" );
            setSnackMessage( "Image size must be less than 10 MB" );
            setOpenSnack( true );
            return;
        }

        try
        {
            setUploading( true );
            const imageUrl = await uploadToCloudinary( file );
            formik.setFieldValue( "profileImage", imageUrl );
        } catch ( err )
        {
            setSnackType( "error" );
            setSnackMessage( err.message || "Image upload failed" );
            setOpenSnack( true );
        } finally
        {
            setUploading( false );
        }
    };



    return (
        <>
            <div className="mt-4 mx-8 relative">
                <div className="bg-white h-[85vh] shadow rounded-lg px-10 py-10">
                    {/* Header */ }
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <Avatar
                                src={
                                    formik.values.profileImage || user?.profileImage || userAvatar
                                }
                                alt="User Profile"
                                sx={ { width: 110, height: 110 } }
                            />

                            { uploading && (
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) }

                            <div className="absolute -bottom-0.5 right-3">
                                <IconButton
                                    onClick={ () => fileInputRef.current.click() }
                                    sx={ {
                                        backgroundColor: "#000",
                                        "&:hover": { backgroundColor: "#000" },
                                    } }
                                >
                                    <img className="w-3 h-3" src={ editIcon } alt="" />
                                </IconButton>
                            </div>

                            {/* Hidden File Input */ }
                            <input
                                ref={ fileInputRef }
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={ handleChangeImage }
                            />
                        </div>

                        <div>
                            <h3 className="text-[17px] font-medium">{ user?.fullName }</h3>
                            <p className="font-medium text-[#222222] text-[14px]">
                                { user?.designation }
                            </p>
                        </div>
                    </div>

                    {/* Form */ }
                    <form onSubmit={ formik.handleSubmit } className="mt-10">
                        <div className="flex gap-5">
                            <div className="flex-1">
                                <label className="text-[13px] font-medium">Full Name</label>
                                <input
                                    name="fullName"
                                    value={ formik.values.fullName }
                                    onChange={ formik.handleChange }
                                    onBlur={ formik.handleBlur }
                                    className="bg-[#EFEFEF] outline-0 mt-0.5 w-full text-[14px] py-2 px-4 rounded-lg"
                                />
                                { formik.touched.fullName && formik.errors.fullName && (
                                    <p className="text-red-500 text-[12px] mt-1">
                                        { formik.errors.fullName }
                                    </p>
                                ) }
                            </div>

                            <div className="flex-1">
                                <label className="text-[13px] font-medium">Email</label>
                                <input
                                    name="email"
                                    value={ formik.values.email }
                                    onChange={ formik.handleChange }
                                    onBlur={ formik.handleBlur }
                                    className="bg-[#EFEFEF] outline-0 mt-0.5 w-full text-[14px] py-2 px-4 rounded-lg"
                                />
                                { formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-[12px] mt-1">
                                        { formik.errors.email }
                                    </p>
                                ) }
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="text-[13px] font-medium">Designation</label>
                            <input
                                name="designation"
                                value={ formik.values.designation }
                                onChange={ formik.handleChange }
                                className="bg-[#EFEFEF] outline-0 mt-0.5 w-full text-[14px] py-2 px-4 rounded-lg"
                            />
                        </div>

                        {/* Buttons */ }
                        <div className="flex gap-2 mt-16 justify-end">
                            <Button
                                type="button"
                                onClick={ () =>
                                {
                                    formik.resetForm();

                                    if ( fileInputRef.current )
                                    {
                                        fileInputRef.current.value = "";
                                    }
                                } }
                                sx={ {
                                    textTransform: "capitalize",
                                    border: "1px solid #BCBCBC",
                                    color: "#000",
                                    paddingX: "30px",
                                    fontSize: "13px",
                                    borderRadius: "8px",
                                } }
                            >
                                <span className="font-medium">Discard Changes</span>
                            </Button>

                            <Button
                                type="submit"
                                disabled={ loadingUpdate }
                                sx={ {
                                    textTransform: "capitalize",
                                    backgroundColor: "#000",
                                    border: "1px solid #000",
                                    color: "#fff",
                                    paddingX: "30px",
                                    fontSize: "13px",
                                    borderRadius: "8px",
                                    minWidth: "158px",
                                } }
                            >
                                { loadingUpdate && (
                                    <CircularProgress size={ 15 } sx={ { color: "#fff" } } />
                                ) }

                                { !loadingUpdate && (
                                    <span className="font-medium">Save Changes</span>
                                ) }
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

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
};

export default Profile;
