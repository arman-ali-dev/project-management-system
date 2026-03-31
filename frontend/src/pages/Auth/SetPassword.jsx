import
{
    Alert,
    Button,
    CircularProgress,
    IconButton,
    Snackbar,
    useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import mailIcon from "../../assets/mail.png";
import lockIcon from "../../assets/lock.png";
import viewIcon from "../../assets/view.png";
import backIcon from "../../assets/back.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthenticated, setJwt } from "../../redux/member/authSlice";

const SetPassword = () =>
{
    const navigate = useNavigate();
    const [ showPassword, setShowPassword ] = useState( false );
    const [ openSnack, setOpenSnack ] = React.useState( false );
    const [ snackMessage, setSnackMessage ] = React.useState( "" );
    const [ loading, setLoading ] = useState( false );
    const dispatch = useDispatch();

    const [ searchParams ] = useSearchParams()
    const TOKEN = searchParams.get( "token" );

    console.log( TOKEN );


    const formik = useFormik( {
        initialValues: {
            email: "",
            password: "",
        },
        enableReinitialize: true,

        validationSchema: Yup.object( {
            password: Yup.string()
                .min( 6, "Password must be at least 6 characters" )
                .required( "Password is required" ),

            confirmPassword: Yup.string()
                .oneOf( [ Yup.ref( "password" ) ], "Passwords do not match" )
                .required( "Confirm password is required" ),
        } ),

        onSubmit: async ( values ) =>
        {
            setLoading( true );
            try
            {
                const { data } = await axios.post(
                    "http://localhost:8080/auth/set-password",
                    { password: values.password, token: TOKEN },
                );

                console.log( "Set Password Data", data );
                navigate( "/signin" );
            } catch ( error )
            {
                console.log( error.response?.data );

                if ( error.response?.data )
                {
                    setSnackMessage( error.response?.data );
                    setOpenSnack( true );
                }
            } finally
            {
                setLoading( false );
            }
        },
    } );

    return (
        <>
            <div className="flex justify-center">
                <form onSubmit={ formik.handleSubmit } className="w-100 pt-20">
                    <IconButton onClick={ () => navigate( -1 ) } className="pt-10">
                        <img src={ backIcon } className="w-4 h-4" alt="" />
                    </IconButton>

                    <div className="text-center">
                        <h3 className="text-[#272626] text-[18px] font-semibold">
                            Set Your Password
                        </h3>
                        <p className="text-[#727272] text-[14px]">
                            Please enter your details to get started
                        </p>
                    </div>

                    {/* Password */ }
                    <div className="mt-8">
                        <label className="text-[13px] font-medium text-[#363636]">
                            Password*
                        </label>

                        <div className="relative">
                            <input
                                name="password"
                                type={ showPassword ? "text" : "password" }
                                placeholder="• • • • • • •"
                                value={ formik.values.password }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                className="border-[#B7B7B7] placeholder:text-[18px] pr-4 pl-8.5 w-full outline-0 mt-0.5 border text-[14px] py-2 rounded-md"
                            />

                            <img
                                src={ lockIcon }
                                className="w-4 h-4 opacity-50 absolute top-1/2 -translate-y-1/2 left-3"
                                alt=""
                            />

                            <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                <IconButton onClick={ () => setShowPassword( !showPassword ) }>
                                    <img
                                        src={ viewIcon }
                                        className="w-4.5 h-4.5 opacity-50"
                                        alt=""
                                    />
                                </IconButton>
                            </div>
                        </div>

                        { formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-[12px] mt-1">
                                { formik.errors.password }
                            </p>
                        ) }
                    </div>

                    {/* Password */ }
                    <div className="mt-3">
                        <label className="text-[13px] font-medium text-[#363636]">
                            Comfirm Password*
                        </label>

                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={ showPassword ? "text" : "password" }
                                placeholder="• • • • • • •"
                                value={ formik.values.confirmPassword }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                className="border-[#B7B7B7] placeholder:text-[18px] pr-4 pl-8.5 w-full outline-0 mt-0.5 border text-[14px] py-2 rounded-md"
                            />

                            <img
                                src={ lockIcon }
                                className="w-4 h-4 opacity-50 absolute top-1/2 -translate-y-1/2 left-3"
                                alt=""
                            />

                            <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                <IconButton onClick={ () => setShowPassword( !showPassword ) }>
                                    <img
                                        src={ viewIcon }
                                        className="w-4.5 h-4.5 opacity-50"
                                        alt=""
                                    />
                                </IconButton>
                            </div>
                        </div>

                        { formik.touched.confirmPassword &&
                            formik.errors.confirmPassword && (
                                <p className="text-red-500 text-[12px] mt-1">
                                    { formik.errors.confirmPassword }
                                </p>
                            ) }
                    </div>

                    {/* Submit */ }
                    <div className="mt-7">
                        <Button
                            type="submit"
                            fullWidth
                            disabled={ loading }
                            sx={ {
                                height: "38px",
                                textTransform: "capitalize",
                                backgroundColor: "#000",
                                border: "1px solid #000",
                                color: "#fff",
                                paddingX: "30px",
                                fontSize: "13px",
                                borderRadius: "4px",
                                position: "relative",
                                "&:hover": {
                                    backgroundColor: "#111",
                                },
                            } }
                        >
                            { loading && <CircularProgress size={ 15 } sx={ { color: "#fff" } } /> }

                            { !loading && <span className="font-medium">Set Password</span> }
                        </Button>
                    </div>
                </form>
            </div>

            <Snackbar
                open={ openSnack }
                autoHideDuration={ 3000 }
                onClose={ () => setOpenSnack( false ) }
                anchorOrigin={ { vertical: "top", horizontal: "right" } }
            >
                <Alert
                    onClose={ () => setOpenSnack( false ) }
                    severity="error"
                    sx={ { width: "100%" } }
                >
                    { snackMessage }
                </Alert>
            </Snackbar>
        </>
    );
};

export default SetPassword;
