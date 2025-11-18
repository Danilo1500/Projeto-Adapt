import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login/Login";
import Feed from "./pages/Feed/Feed";
import Messages from "./pages/Messages/Messages";
import ChatBox from "./pages/ChatBox/ChatBox";
import Connections from "./pages/Connection/Connections";
import Discover from "./pages/Discover/Discover";
import Profile from "./pages/Profile/Profile";
import CreatePost from "./pages/CreatePost/CreatePost";
import { useUser, useAuth } from "@clerk/clerk-react";
import Layout from "./pages/Layout/Layout";
import { Toaster } from "react-hot-toast";
import JobCreation from "./pages/jobCreation/JobCreation";
import Empresa from "./pages/Empresa/Empresa";
import CompanyProfile from "./pages/CompanyProfile/CompanyProfile";
import { useEffect } from "react";

function App() {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (user) {
      getToken().then((token) => console.log(token));
    }
  }, [user]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="job-creation" element={<JobCreation />} />
          <Route path="empresa" element={<Empresa />} />
          <Route path="company" element={<CompanyProfile />} />
          <Route path="/company/:companyId" element={<CompanyProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
