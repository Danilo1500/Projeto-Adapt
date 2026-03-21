import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const RecentMessages = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/user/recent-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && Array.isArray(data.messages)) {
        // Agrupa por remetente -> mantém somente a mensagem mais recente de cada remetente
        const groupedMessages = data.messages.reduce((acc, message) => {
          if (!message || !message.from_user_id) return acc;

          const senderId = message.from_user_id._id || message.from_user_id;
          if (
            !acc[senderId] ||
            new Date(message.createdAt) > new Date(acc[senderId].createdAt)
          ) {
            acc[senderId] = message;
          }
          return acc;
        }, {});

        const sortedMessages = Object.values(groupedMessages).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setMessages(sortedMessages);
      } else {
        toast.error(data.message || "Erro ao buscar mensagens");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchRecentMessages();
    const intervalId = setInterval(fetchRecentMessages, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <div
      className={`max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs ${
        isDark ? "bg-slate-800 text-slate-100 border border-slate-700" : "bg-white text-slate-800"
      }`}
    >
      <h3 className={`font-semibold mb-4 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
        Recent Messages
      </h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => {
          const from = message.from_user_id || {};
          const senderId = from._id || from;
          return (
            <Link
              to={`/messages/${senderId}`}
              key={index}
              className={`flex items-start gap-2 py-2 ${
                isDark ? "hover:bg-slate-700/60" : "hover:bg-slate-100"
              }`}
            >
              <img src={from.profile_picture || ""} alt="" className="w-8 h-8 rounded-full" />
              <div className="w-full">
                <div className="flex justify-between">
                  <p className={`font-medium ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                    {from.full_name || "Usuário"}
                  </p>
                  <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-400"}`}>
                    {moment(message.createdAt).fromNow()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className={isDark ? "text-slate-400" : "text-gray-500"}>
                    {message.text || "Media"}
                  </p>
                  {!message.seen && (
                    <p className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                      1
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMessages;
