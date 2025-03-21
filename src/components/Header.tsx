import React, { useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { UserContext } from "../Context";

export default function Header(): React.ReactElement {
    const location = useLocation()
    const [user] = useContext(UserContext)
    
    return (<div className="">
        {
            user !== undefined && user !== null ? <div className={`w-full h-20 text-xl text-gray-300 flex flex-row justify-center md:justify-end items-center gap-5 md:pr-10 ${location.pathname === "/" ? "fixed md:static top-0" : ""}`}>
                <Link className={location.pathname === "/" ? "text-white" : ""} to="/">Timer</Link>
                <Link className={location.pathname === "/settings" ? "text-white" : ""} to="/settings">Settings</Link>
                <Link className={location.pathname === "/reports" ? "text-white" : ""} to="/reports">Reports</Link>
                <Link className={location.pathname === "/profile" ? "text-white" : ""} to="/profile">Profile</Link>
            </div>
            : <p></p>
            
        }
        <Outlet /> { /** This is where the body of your application will be rendered. **/}
    </div>);
}