import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Shield } from 'lucide-react'

const MenuItems = ({setSidebarOpen, theme = 'light'}) => {
  const currentUser = useSelector((state) => state.user.value)
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
  const isAdmin = !!currentUser?.email && adminEmails.includes(currentUser.email)
  const isDark = theme === 'dark';
  return (
    <div className={`px-6 space-y-1 font-medium ${isDark ? 'text-slate-200' : 'text-gray-600'}`}>
        {
            menuItemsData.map(({to, label, Icon}) =>(
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setSidebarOpen(false)}
                  className={({isActive}) => `px-3.5 py-2 flex items-center rounded-md gap-3 rounded-x1 ${
                    isActive
                      ? `${isDark ? 'bg-slate-800 text-slate-100' : 'bg-indigo-50 text-indigo-700'}`
                      : `${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`
                  }`}
                >
                    <Icon className="w-5 h-5"/>
                    {label}
                </NavLink>
            ))
        }
        {isAdmin && (
          <NavLink
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className={({isActive})=> `px-3.5 py-2 flex items-center rounded-md gap-3 rounded-x1 ${
              isActive
                ? `${isDark ? 'bg-slate-800 text-slate-100' : 'bg-indigo-50 text-indigo-700'}`
                : `${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`
            }`}
          >
            <Shield className="w-5 h-5"/>
            Admin
          </NavLink>
        )}
    </div>
  )
}

export default MenuItems
