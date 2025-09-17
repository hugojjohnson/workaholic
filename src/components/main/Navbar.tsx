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
        <Link className={isActive("/logs")} href="/logs">
          Logs
        </Link>
        <Link className={isActive("/reports")} href="/reports">
          Reports
        </Link>
        <Link className={isActive("/settings")} href="/settings">
          Settings
        </Link>
      </div>

      {/* Mobile Nav */}
      <div className="fixed z-10 bottom-0 flex h-20 w-full items-center justify-around py-3 text-xl md:hidden dark:text-gray-300 bg-background border-t-[1px] border-[rgb(50,50,50)]">
        <Link
          className={`flex flex-col items-center gap-1 transition-all duration-100 ease-in-out active:scale-75 ${isActive("/")}`}
          href="/"
        >
          <Image src="/icons/timer.png" width={30} height={30} className="dark:invert" alt="timer" />
          <p className="text-xs">Timer</p>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 transition-all duration-100 ease-in-out active:scale-75 ${isActive("/logs")}`}
          href="/logs"
        >
          <Image src="/icons/logs.png" width={30} height={30} className="dark:invert" alt="logs" />
          <p className="text-xs">Logs</p>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 transition-all duration-100 ease-in-out active:scale-75 ${isActive("/reports")}`}
          href="/reports"
        >
          <Image src="/icons/reports.png" width={30} height={30} className="dark:invert" alt="reports" />
          <p className="text-xs">Reports</p>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 transition-all duration-100 ease-in-out active:scale-75 ${isActive("/settings")}`}
          href="/settings"
        >
          <Image src="/icons/settings.png" width={30} height={30} className="dark:invert" alt="settings" />
          <p className="text-xs">Settings</p>
        </Link>
      </div>
    </>
  );
}
