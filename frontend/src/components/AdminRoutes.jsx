import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ( { children } ) =>
{
    const user = useSelector( ( state ) => state.user );

    if ( !user ) return null;

    if ( user.role !== "ADMIN" )
    {
        return <Navigate to="/projects" replace />;
    }

    return children;
};

export default AdminRoute;