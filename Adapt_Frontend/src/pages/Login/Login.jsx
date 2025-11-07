import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import {
  SignIn,
  SignUp,
  useUser,
  useOrganizationList,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  const { user } = useUser();
  const { createOrganization, setActive } = useOrganizationList();

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden">
      {/* Fundo */}
      <img
        src={assets.bgImage}
        alt=""
        className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
      />

      {/* Lado esquerdo */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-10">
        {/* Logo */}
        <button
          className="cursor-pointer mb-10 md:mb-16"
          onClick={() => navigate("/home")}
        >
          <img
            src={assets.logo}
            alt="logo"
            className="h-8 md:h-10 object-contain"
          />
        </button>

        {/* Texto */}
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={assets.group_users}
              alt=""
              className="h-8 sm:h-9 md:h-10"
            />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p className="text-sm text-indigo-950 opacity-80">
                Used by 12k+ developers
              </p>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-indigo-950 leading-tight">
            More than just friends, truly connect
          </h1>
          <p className="text-lg md:text-2xl text-indigo-900 mt-3 max-w-md">
            Connect with a global community on Adapt
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Abas */}
        <div className="flex mb-6 bg-white/80 backdrop-blur-md rounded-2xl p-1 shadow-md">
          <button
            className={`px-6 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              tab === "login"
                ? "bg-indigo-700 text-white"
                : "text-indigo-800 hover:text-indigo-900"
            }`}
            onClick={() => setTab("login")}
          >
            Entrar
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              tab === "register"
                ? "bg-indigo-700 text-white"
                : "text-indigo-800 hover:text-indigo-900"
            }`}
            onClick={() => setTab("register")}
          >
            Cadastrar
          </button>
        </div>

        {/* Formulário animado */}
        <div className="w-full max-w-sm bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <SignIn
                  appearance={{
                    elements: {
                      card: "shadow-none bg-transparent",
                      footer: "hidden",
                      footerAction: "hidden",
                    },
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <SignUp
                  appearance={{
                    elements: {
                      card: "shadow-none bg-transparent",
                      footer: "hidden",
                      footerAction: "hidden",
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Ocultar links padrão do Clerk */}
      <style>{`
        .cl-footer, .cl-footerAction, .cl-formFieldAction, .cl-auth__footer,
        .cl-auth-footer, .cl-signUp-start > div > a, .cl-signIn-start > div > a,
        [data-testid*="cl-footer"], .cl-powered-by, .cl-powered-by-cta {
          display: none !important;
        }

        a[href*="/sign-up"], a[href*="/sign-in"] {
          display: none !important;
        }

        body {
          overflow: hidden !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
