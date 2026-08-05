import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { ImageIcon, SendHorizonal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import api from '../../api/axios'
import { addMessage, fetchMessages, resetMessages } from '../../features/messages/messagesSlice'
import toast from 'react-hot-toast'
import { getAuthHeaders, requestWithAuth } from '../../utils/authRequest'

const ChatBox = () => {

  const {messages} = useSelector((state)=>state.messages)
  const { userId } = useParams()
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)
  const messagesEndRef = useRef(null)

  const connections = useSelector((state) => state.connections.connections)

  const fetchUserMessages = async () => {
    try {
      const headers = await getAuthHeaders(getToken, true)
      const token = headers.Authorization.replace('Bearer ', '')
      dispatch(fetchMessages({token, userId}))
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  const sendMessage =  async () => {
    try {
      if(!text && !image) return

      const formData = new FormData()
      formData.append('to_user_id', userId)
      formData.append('text', text);
      image && formData.append('image', image);

      const { data } = await requestWithAuth(
        getToken,
        (headers) => api.post('/api/message/send', formData, { headers })
      )
      if(data.success) {
        setText('')
        setImage(null)
        dispatch(addMessage(data.message))
      }else{
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchUserMessages()

    return ()=>{
      dispatch(resetMessages())
    }
  },[userId])

  useEffect(()=>{
    if(connections.length > 0){
      const user = connections.find(connection => connection._id === userId)
      setUser(user)
    }
  },[connections, userId])

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  },[messages])

  return user && (
    <div className='flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-50'>
      <div className='flex shrink-0 items-center gap-3 border-b border-gray-300 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-3 pr-16 sm:px-6 sm:pr-6 md:px-10 xl:pl-20'>
        <img src={user.profile_picture} alt="" className='size-9 shrink-0 rounded-full object-cover'/>
        <div className='min-w-0'>
          <p className='truncate font-medium text-slate-800'>{user.full_name}</p>
          <p className='-mt-1 truncate text-sm text-gray-500'>@{user.username}</p>
        </div>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 md:px-10'>
        <div className='mx-auto w-full max-w-4xl space-y-3 sm:space-y-4'>
          {
            messages.toSorted((a, b)=> new Date(a.createdAt) - new Date(b.createdAt)).map((message, index)=>(
              <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-[82%] overflow-hidden rounded-lg bg-white p-2 text-sm text-slate-700 shadow sm:max-w-sm ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                  {
                  message.message_type === 'image' && (
                    <img
                      src={message.media_url}
                      className='mb-1 h-auto max-h-64 w-full rounded-lg object-contain'
                      alt=""
                      loading="lazy"
                    />
                  )
                  }
                  <p className='break-words'>{message.text}</p>
                </div>

              </div>
            ))
          }
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className='shrink-0 border-t border-gray-200 bg-slate-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 sm:px-6 sm:pb-4'>
        <div className='mx-auto flex w-full max-w-xl items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow sm:gap-3 sm:px-4'>
          <input
            type="text"
            className='min-w-0 flex-1 bg-transparent text-base text-slate-700 outline-none'
            placeholder='Type a message...'
          onKeyDown={e=>e.key === 'Enter' && sendMessage()} onChange={(e)=>setText(e.target.value)} value={text} />

          <label htmlFor="image" className='shrink-0'>
            {
              image 
              ? <img src={URL.createObjectURL(image)} alt="" className='h-8 w-8 object-cover rounded' /> 
              : <ImageIcon className='size-7 text-gray-400 cursor-pointer'/>
            }
            <input type="file" id='image' accept='image/*' hidden onChange={(e)=>setImage(e.target.files[0])} />
          </label>

          <button onClick={sendMessage} className='shrink-0 cursor-pointer rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-2 text-white hover:from-indigo-700 hover:to-purple-800 active:scale-95'>
            <SendHorizonal size={18}/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
