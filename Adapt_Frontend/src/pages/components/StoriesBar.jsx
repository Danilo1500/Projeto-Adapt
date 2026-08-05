import React, { useEffect, useState, useRef } from 'react'
import { dummyStoriesData } from '../assets/assets'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal'
import StoryViwer from './StoryViwer'
import { useAuth } from '@clerk/clerk-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import { requestWithAuth } from '../../utils/authRequest'

const StoriesBar = () => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const {getToken, isLoaded, isSignedIn} = useAuth()

    const [stories, setStories] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [viewStory, setViewStory] = useState(null)

    const scrollRef = useRef(null)

    const fetchStories = async () => {
        try {
            const { data } = await requestWithAuth(
                getToken,
                (headers) => api.get('/api/story/get', { headers })
            )
            if(data.success){
                setStories(data.stories)
            }else{
                toast(data.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return
        fetchStories()
    }, [isLoaded, isSignedIn])

    // transforma scroll vertical em horizontal
    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        const onWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault()
                el.scrollLeft += e.deltaY
            }
        }

        el.addEventListener("wheel", onWheel, { passive: false })
        return () => el.removeEventListener("wheel", onWheel)
    }, [])

    return (
        <div
            ref={scrollRef}
            className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl overflow-x-auto overflow-y-hidden px-4 flex gap-4 no-scrollbar'
        >
            {/* Add Story card */}
            <div 
                onClick={() => setShowModal(true)} 
                className={`rounded-lg shadow-sm  min-w-[120px] max-w-[120px] min-h-[180px] max-h-[180px] aspect-[9/16] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed ${
                    isDark
                        ? 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                        : 'border-indigo-300 bg-gradient-to-b from-indigo-50 to-white'
                }`}
            >
                <div className='h-full flex flex-col items-center justify-center p-4'>
                    <div className='size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3'>
                        <Plus className='w-5 h-5 text-white' />
                    </div>
                    <p className={`text-sm font-medium text-center ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        Create Story
                    </p>
                </div>
            </div>

            {/* Story cards */}
            {stories.map((story, index) => (
                <div 
                    onClick={() => setViewStory(story)} 
                    key={index} 
                    className='relative rounded-lg shadow min-w-[120px] max-w-[120px] min-h-[180px] max-h-[180px] aspect-[9/16] cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95'
                >
                    <img 
                        src={story.user.profile_picture} 
                        alt="" 
                        className={`absolute top-3 left-3 z-10 w-10 h-10 rounded-full ring shadow ${
                            isDark ? 'ring-slate-700' : 'ring-gray-100'
                        }`} 
                    />
                    <p className='absolute top-16 left-3 text-white/60 text-sm truncate max-w-24'>{story.content}</p>
                    <p className='text-white absolute bottom-1 right-2 z-10 text-xs'>{moment(story.createdAt).fromNow()}</p>

                    {story.media_type !== 'text' && (
                        <div className='absolute inset-0 z-1 rounded-lg bg-black overflow-hidden'>
                            {story.media_type === "image" ? (
                                <img 
                                    src={story.media_url} 
                                    alt="" 
                                    className='h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80'
                                />
                            ) : (
                                <video 
                                    src={story.media_url} 
                                    className='h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80' 
                                />
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Story Modal */}
            {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />}
            {/* View Story Modal */}
            {viewStory && <StoryViwer viewStory={viewStory} setViewStory={setViewStory} />}
        </div>
    )
}

export default StoriesBar
