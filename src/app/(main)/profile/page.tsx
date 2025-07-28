"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useUser } from "~/hooks/UserContext";


export default function Profile() {
    const user = useUser();
    const router = useRouter();

    return <div className="px-7 md:px-32 pt-10 flex flex-col gap-6">
        <h1 className="text-4xl mb-2">Profile</h1>

        <div>
            <h3 className="text-2xl">Personal information</h3>
            {/* <Separator className="w-[35%] mt-2" /> */}
            <p className="mt-1 text-muted-foreground">Username: {user.user?.name}</p>
            {/* <p>Email: {user?.email}</p> */}
            {/* <p>Profile photo</p> */}
        </div>

        <div>
            <h3 className="text-2xl mt-4">Security</h3>
            {/* <Separator className="w-[35%] mt-2" /> */}
            <div className="grid gap-4 mt-2">
                <div className="flex flex-col gap-1">
                    <label htmlFor="currentPassword">Current password</label>
                    <Input id="currentPassword" type="password" placeholder="•••••••••••" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="newPassword">New password</label>
                    <Input id="newPassword" type="password" placeholder="•••••••••••" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="confirmPassword">Confirm new password</label>
                    <Input id="confirmPassword" type="password" placeholder="•••••••••••" />
                </div>
            </div>

            <Button
                variant="outline"
                className="mt-4 w-40 border-gray-500 text-gray-500 hover:text-white"
            >
                Change password
            </Button>
        </div>

        {/* Sign out */}
        {/* <h3 className="text-2xl mt-8">Sign Out</h3> */}
        {/* <Separator className="w-[35%] mt-2" /> */}
        <Button
            variant="outline"
            className="w-40 mt-4 border-white text-white"
            onClick={async () => {
                await signOut();
                router.replace("/");
            }}
        // onClick={async () => {
        //   try {
        //     await get("users/sign-out", { token: user?.token })
        //   } catch (err) {
        //     console.error(err)
        //   }
        //   setUser(null)
        //   navigate("/")
        // }}
        >
            Sign out
        </Button>

        <div>
            <h3 className="text-2xl mt-8">Danger</h3>
            <Button
                variant="outline"
                className="w-40 mt-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500"
            >
                Delete account
            </Button>
        </div>
    </div>
}