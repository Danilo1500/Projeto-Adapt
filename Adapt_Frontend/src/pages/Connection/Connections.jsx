import React, { useEffect, useState } from 'react'
import { Users, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { fetchConnections } from '../../features/connections/connectionsSlice'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'

const Connections = () => {

  const [currentTab, setCurrentTab] = useState('Followers')
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const navigate = useNavigate()
  const {getToken} = useAuth()
  const dispatch = useDispatch()

  const {connections, pendingConnections, followers, following} = useSelector((state)=>state.connections)

  const dataArray = [
    { label: 'Followers', value: followers, icon: Users },
    { label: 'Following', value: following, icon: UserCheck },
    { label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    { label: 'Connections', value: connections, icon: UserPlus },
  ]

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await api.post('/api/user/unfollow', {id: userId}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){
        toast.success(data.message)
        dispatch(fetchConnections(await getToken()))
      }else{
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const acceptConnection = async (userId) => {
    try {
      const { data } = await api.post('/api/user/accept', {id: userId}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){
        toast.success(data.message)
        dispatch(fetchConnections(await getToken()))
      }else{
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    getToken().then((token)=>{
      dispatch(fetchConnections(token))
    })
  },[])

  return (
    // h-full → ocupa a altura total do container pai
    // overflow-y-auto → ativa rolagem vertical
    // overflow-x-hidden → esconde qualquer rolagem lateral
    <div className={`h-full overflow-y-auto overflow-x-hidden no-scrollbar ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className='max-w-6xl mx-auto p-6 pb-6'>

        {/* Title */}
        <div className='mb-8'>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Connections</h1>
          <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>Manage your network and discover new connections</p>
        </div>

        {/* Counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {dataArray.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center gap-1 border h-20 w-40 shadow rounded-md ${
                isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-gray-200 bg-white'
              }`}
            >
              <b>{item.value.length}</b>
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={`inline-flex flex-wrap items-center border rounded-md p-1 shadow-sm ${
          isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'
        }`}>
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.label)}
              key={tab.label}
              className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                currentTab === tab.label
                  ? `${isDark ? 'bg-slate-700 text-slate-100' : 'bg-white font-medium text-black'}`
                  : `${isDark ? 'text-slate-400 hover:text-slate-100' : 'text-gray-500 hover:text-black'}`
              }`}
            >
              <tab.icon className='w-4 h-4' />
              <span className='ml-1'>{tab.label}</span>
              {tab.count !== undefined && (
                <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Connections List */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {dataArray.find((item) => item.label === currentTab).value.map((user) => (
            <div key={user._id} className={`w-full max-w-88 flex gap-5 p-6 shadow rounded-md ${
              isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}>
              <img
                src={user.profile_picture}
                alt=''
                className='rounded-full w-12 h-12 shadow-md mx-auto'
              />
              <div className='flex-1'>
                <p className={`font-medium ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>{user.full_name}</p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>@{user.username}</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{user.bio.slice(0, 30)}...</p>

                <div className='flex max-sm:flex-col gap-2 mt-4'>
                  <button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'
                  >
                    View Profile
                  </button>

                  {currentTab === 'Following' && (
                    <button onClick={()=> handleUnfollow(user._id)} className={`w-full p-2 text-sm rounded active:scale-95 transition cursor-pointer ${
                      isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' : 'bg-slate-100 hover:bg-slate-200 text-black'
                    }`}>
                      Unfollow
                    </button>
                  )}

                  {currentTab === 'Pending' && (
                    <button onClick={()=>acceptConnection(user._id)} className={`w-full p-2 text-sm rounded active:scale-95 transition cursor-pointer ${
                      isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' : 'bg-slate-100 hover:bg-slate-200 text-black'
                    }`}>
                      Accept
                    </button>
                  )}

                  {currentTab === 'Connections' && (
                    <button
                      onClick={() => navigate(`/messages/${user._id}`)}
                      className={`w-full p-2 text-sm rounded active:scale-95 transition cursor-pointer flex items-center justify-center gap-1 ${
                        isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <MessageSquare className='w-4 h-4' />
                      Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Connections
