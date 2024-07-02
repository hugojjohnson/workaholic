import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./Context";
import { get } from "./Network";
import useTimerBetter from "./hooks/useTimerBetter"

// Interfaces
import { Log, UserData, requestResponse } from "./Interfaces";

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
  // Context
  const [user, setUser] = useState<UserData>(undefined);
  const timer = useTimerBetter()

  useEffect(() => {
    const tempUser = JSON.parse(localStorage.getItem("workaholicUser") || "{}")
    console.log(tempUser)
    if (!tempUser.token) {
      setUser(null)
      return
    }

    setUser(tempUser)
    updateUser(tempUser)

    // Update user
    interface responseType {
      logs: Log[],
    }
    async function updateUser(tempUser: UserData): Promise<void> {
      const response: requestResponse<responseType> = await get("get-logs", { token: tempUser?.token })
      if (typeof response.data !== "string" && tempUser?.username) {
        setUser({
          ...tempUser,
          logs: response.data.logs,
        })
      }
      console.log(response)
    }
  }, [])

  useEffect(() => {
    if (user === undefined) {
      return
    }
    if (user?.token) {
      localStorage.setItem("workaholicUser", JSON.stringify(user))
      console.log("User changed.")
    } else {
      localStorage.removeItem("workaholicUser")
      console.log("Signed out.")
    }
  }, [user])

  if (user == null) {
    return (
      <UserContext.Provider value={[user, setUser]}>
        <BrowserRouter basename="workaholic">
          <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<Welcome />} />
              <Route path="sign-up" element={<SignIn />} />
              <Route path="sign-in" element={<SignUp />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    )
  }
  
  return (
    <UserContext.Provider value={[user, setUser]}>
      <BrowserRouter basename="workaholic">
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Dashboard timer={timer} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings timer={timer} />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;