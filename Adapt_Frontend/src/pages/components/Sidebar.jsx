import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { assets } from '../assets/assets'
import { useNavigate, Link } from 'react-router-dom';
import MenuItems from './MenuItems';
import { CirclePlus, LogOut, Briefcase, Building2, Settings, Sun, Moon } from 'lucide-react';
import { UserButton, useClerk } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value)
  const { signOut } = useClerk();
  const [configOpen, setConfigOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <div
      className={`h-screen border-0 border-gray-200 flex flex-col justify-between relative 
      max-sm:absolute top-0 bottom-0 z-20 
      ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} 
      transition-all duration-300 ease-in-out
      ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}
    >
      {/* Botão fixo de Configuração */}
      <button
        type='button'
        onClick={() => setConfigOpen((prev) => !prev)}
        className={`absolute top-3 right-3 z-30 size-9 rounded-md flex items-center justify-center transition 
        ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white text-gray-600 hover:bg-gray-50 shadow'}`}
        aria-label='Abrir configurações'
      >
        <Settings className='w-5 h-5' />
      </button>

      {/* Janela de Configuração (fora da sidebar) */}
      {configOpen &&
        createPortal(
          <div className='fixed inset-0 z-50'>
            <button
              type='button'
              className='absolute inset-0 bg-black/20'
              onClick={() => setConfigOpen(false)}
              aria-label='Fechar configurações'
            />
            <div
              className={`absolute top-4 right-4 w-72 rounded-lg border p-4 shadow-xl 
              ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-gray-200 bg-white text-gray-900'}`}
            >
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-semibold'>Configurações</h3>
                <button
                  type='button'
                  onClick={() => setConfigOpen(false)}
                  className={`text-xs px-2 py-1 rounded ${
                    isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Fechar
                </button>
              </div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>
                Temas
              </p>
              <div className='mt-2 flex gap-2'>
                <button
                  type='button'
                  onClick={() => setTheme('light')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm flex items-center justify-center gap-2 border transition 
                  ${!isDark ? 'bg-gray-100 border-gray-300 text-gray-800' : 'border-slate-700 text-slate-200 hover:bg-slate-700'}`}
                >
                  <Sun className='w-4 h-4' />
                  Claro
                </button>
                <button
                  type='button'
                  onClick={() => setTheme('dark')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm flex items-center justify-center gap-2 border transition 
                  ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Moon className='w-4 h-4' />
                  Escuro
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* --- Topo da Sidebar --- */}
      <div className='w-full'>
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          className='w-29 p-2 ml-7 my-2 cursor-pointer'
          alt="Logo"
        />
        <hr className={`${isDark ? 'border-slate-700' : 'border-gray-300'} mb-8`} />

        {/* Itens do Menu */}
        <MenuItems setSidebarOpen={setSidebarOpen} theme={theme} />

        {/* Bot�o "Criar" com submenu */}
        <div className='mt-6 mx-6'>
          <button
            type='button'
            onClick={() => setCreateOpen((prev) => !prev)}
            className='w-full flex items-center justify-center gap-2 py-2.5 rounded-lg 
            bg-gradient-to-r from-indigo-500 to-purple-600 
            hover:from-indigo-700 hover:to-purple-800 
            active:scale-95 transition text-white cursor-pointer'
          >
            <CirclePlus className='w-5 h-5' />
            Criar
          </button>

          {createOpen && (
            <div
              className={`mt-3 rounded-lg p-2 space-y-2 border ${
                isDark ? 'border-slate-700 bg-slate-800' : 'border-purple-200 bg-white'
              }`}
            >
              <Link
                to='/create-post'
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  isDark ? 'text-slate-100 hover:bg-slate-700' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <CirclePlus className='w-4 h-4' />
                Create Post
              </Link>
              <Link
                to='/job-creation'
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  isDark ? 'text-slate-100 hover:bg-slate-700' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Briefcase className='w-4 h-4' />
                Criar Vaga
              </Link>
              <Link
                to='/empresa'
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  isDark ? 'text-slate-100 hover:bg-slate-700' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Building2 className='w-4 h-4' />
                Criar Empresa
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* --- Rodap� da Sidebar (usu�rio + logout) --- */}
      <div className={`w-full border-t p-4 px-7 flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className='flex gap-2 items-center cursor-pointer'>
          <UserButton />
          <div>
            <h1 className='text-sm font-medium'>{user.full_name}</h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>@{user.username}</p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className={`w-4.5 transition cursor-pointer ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-700'}`}
        />
      </div>
    </div>
  )
}

export default Sidebar;
