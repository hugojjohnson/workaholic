import React, { useContext } from "react";
import { UserContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { post } from "../Network";


export default function Profile(): React.ReactElement {
    const [user, setUser] = useContext(UserContext)

    const navigate = useNavigate()

    return <div className='px-7 md:px-32 pt-10'>
        <h1 className="text-4xl mb-5">Profile</h1>

        <h3 className="text-3xl mt-16">Personal information</h3>
        <div className="w-full border-[1px] border-gray-300"></div>
        <h5>Username: {user?.username}</h5>
        {/* <h5>Email: {user?.email}</h5> */}
        <h5>Email: unknown</h5>
        {/* <h5>Profile photo</h5> */}

        <h3 className="text-3xl mt-16">Security</h3>
        <div className="w-full border-[1px] border-gray-300"></div>
        <div className="flex flex-row gap-2">
            <h5>Current password</h5>
            <input className="border-2 border-gray-500 rounded-md" />
        </div>
        <div className="flex flex-row gap-2">
            <h5>New password</h5>
            {/* <Input placeholder="••••••••••" /> */}
        </div>
        <div className="flex flex-row gap-2">
            <h5>Confirm new password</h5>
            {/* <Input placeholder="••••••••••" /> */}
        </div>
        <button>Change password</button>



        <button className="text-lg p-3 mt-10 border-[1px] border-white rounded-md block" onClick={async () => {
            try {
                await post<unknown>("users/sign-out", {}, { token: user?.token })
            } catch (err) {
                console.error(err)
            }
            setUser(null)
            navigate("/")

        }}>Sign out</button>
        


        <h3 className="text-3xl mt-16">Danger</h3>
        <div className="w-full border-[1px] border-gray-300"></div>
        <button className="rounded-md border-2 border-red-500 p-3 text-red-500 hover:cursor-pointer">Delete account</button>
    </div>
}