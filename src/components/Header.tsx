import React, { useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { UserContext } from "../Context";

export default function Header(): React.ReactElement {
    const location = useLocation()
    const [user] = useContext(UserContext)
    
    return (<div>
        {/* <div className=""><Outlet /></div> */}
        {
            user && <div className="w-full h-20 text-xl text-gray-300 hidden md:flex flex-row justify-center md:justify-end items-center gap-5 md:pr-10 fixed md:static top-0">
                <Link className={location.pathname === "/" ? "text-white" : ""} to="/">Timer</Link>
                <Link className={location.pathname === "/settings" ? "text-white" : ""} to="/settings">Settings</Link>
                <Link className={location.pathname === "/reports" ? "text-white" : ""} to="/reports">Reports</Link>
                <Link className={location.pathname === "/profile" ? "text-white" : ""} to="/profile">Profile</Link>
            </div>
            
        }
        <Outlet /> { /** This is where the body of your application will be rendered. **/}
        {
            user && <div className="w-full h-20 text-xl text-gray-300 bg-[#242424] flex flex-row md:justify-end items-center justify-around py-3 md:pr-10 visible md:hidden fixed md:static bottom-0">
                <Link className={`flex flex-col items-center gap-1 active:scale-75 transition-all ease-in-out duration-100 ${location.pathname === "/" ? "text-white" : "opacity-50"}`} to="/"><img src="./icons/timer.png" className="w-8 invert" /><p className="text-xs">Timer</p></Link>
                <Link className={`flex flex-col items-center gap-1 active:scale-75 transition-all ease-in-out duration-100 ${location.pathname === "/settings" ? "text-white" : "opacity-50"}`} to="/settings"><img src="./icons/settings.png" className="w-8 invert" /><p className="text-xs">Settings</p></Link>
                <Link className={`flex flex-col items-center gap-1 active:scale-75 transition-all ease-in-out duration-100 ${location.pathname === "/reports" ? "text-white" : "opacity-50"}`} to="/reports"><img src="./icons/reports.png" className="w-8 invert" /><p className="text-xs">Reports</p></Link>
                <Link className={`flex flex-col items-center gap-1 active:scale-75 transition-all ease-in-out duration-100 ${location.pathname === "/profile" ? "text-white" : "opacity-50"}`} to="/profile"><img src="./icons/profile.png" className="w-8 invert" /><p className="text-xs">Profile</p></Link>
            </div>
            
        }
    </div>);
}