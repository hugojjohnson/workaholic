import React, { useContext, useState } from "react";
import { UserContext } from "../Context";
import { post } from "../Network";

import { Log, User, Project } from "../Interfaces";
import { Link, useNavigate } from "react-router-dom";


export default function SignIn(): React.ReactElement {
    const [, setUser] = useContext<User>(UserContext)

    const navigate = useNavigate()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorText, setErrorText] = useState<string>("")

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
                <p>Email</p>
                <input className="bg-transparent p-3 rounded-md border-[1px] border-white w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="w-full">
                <p>Password</p>
                <input className="bg-transparent p-3 rounded-md border-[1px] border-white w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button className="bg-transparent p-3 border-[1px] border-white rounded-md" onClick={async () => (await requestLogin())}>Sign In</button>

            <p>{errorText}</p>
        </div></>


    interface responseType {
        username: string,
        token: string,
        projects: Project[],
        duration: number,
        project: string,
        logs: Log[]
    }

    async function requestLogin(): Promise<void> {
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

        if (email === "" || password === "") {
            setErrorText("Please fill in the email and password.")
            return
        }
        if (!email.includes("@")) {
            setErrorText("Email is invalid.")
            return
        }

        const salt = await saltify(email + password)
        const response = await post<responseType>("users/sign-in/email", {}, {
                email: email,
                hash: salt
        })
        if (response.success) {
            setUser({
                username: response.data.username,
                token: response.data.token,
                projects: response.data.projects,
                duration: response.data.duration,
                project: response.data.projects[0] || { name: "Default", colour: "red" },
                logs: response.data.logs || [],
                description: "",
                goal: 3
            });
            navigate('/');
        }
        console.log("Status")
        console.log(response.status)
        if (response.status === 401) {
            setErrorText("Username or password incorrect. Please try again.")
        } else {
            setErrorText("An unknown error occurred.")
        }
    }
}
