'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import DarkModeToggle from "../settings/DarkModeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? "text-white" : "opacity-50";

  return (
    <>
      {/* Desktop Nav */}
      <div className="w-full h-20 text-xl text-gray-300 hidden md:flex flex-row justify-end items-center gap-5 pr-10 fixed top-0">
        <Link className={isActive("/")} href="/">Timer</Link>
        <Link className={isActive("/settings")} href="/settings">Settings</Link>
        <Link className={isActive("/reports")} href="/reports">Reports</Link>
        <Link className={isActive("/profile")} href="/profile">Profile</Link>
        <DarkModeToggle />
      </div>

      {/* Mobile Nav */}
      <div className="w-full h-20 text-xl text-gray-300 flex md:hidden justify-around items-center py-3 fixed bottom-0">
        <Link className={`flex flex-col items-center gap-1 active:scale-75 transition-all ease-in-out duration-100 ${isActive("/")}`} href="/">
          <img src="/icons/timer.png" className="w-8 invert" />
          <p className="text-xs">Timer</p>
        </Link>
        <Link className={`flex flex-col items-center gap-1 active:scale-75 transition-all ease-in-out duration-100 ${isActive("/settings")}`} href="/settings">
          <img src="/icons/settings.png" className="w-8 invert" />
          <p className="text-xs">Settings</p>
        </Link>
        <Link className={`flex flex-col items-center gap-1 active:scale-75 transition-all ease-in-out duration-100 ${isActive("/reports")}`} href="/reports">
          <img src="/icons/reports.png" className="w-8 invert" />
          <p className="text-xs">Reports</p>
        </Link>
        <Link className={`flex flex-col items-center gap-1 active:scale-75 transition-all ease-in-out duration-100 ${isActive("/profile")}`} href="/profile">
          <img src="/icons/profile.png" className="w-8 invert" />
          <p className="text-xs">Profile</p>
        </Link>
      </div>
    </>
  );
}
