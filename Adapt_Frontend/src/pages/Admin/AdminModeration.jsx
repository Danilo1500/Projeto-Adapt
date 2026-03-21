import React, { useEffect, useState } from "react";
import moment from "moment";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

const AdminModeration = () => {
  const { getToken } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const token = await getToken();
    const { data } = await api.get("/api/admin/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!data.success) throw new Error(data.message || "Erro ao buscar posts");
    setPosts(data.posts || []);
  };

  const fetchStories = async () => {
    const token = await getToken();
    const { data } = await api.get("/api/admin/stories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!data.success) throw new Error(data.message || "Erro ao buscar stories");
    setStories(data.stories || []);
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPosts(), fetchStories()]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/admin/post/delete",
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Post removido");
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/admin/story/delete",
        { storyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Story removido");
      setStories((prev) => prev.filter((story) => story._id !== storyId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Moderação
          </h1>
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>
            Monitore e gerencie posts e stories publicados.
          </p>
        </div>

        <div className={`inline-flex items-center gap-2 rounded-lg p-1 ${isDark ? "bg-slate-800" : "bg-white"} shadow`}>
          {["posts", "stories"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : isDark
                  ? "text-slate-300 hover:text-slate-100 hover:bg-slate-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab === "posts" ? "Posts" : "Stories"}
            </button>
          ))}
        </div>

        {loading && (
          <div className={`mt-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>Carregando...</div>
        )}

        {!loading && activeTab === "posts" && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {posts.length === 0 && (
              <div className={isDark ? "text-slate-400" : "text-gray-500"}>Sem posts.</div>
            )}
            {posts.map((post) => (
              <div
                key={post._id}
                className={`rounded-lg border p-4 shadow-sm ${
                  isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={post.user?.profile_picture || "https://placehold.co/48x48"}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className={isDark ? "text-slate-100 font-medium" : "text-slate-900 font-medium"}>
                      {post.user?.full_name || "Usuário"}
                    </p>
                    <p className={isDark ? "text-slate-400 text-xs" : "text-gray-500 text-xs"}>
                      {moment(post.createdAt).fromNow()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-xs px-3 py-1 rounded bg-rose-500 text-white hover:bg-rose-600"
                  >
                    Remover
                  </button>
                </div>
                {post.content && (
                  <p className={`mt-3 text-sm ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                    {post.content}
                  </p>
                )}
                {Array.isArray(post.image_urls) && post.image_urls.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {post.image_urls.slice(0, 3).map((url, idx) => (
                      <img
                        key={`${post._id}-img-${idx}`}
                        src={url}
                        alt=""
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    ))}
                    {post.image_urls.length > 3 && (
                      <span className={isDark ? "text-slate-400 text-xs" : "text-gray-500 text-xs"}>
                        +{post.image_urls.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === "stories" && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {stories.length === 0 && (
              <div className={isDark ? "text-slate-400" : "text-gray-500"}>Sem stories.</div>
            )}
            {stories.map((story) => (
              <div
                key={story._id}
                className={`rounded-lg border p-4 shadow-sm ${
                  isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={story.user?.profile_picture || "https://placehold.co/48x48"}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className={isDark ? "text-slate-100 font-medium" : "text-slate-900 font-medium"}>
                      {story.user?.full_name || "Usuário"}
                    </p>
                    <p className={isDark ? "text-slate-400 text-xs" : "text-gray-500 text-xs"}>
                      {moment(story.createdAt).fromNow()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteStory(story._id)}
                    className="text-xs px-3 py-1 rounded bg-rose-500 text-white hover:bg-rose-600"
                  >
                    Remover
                  </button>
                </div>

                {story.media_type === "image" && story.media_url && (
                  <img src={story.media_url} alt="" className="mt-3 h-32 rounded-md object-cover" />
                )}
                {story.media_type === "video" && story.media_url && (
                  <video src={story.media_url} className="mt-3 h-32 rounded-md object-cover" controls />
                )}
                {story.media_type === "text" && story.content && (
                  <p className={`mt-3 text-sm ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                    {story.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModeration;
