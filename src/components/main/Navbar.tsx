"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? "dark:text-white text-black" : "opacity-50";

  return (
    <>
      {/* Desktop Nav */}
      <div className="fixed top-0 hidden h-20 w-full flex-row items-center justify-end gap-5 pr-10 text-xl text-gray-800 md:flex dark:text-gray-300">
        <Link className={isActive("/")} href="/">
          Timer
        </Link>
        <Link className={isActive("/settings")} href="/settings">
          Settings
        </Link>
        <Link className={isActive("/reports")} href="/reports">
          Reports
        </Link>
        <Link className={isActive("/profile")} href="/profile">
          Profile
        </Link>
      </div>

      {/* Mobile Nav */}
      <div className="fixed bottom-0 flex h-20 w-full items-center justify-around py-3 text-xl md:hidden dark:text-gray-300">
        <Link
          className={`flex flex-col items-center gap-1 transition-all duration-100 ease-in-out active:scale-75 ${isActive("/")}`}
          href="/"
        >
          <Image src="/icons/timer.png" className="w-8 invert" alt="timer" />
          <p className="text-xs">Timer</p>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 transition-all duration-100 ease-in-out active:scale-75 ${isActive("/settings")}`}
          href="/settings"
        >
          <Image src="/icons/settings.png" className="w-8 invert" alt="settings" />
          <p className="text-xs">Settings</p>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 transition-all duration-100 ease-in-out active:scale-75 ${isActive("/reports")}`}
          href="/reports"
        >
          <Image src="/icons/reports.png" className="w-8 invert" alt="reports" />
          <p className="text-xs">Reports</p>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 transition-all duration-100 ease-in-out active:scale-75 ${isActive("/profile")}`}
          href="/profile"
        >
          <Image src="/icons/profile.png" className="w-8 invert" alt="profile" />
          <p className="text-xs">Profile</p>
        </Link>
      </div>
    </>
  );
}
