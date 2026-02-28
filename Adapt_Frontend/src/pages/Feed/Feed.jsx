import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Loading from '../components/LoadingWhite'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'
import { useAuth } from '@clerk/clerk-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const Feed = () => {

  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)

  const { getToken, isLoaded } = useAuth()

  useEffect(() => {
    console.log('useEffect executed');
    console.log('isLoaded:', isLoaded);
    if (isLoaded) {
      console.log('isLoaded is true, calling fetchFeeds');
      fetchFeeds();
    } else {
      console.log('isLoaded is false, not calling fetchFeeds');
    }
  }, [isLoaded])

  const fetchFeeds = async () => {
    try {
      console.log('fetchFeeds called');
      setLoading(true);
      const token = await getToken()
      console.log('Token:', token)

      if (!token) {
        console.log('No token found')
        toast.error('Usuário não autenticado')
        return
      }

      const { data } = await api.get(
        '/api/post/feed',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log('API Response:', data)

      if (data.success) {
        console.log('Data fetched successfully:', data.posts)
        setFeeds(data.posts)
      } else {
        console.log('API returned an error:', data.message)
        toast.error(data.message)
      }

    } catch (error) {
      console.error('API Error:', error)
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
      console.log('Loading state set to false')
    }
  }

  if (loading) return <Loading />

  return (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>

      {/* Stories + Feed */}
      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {feeds.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
          <img
            src={assets.sponsored_img}
            className='w-75 h-50 rounded-md'
            alt="Sponsored"
          />
          <p className='text-slate-600'>Email marketing</p>
          <p className='text-slate-400'>
            Supercharge your marketing with a powerful, easy-to-use platform built for results.
          </p>
        </div>

        <RecentMessages />
      </div>

    </div>
  )
}

export default Feed