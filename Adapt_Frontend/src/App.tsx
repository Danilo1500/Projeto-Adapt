import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../src/pages/home/home.scss";
import Home from "./pages/home/home";
import Login from "./pages/Login/Login";
import Feed from "./pages/Feed/Feed";
import Messages from "./pages/Messages/Messages";
import ChatBox from "./pages/ChatBox/ChatBox";
import Connections from "./pages/Connection/Connections";
import Discover from "./pages/Discover/Discover";
import Profile from "./pages/Profile/Profile";
import CreatePost from "./pages/CreatePost/CreatePost";
import {useUser} from "@clerk/clerk-react";
import Layout from "./pages/Layout/Layout";
import { Toaster } from "react-hot-toast";

function App() {
  const {user} = useUser();
  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={ !user ? <Login /> : <Layout />} >
      <Route index element={<Feed />} />
      <Route path="messages" element={<Messages />} />
      <Route path="messages/:userId" element={<ChatBox />} />
      <Route path="connections" element={<Connections />} />
      <Route path="discover" element={<Discover />} />
      <Route path="profile" element={<Profile />} />
      <Route path="profile/:profileId" element={<Profile />} />
      <Route path="create-post" element={<CreatePost />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
