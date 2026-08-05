import { Routes, Route, useLocation } from "react-router-dom";
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
import toast, { Toaster } from "react-hot-toast";
import JobCreation from "./pages/jobCreation/JobCreation";
import Empresa from "./pages/Empresa/Empresa";
import CompanyProfile from "./pages/CompanyProfile/CompanyProfile";
import AdminModeration from "./pages/Admin/AdminModeration";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import { fetchConnections } from "./features/connections/connectionsSlice";
import { addMessage } from "./features/messages/messagesSlice";
import Notification from "./pages/components/Notification";
import Loading from "./pages/components/Loading";


function App() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken } = useAuth();
  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const token = await getToken({ skipCache: true });
        if (!token) return;
        await dispatch(fetchUser(token)).unwrap();
        dispatch(fetchConnections(token));
      } catch (error) {
        console.warn("User bootstrap failed", error);
      }
    }
    fetchData()
    
  }, [user, getToken, dispatch]);

  useEffect(()=>{
    pathnameRef.current = pathname
  },[pathname])

  useEffect(()=>{
    if(user){
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id);

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (pathnameRef.current === ('/messages/' + message.from_user_id._id)) {
          dispatch(addMessage(message));
        } else {
          toast.custom((t) => (
            <Notification t={t} message={message} />
          ), { position: "bottom-right" });
        }
      };

      eventSource.onerror = () => {
        console.warn("SSE connection interrupted. The browser will retry automatically.");
      };

      return () => {
        eventSource.close();
      };
    }
  },[user, dispatch])

  if (!isUserLoaded) {
    return <Loading />
  }

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
          <Route path="company/:companyId" element={<CompanyProfile />} />
          <Route path="admin" element={<AdminModeration />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

