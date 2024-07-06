import React, { useState } from "react";
import { post } from "../Network";
import { Link, useNavigate } from "react-router-dom";
import { requestResponse } from "../Interfaces";


export default function SignUp(): React.ReactElement {
    const navigate = useNavigate()

    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    return <>
        <div className="w-full h-20 text-xl text-gray-300 flex flex-row justify-center md:justify-end items-center gap-5 md:pr-10">
            <Link className="text-white border-[0.5px] border-white rounded-md p-2" to="/sign-in">Sign in</Link>
            <Link className="text-white border-[0.5px] border-white rounded-md p-2" to="/sign-up">Sign up</Link>
            {/* <Link to="/profile" style={{ "display": "flex", "alignItems": "center" }}>
                <img className="profile-pic" src={profileUrl} alt="profile pic" />
                <p>Profile</p>
            </Link> */}
        </div>

        <div className="flex flex-col gap-8 items-center max-w-screen-sm mx-auto">
            <div className="w-full">
                <p>Username</p>
                <input className="bg-transparent p-3 rounded-md border-[1px] border-white w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="w-full">
                <p>Email</p>
                <input className="bg-transparent p-3 rounded-md border-[1px] border-white w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="w-full">
                <p>Password</p>
                <input className="bg-transparent p-3 rounded-md border-[1px] border-white w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="w-full">
                <p>Confirm password</p>
                <input className="bg-transparent p-3 rounded-md border-[1px] border-white w-full" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <button className="bg-transparent p-3 border-[1px] border-white rounded-md" onClick={async () => await requestSignUp()}>Sign Up</button>

            {/* <p>{errorText}</p> */}
        </div></>

    async function requestSignUp(): Promise<requestResponse<unknown>> {
        // encrypt the password before sending it
        // from https://stackoverflow.com/questions/18338890
        async function saltify(data: string): Promise<string> {
            // encode as UTF-8
            const msgBuffer = new TextEncoder().encode(data);

            // hash the data
            const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

            // convert ArrayBuffer to Array
            const hashArray = Array.from(new Uint8Array(hashBuffer));

            // convert bytes to hex string
            const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            return hashHex;
        }

        if (username === "" || password === "") {
            return {
                success: false,
                data: "Please fill in the username and password."
            }
        }
        if (password !== confirmPassword) {
            return {
                success: false,
                data: "Passwords do not match."
            }
        }
        if (!email.includes("@")) {
            return {
                success: false,
                data: "Email is not valid."
            }
        }

        const salt = await saltify(email + password)
        const response = await post("users/sign-up/email", {}, {
            email: email,
            username: username,
            hash: salt
        })
        if (response.success) {
            navigate("/sign-in")
            return response
        }
        return response
    }
}
