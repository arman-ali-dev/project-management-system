import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ( { children } ) =>
{
    const user = useSelector( ( state ) => state.user );
    const token = localStorage.getItem( "jwt" );
    console.log( "token 111 ", token );

    if ( !token )
    {
        return <Navigate to="/signin" replace />;
    }

    if ( !user )
    {
        return null;
    }

    return children;
};

export default PrivateRoute;