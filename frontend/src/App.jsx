import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Projects from "./pages/Project/Projects";
import KanbanBoard from "./pages/Kanban/KanbanBoard";
import { Routes, Route, useLocation } from "react-router-dom";
import MyTasks from "./pages/Tasks/MyTasks";
import Calendar from "./pages/Calendar/Calendar";
import Chat from "./pages/Chat/Chat";
import Drive from "./pages/Drive/Drive";
import Users from "./pages/Users/Users";
import Profile from "./pages/Account/Profile";
import Signin from "./pages/Auth/Signin";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "./redux/member/userSlice";
import SetPassword from "./pages/Auth/SetPassword";
import { fetchReminders } from "./redux/member/reminderSlice";
import { fetchNotifications } from "./redux/member/notificationSlice";
import PrivateRoute from "./components/PrivateRoutes";
import AdminRoute from "./components/AdminRoutes";
import NotFound from "./pages/404/NotFound";

const App = () =>
{
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect( () =>
    {
        const token = localStorage.getItem( "jwt" );

        if ( token )
        {
            console.log( "Fetching user data..." );
            dispatch( fetchUserProfile() );
            dispatch( fetchReminders() );
            dispatch( fetchNotifications() );
        }
    }, [ dispatch, location.pathname ] );

    const validPaths = [
        "/dashboard", "/projects", "/my-tasks", "/calendar",
        "/chat", "/drive", "/users", "/profile"
    ];

    const isNotFoundPage = !validPaths.includes( location.pathname ) &&
        !location.pathname.startsWith( "/projects/" ) &&
        location.pathname !== "/signin" &&
        !location.pathname.startsWith( "/set-password" );

    const isAuthPage =
        location.pathname === "/signin" ||
        location.pathname.startsWith( "/set-password" );

    const hideLayout = isAuthPage || isNotFoundPage;

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                { !hideLayout && <Sidebar /> }
                <div
                    className={ `flex-1 flex flex-col ${ !hideLayout ? "ml-76.25" : "" } overflow-hidden` }
                >
                    { !hideLayout && <Navbar /> }
                    <div className="flex-1 overflow-y-auto">
                        <Routes>
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/projects"
                                element={
                                    <PrivateRoute>
                                        <Projects />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/projects/:projectId/kanban"
                                element={
                                    <PrivateRoute>
                                        <KanbanBoard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/my-tasks"
                                element={
                                    <PrivateRoute>
                                        <MyTasks />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/calendar"
                                element={
                                    <PrivateRoute>
                                        <Calendar />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/chat"
                                element={
                                    <PrivateRoute>
                                        <Chat />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/drive"
                                element={
                                    <PrivateRoute>
                                        <Drive />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/users"
                                element={
                                    <PrivateRoute>
                                        <Users />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <Profile />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="/signin" element={ <Signin /> } />
                            <Route path="/set-password" element={ <SetPassword /> } />
                            <Route path="/*" element={ <NotFound /> } />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;
