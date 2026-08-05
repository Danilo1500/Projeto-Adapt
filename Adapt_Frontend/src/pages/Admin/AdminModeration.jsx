import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { requestWithAuth } from "../../utils/authRequest";

const tabs = [
  { id: "posts", label: "Posts" },
  { id: "stories", label: "Stories" },
  { id: "messages", label: "Mensagens" },
  { id: "jobs", label: "Vagas" },
];

const emptyEdit = { type: null, id: null, values: {} };

const AdminModeration = () => {
  const { getToken } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(emptyEdit);

  const cardClass = `rounded-lg border p-4 shadow-sm ${
    isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
  }`;
  const mutedClass = isDark ? "text-slate-400" : "text-gray-500";
  const bodyTextClass = isDark ? "text-slate-300" : "text-gray-700";

  const messageChats = useMemo(() => {
    const chatMap = new Map();

    messages.forEach((message) => {
      const fromId = message.from_user_id?._id || message.from_user_id || "unknown-from";
      const toId = message.to_user_id?._id || message.to_user_id || "unknown-to";
      const chatKey = [fromId, toId].sort().join(":");

      if (!chatMap.has(chatKey)) {
        chatMap.set(chatKey, {
          key: chatKey,
          participants: [message.from_user_id, message.to_user_id],
          messages: [],
          latestAt: message.createdAt,
        });
      }

      const chat = chatMap.get(chatKey);
      chat.messages.push(message);
      if (new Date(message.createdAt) > new Date(chat.latestAt)) {
        chat.latestAt = message.createdAt;
      }
    });

    return Array.from(chatMap.values())
      .map((chat) => ({
        ...chat,
        messages: chat.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
      }))
      .sort((a, b) => new Date(b.latestAt) - new Date(a.latestAt));
  }, [messages]);

  const authedGet = async (url) => {
    const { data } = await requestWithAuth(getToken, (headers) => api.get(url, { headers }));
    if (!data.success) throw new Error(data.message || "Erro ao carregar dados");
    return data;
  };

  const authedPost = async (url, payload) => {
    const { data } = await requestWithAuth(getToken, (headers) => api.post(url, payload, { headers }));
    if (!data.success) throw new Error(data.message || "Acao nao concluida");
    return data;
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      const [postData, storyData, messageData, jobData] = await Promise.all([
        authedGet("/api/admin/posts"),
        authedGet("/api/admin/stories"),
        authedGet("/api/admin/messages"),
        authedGet("/api/admin/jobs"),
      ]);
      setPosts(postData.posts || []);
      setStories(storyData.stories || []);
      setMessages(messageData.messages || []);
      setJobs(jobData.jobs || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    const confirmed = window.confirm("Tem certeza que deseja apagar este item?");
    if (!confirmed) return;

    const config = {
      posts: { url: "/api/admin/post/delete", key: "postId", setter: setPosts },
      stories: { url: "/api/admin/story/delete", key: "storyId", setter: setStories },
      messages: { url: "/api/admin/message/delete", key: "messageId", setter: setMessages },
      jobs: { url: "/api/admin/job/delete", key: "jobId", setter: setJobs },
    }[type];

    try {
      await authedPost(config.url, { [config.key]: id });
      config.setter((prev) => prev.filter((item) => item._id !== id));
      if (editing.id === id) setEditing(emptyEdit);
      toast.success("Item removido");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startEdit = (type, item) => {
    const values = {
      posts: { content: item.content || "" },
      stories: { content: item.content || "", background_color: item.background_color || "" },
      messages: { text: item.text || "", seen: Boolean(item.seen) },
      jobs: {
        title: item.title || "",
        company: item.company || "",
        location: item.location || "",
        contractType: item.contractType || "",
        experienceLevel: item.experienceLevel || "",
        salaryMin: item.salaryMin || "",
        salaryMax: item.salaryMax || "",
        currency: item.currency || "R$",
        isRemote: Boolean(item.isRemote),
        isUrgent: Boolean(item.isUrgent),
        description: item.description || "",
        requirements: Array.isArray(item.requirements) ? item.requirements.join("\n") : "",
        benefits: Array.isArray(item.benefits) ? item.benefits.join("\n") : "",
        status: item.status || "published",
      },
    }[type];
    setEditing({ type, id: item._id, values });
  };

  const updateEditValue = (field, value) => {
    setEditing((prev) => ({ ...prev, values: { ...prev.values, [field]: value } }));
  };

  const saveEdit = async () => {
    if (!editing.type || !editing.id) return;
    setSaving(true);
    try {
      const config = {
        posts: { url: "/api/admin/post/update", key: "postId", resultKey: "post", setter: setPosts },
        stories: { url: "/api/admin/story/update", key: "storyId", resultKey: "story", setter: setStories },
        messages: { url: "/api/admin/message/update", key: "messageId", resultKey: "message", setter: setMessages },
        jobs: { url: "/api/admin/job/update", key: "jobId", resultKey: "job", setter: setJobs },
      }[editing.type];

      const payload = { [config.key]: editing.id, ...editing.values };
      if (editing.type === "jobs") {
        payload.requirements = editing.values.requirements.split("\n").map((item) => item.trim()).filter(Boolean);
        payload.benefits = editing.values.benefits.split("\n").map((item) => item.trim()).filter(Boolean);
      }

      const data = await authedPost(config.url, payload);
      config.setter((prev) => prev.map((item) => (item._id === editing.id ? data[config.resultKey] : item)));
      setEditing(emptyEdit);
      toast.success("Item atualizado");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const ItemActions = ({ type, item }) => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => startEdit(type, item)}
          className="rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => handleDelete(type, item._id)}
          className="rounded bg-rose-500 px-3 py-1 text-xs text-white hover:bg-rose-600"
        >
          Remover
        </button>
      </div>
  );

  const EditPanel = ({ type, itemId }) => {
    if (editing.type !== type || editing.id !== itemId) return null;
    return (
      <div className={`mt-4 rounded-lg border p-3 ${isDark ? "border-indigo-500/40 bg-slate-900" : "border-indigo-200 bg-indigo-50"}`}>
        <div className="space-y-3">
          {type === "posts" && (
            <textarea
              value={editing.values.content}
              onChange={(e) => updateEditValue("content", e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 outline-none"
            />
          )}

          {type === "stories" && (
            <>
              <textarea
                value={editing.values.content}
                onChange={(e) => updateEditValue("content", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 outline-none"
              />
              <input
                value={editing.values.background_color}
                onChange={(e) => updateEditValue("background_color", e.target.value)}
                placeholder="Cor de fundo"
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 outline-none"
              />
            </>
          )}

          {type === "messages" && (
            <>
              <textarea
                value={editing.values.text}
                onChange={(e) => updateEditValue("text", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 outline-none"
              />
              <label className={`flex items-center gap-2 text-sm ${bodyTextClass}`}>
                <input
                  type="checkbox"
                  checked={editing.values.seen}
                  onChange={(e) => updateEditValue("seen", e.target.checked)}
                />
                Marcada como vista
              </label>
            </>
          )}

          {type === "jobs" && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {["title", "company", "location", "contractType", "experienceLevel", "salaryMin", "salaryMax", "currency"].map((field) => (
                <input
                  key={field}
                  value={editing.values[field]}
                  onChange={(e) => updateEditValue(field, e.target.value)}
                  placeholder={field}
                  className="rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 outline-none"
                />
              ))}
              <select
                value={editing.values.status}
                onChange={(e) => updateEditValue("status", e.target.value)}
                className="rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 outline-none"
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
              <label className={`flex items-center gap-2 text-sm ${bodyTextClass}`}>
                <input type="checkbox" checked={editing.values.isRemote} onChange={(e) => updateEditValue("isRemote", e.target.checked)} />
                Remota
              </label>
              <label className={`flex items-center gap-2 text-sm ${bodyTextClass}`}>
                <input type="checkbox" checked={editing.values.isUrgent} onChange={(e) => updateEditValue("isUrgent", e.target.checked)} />
                Urgente
              </label>
              <textarea
                value={editing.values.description}
                onChange={(e) => updateEditValue("description", e.target.value)}
                placeholder="description"
                rows={4}
                className="rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 outline-none md:col-span-2"
              />
              <textarea
                value={editing.values.requirements}
                onChange={(e) => updateEditValue("requirements", e.target.value)}
                placeholder="requirements, um por linha"
                rows={3}
                className="rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 outline-none"
              />
              <textarea
                value={editing.values.benefits}
                onChange={(e) => updateEditValue("benefits", e.target.value)}
                placeholder="benefits, um por linha"
                rows={3}
                className="rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 outline-none"
              />
            </div>
          )}
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={() => setEditing(emptyEdit)} className="rounded border border-gray-300 px-3 py-1 text-xs">
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveEdit}
            disabled={saving}
            className="rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              Moderacao
            </h1>
            <p className={isDark ? "text-slate-300" : "text-slate-600"}>
              Monitore, edite e remova conteudos publicados.
            </p>
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-2 rounded-lg p-1 ${isDark ? "bg-slate-800" : "bg-white"} shadow`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setEditing(emptyEdit);
              }}
              className={`rounded-md px-4 py-2 text-sm transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <div className={`mt-6 ${bodyTextClass}`}>Carregando...</div>}

        {!loading && activeTab === "posts" && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {posts.length === 0 && <div className={mutedClass}>Sem posts.</div>}
            {posts.map((post) => (
              <div key={post._id} className={cardClass}>
                <div className="flex items-center gap-3">
                  <img src={post.user?.profile_picture || "https://placehold.co/48x48"} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>{post.user?.full_name || "Usuario"}</p>
                    <p className={`text-xs ${mutedClass}`}>{moment(post.createdAt).fromNow()}</p>
                  </div>
                  <ItemActions type="posts" item={post} />
                </div>
                {post.content && <p className={`mt-3 whitespace-pre-wrap text-sm ${bodyTextClass}`}>{post.content}</p>}
                {Array.isArray(post.image_urls) && post.image_urls.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.image_urls.slice(0, 3).map((url, idx) => (
                      <img key={`${post._id}-img-${idx}`} src={url} alt="" className="h-20 w-20 rounded-md object-cover" />
                    ))}
                  </div>
                )}
                <EditPanel type="posts" itemId={post._id} />
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === "stories" && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {stories.length === 0 && <div className={mutedClass}>Sem stories.</div>}
            {stories.map((story) => (
              <div key={story._id} className={cardClass}>
                <div className="flex items-center gap-3">
                  <img src={story.user?.profile_picture || "https://placehold.co/48x48"} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>{story.user?.full_name || "Usuario"}</p>
                    <p className={`text-xs ${mutedClass}`}>{story.media_type} - {moment(story.createdAt).fromNow()}</p>
                  </div>
                  <ItemActions type="stories" item={story} />
                </div>
                {story.media_type === "image" && story.media_url && <img src={story.media_url} alt="" className="mt-3 h-32 rounded-md object-cover" />}
                {story.media_type === "video" && story.media_url && <video src={story.media_url} className="mt-3 h-32 rounded-md object-cover" controls />}
                {story.content && <p className={`mt-3 whitespace-pre-wrap text-sm ${bodyTextClass}`}>{story.content}</p>}
                <EditPanel type="stories" itemId={story._id} />
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === "messages" && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {messages.length === 0 && <div className={mutedClass}>Sem mensagens.</div>}
            {messageChats.map((chat) => {
              const [firstUser, secondUser] = chat.participants;
              const firstName = firstUser?.full_name || firstUser?.username || "Usuario";
              const secondName = secondUser?.full_name || secondUser?.username || "Usuario";

              return (
                <div key={chat.key} className={cardClass}>
                  <div className="mb-4 flex flex-col gap-1 border-b border-gray-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className={`font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                        {firstName} e {secondName}
                      </p>
                      <p className={`text-xs ${mutedClass}`}>
                        {chat.messages.length} mensagens - ultima {moment(chat.latestAt).fromNow()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {chat.messages.map((message) => (
                      <div key={message._id} className={`border-l-2 pl-3 ${isDark ? "border-slate-600" : "border-gray-200"}`}>
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                              {message.from_user_id?.full_name || "Remetente"} para {message.to_user_id?.full_name || "Destinatario"}
                            </p>
                            <p className={`text-xs ${mutedClass}`}>
                              {message.message_type} - {moment(message.createdAt).fromNow()} - {message.seen ? "vista" : "nao vista"}
                            </p>
                          </div>
                          <ItemActions type="messages" item={message} />
                        </div>
                        {message.text && <p className={`mt-2 whitespace-pre-wrap text-sm ${bodyTextClass}`}>{message.text}</p>}
                        {message.media_url && <img src={message.media_url} alt="" className="mt-3 h-32 rounded-md object-cover" />}
                        <EditPanel type="messages" itemId={message._id} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && activeTab === "jobs" && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {jobs.length === 0 && <div className={mutedClass}>Sem vagas.</div>}
            {jobs.map((job) => (
              <div key={job._id} className={cardClass}>
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>{job.title || "Vaga sem titulo"}</p>
                    <p className={`text-xs ${mutedClass}`}>
                      {job.company || "Empresa"} - {job.location || "Local"} - {job.status}
                    </p>
                    <p className={`text-xs ${mutedClass}`}>Criada por {job.user?.full_name || "Usuario"} - {moment(job.createdAt).fromNow()}</p>
                  </div>
                  <ItemActions type="jobs" item={job} />
                </div>
                {job.description && <p className={`mt-3 line-clamp-4 whitespace-pre-wrap text-sm ${bodyTextClass}`}>{job.description}</p>}
                <EditPanel type="jobs" itemId={job._id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModeration;
