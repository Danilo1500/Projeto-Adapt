import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const CreatePost = () => {

  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const user = useSelector((state)=>state.user.value)

  const {getToken} = useAuth()

  const handleSubmit = async () => {
    if(!images.length && !content){
      return toast.error('Please add at least one image or text')
    }
    setLoading(true)

    const postType = images.length && content ? 'text_with_image' : images.length ? 'image' : 'text'

    try {
      const formData = new FormData();
      formData.append('content', content)
      formData.append('post_type', postType)
      images.map((image)=>{
        formData.append('images', image)
      })

      const { data } = await api.post('/api/post/add', formData, {headers: {Authorization: `Bearer ${await getToken()}`}})

      if(data.success){
        navigate('/')
      }else{
        throw new Error(data.message)
      }
    } catch (error) {
      throw new Error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Create Post</h1>
          <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>Share your thoughts with world</p>
        </div>

        {/* Form */}
        <div className={`max-w-xl p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
          {/* Header */}
          <div className='flex items-center gap-3'>
            <img src={user.profile_picture} alt="" className='w-12 h-12 rounded-full shadow'/>
            <div>
              <h2 className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{user.full_name}</h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>@{user.username}</p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            className={`w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400 ${
              isDark ? 'bg-slate-800 text-slate-100 placeholder:text-slate-500' : 'bg-white text-slate-900'
            }`}
            placeholder="What's happening?"
            onChange={(e)=>setContent(e.target.value)}
            vlaue={content}
          />

          {/* Images */}
          {
            images.length > 0 && <div className='flex flex-wrap gap-2 mt-4'>
              {images.map((image, i)=>(
                <div key={i} className='relative group'>
                  <img src={URL.createObjectURL(image)} className='h-20 rounded-md' alt="" />
                  <div onClick={()=> setImages(images.filter((_, index)=> index !== i))} className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'>
                    <X className='w-6 h-6 text-white'/>
                  </div>
                </div>
              ))}
            </div>
          }

          {/* Bottom Bar */}
          <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
            <label htmlFor="images" className={`flex items-center gap-2 text-sm transition cursor-pointer ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <Image className='size-6' />
            </label>
            
            <input type="file" id="images" accept='image/*' hidden multiple onChange={(e)=>setImages([...images, ...e.target.files])}/>

            <button disabled={loading} onClick={()=> toast.promise(
              handleSubmit(),
              {
                loading: 'uploading ...',
                success: <p>Post Added</p>,
                error: <p>Post Not Added</p>,
              }
            )} className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer'>
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
