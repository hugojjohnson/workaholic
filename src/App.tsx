import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./Context";
import { get } from "./Network";

// Interfaces
import { Log, UserData, RequestResponse, Project, SafeData } from "./Interfaces";

// Components
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import { NoPage } from "./components/NoPage";
import Settings from "./components/Settings";
import Reports from "./components/Reports";
import Welcome from "./components/Welcome";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App(): React.ReactElement {
  const [user, setUser] = useState<UserData>(undefined);
  const prevUserRef = useRef<SafeData>();

  /** ========== useEffects ========== **/
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug("Running in a dev environment.")
    } else {
      console.debug("Running in a prod environment.")
    }
    const tempUser = JSON.parse(localStorage.getItem("workaholicUser") || "{}")
    if (!tempUser.token) {
      setUser(null)
      return
    }
    console.log("V3")

    prevUserRef.current = {...tempUser, logs: []}
    setUser({...tempUser, logs: []}) // Sorry this can't be used... I actually couldn't tell you why.
    updateUser(tempUser)

    async function updateUser(tempUser: UserData): Promise<void> {
      type responseType = { logs: Log[], projects: Project[], duration: number, goal: number, timerId?: string, paused?: string, deadline?: string, description: string }
      const response: RequestResponse<responseType> = await get("/get-updates", { token: tempUser?.token })
      if (response.success && tempUser?.username) {
        setUser((currentUser) => {
          if (!currentUser) { return null }

          const prevUser = prevUserRef.current
          return {
            ...tempUser,
            logs: response.data.logs, // logs are the one exception to this rule: they should always come from the server, even if they are old.
            projects: currentUser.projects === prevUser?.projects ? response.data.projects : currentUser.projects,
            duration: currentUser.duration === prevUser?.duration ? response.data.duration : currentUser.duration,
            goal: currentUser.goal === prevUser?.goal ? response.data.goal : currentUser.goal,
            timerId: currentUser.timerId === prevUser?.timerId ? response.data.timerId : currentUser.timerId,
            paused: currentUser.paused === prevUser?.paused ? response.data.paused : currentUser.paused,
            deadline: currentUser.deadline === prevUser?.deadline ? response.data.deadline : currentUser.deadline,
            description: currentUser.description === prevUser?.description ? response.data.description : currentUser.description,
            // logs: response.data.logs,
            // projects: response.data.projects,
            // duration: response.data.duration,
            // goal: response.data.goal,
            // timerId: response.data.timerId,
            // paused: response.data.paused,
            // deadline: response.data.deadline,
            // description: response.data.description
          }
        })
      } else if (response.status === 403) {
        setUser(null)
      }
    }
  }, [])

  useEffect(() => {
    if (user === undefined) {
      return
    }
    if (user?.token) {
      localStorage.setItem("workaholicUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("workaholicUser")
    }
  }, [user])

  /** ========== JSX ========== **/
  if (user == null || user === undefined) {
    return (
      <UserContext.Provider value={[user, setUser]}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<Welcome />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="sign-in" element={<SignIn />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    )
  }

  return (
    <UserContext.Provider value={[user, setUser]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;