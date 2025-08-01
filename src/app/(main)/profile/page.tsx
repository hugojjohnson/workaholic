"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useUser } from "~/hooks/UserContext";

export default function Profile() {
  const user = useUser();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 px-7 pt-10 md:px-32">
      <h1 className="mb-2 text-4xl">Profile</h1>

      <div>
        <h3 className="text-2xl">Personal information</h3>
        {/* <Separator className="w-[35%] mt-2" /> */}
        <p className="text-muted-foreground mt-1">
          Username: {user.user?.name}
        </p>
        {/* <p>Email: {user?.email}</p> */}
        {/* <p>Profile photo</p> */}
      </div>

      {/* Sign out */}
      {/* <h3 className="text-2xl mt-8">Sign Out</h3> */}
      {/* <Separator className="w-[35%] mt-2" /> */}
      <Button
        variant="outline"
        className="mt-4 w-40 border-white text-white"
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
        <h3 className="mt-8 text-2xl">Danger</h3>
        <Button
          variant="outline"
          className="mt-2 w-40 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          Delete account
        </Button>
      </div>
    </div>
  );
}
