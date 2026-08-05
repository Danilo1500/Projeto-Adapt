import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Loading from '../components/Loading';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Layout = () => {
  
  const { value: user, status, error } = useSelector((state)=>state.user)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === 'idle' || status === 'loading') {
    return <Loading />
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50 px-6'>
        <div className='max-w-md w-full bg-white rounded-2xl shadow p-6 text-center'>
          <h1 className='text-lg font-semibold text-slate-900'>Nao foi possivel carregar sua conta</h1>
          <p className='text-sm text-slate-600 mt-2'>
            {error || 'Tente recarregar a pagina para buscar seus dados novamente.'}
          </p>
          <button
            type='button'
            onClick={() => window.location.reload()}
            className='mt-5 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer'
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-[100dvh] w-full overflow-hidden'>
      <div className='shrink-0'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <div className='min-w-0 flex-1 bg-slate-50 overflow-y-auto'>
        <Outlet />
      </div>

      {sidebarOpen ? (
        <X
          className='absolute top-3 right-3 p-2 z-50 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <Menu
          className='absolute top-3 right-3 p-2 z-50 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  );
};

export default Layout;
