import React, { useContext } from "react";
import { UserContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { get } from "../Network";


export default function Profile(): React.ReactElement {
    const [user, setUser] = useContext(UserContext)

    const navigate = useNavigate()

    return <div className='px-7 md:px-32 pt-10 flex flex-col gap-3'>
        <h1 className="text-4xl mb-5">Profile</h1>

        <h3 className="text-2xl">Personal information</h3>
        {/* <div className="w-[35%] border-[0.5px] border-gray-300"></div> */}
        <h5>Username: {user?.username}</h5>
        {/* <h5>Email: {user?.email}</h5> */}
        {/* <h5>Profile photo</h5> */}

        <h3 className="text-2xl mt-8">Security</h3>
        {/* <div className="w-[35%] border-[0.5px] border-gray-300"></div> */}
        <div>
        <table>
            <tr>
                <td className="TABLEROW py-1 pr-2">Current password</td>
                <td className="TABLEROW py-1 px-2"><input type="password" placeholder="•••••••••••" className="w-64 p-2 bg-[#323232] rounded-md text-lg" /></td>
            </tr>
            <tr>
                <td className="TABLEROW py-1 pr-2">New password</td>
                <td className="TABLEROW py-1 px-2"><input type="password" placeholder="•••••••••••" className="w-64 p-2 bg-[#323232] rounded-md text-lg" /></td>
            </tr>
            <tr>
                <td className="TABLEROW py-1 pr-2">Confirm new password</td>
                <td className="TABLEROW py-1 px-2"><input type="password" placeholder="•••••••••••" className="w-64 p-2 bg-[#323232] rounded-md text-lg" /></td>
            </tr>
        </table>
        </div>

        <div>
            <button className="w-40 p-[10px] mt-2 rounded-md text-center border-[1px] border-gray-500 text-gray-500">Change password</button>
        </div>


        {/* <h3 className="text-2xl mt-8">Sign Out</h3> */}
        {/* <div className="w-[35%] border-[0.5px] border-gray-300"></div> */}
        <button className="w-40 p-2 rounded-md text-lg text-center border-[1px] border-white" onClick={async () => {
            try {
                await get("users/sign-out", { token: user?.token })
            } catch (err) {
                console.error(err)
            }
            setUser(null)
            navigate("/")
        }}>Sign out</button>
        


        <h3 className="text-2xl mt-8">Danger</h3>
        <button className="w-40 rounded-md border-2 border-red-500 p-3 text-red-500 hover:cursor-pointer">Delete account</button>
    </div>
}