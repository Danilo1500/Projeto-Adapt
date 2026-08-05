import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import Loading from '../components/LoadingWhite'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import moment from 'moment'
import ProfileModal from '../components/ProfileModal'
import { useAuth } from '@clerk/clerk-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Download, FileText } from 'lucide-react'

const Profile = () => {

  const currentUser = useSelector((state)=>state.user.value)

  const {getToken, isLoaded, isSignedIn} = useAuth()
  const {profileId} = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)
  const isOwnerProfile = currentUser?._id === user?._id
  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId))
  }

  const getAuthHeaders = useCallback(async (refresh = false) => {
    if (!isLoaded || !isSignedIn) {
      throw new Error('Sua sessao ainda nao esta pronta. Tente novamente em instantes.')
    }

    const token = await getToken(refresh ? { skipCache: true } : undefined)
    if (!token) {
      throw new Error('Nao foi possivel validar sua sessao. Recarregue a pagina e tente novamente.')
    }

    return { Authorization: `Bearer ${token}` }
  }, [getToken, isLoaded, isSignedIn])

  const requestWithAuth = useCallback(async (request) => {
    try {
      return await request(await getAuthHeaders())
    } catch (error) {
      if (error?.response?.status === 401) {
        return request(await getAuthHeaders(true))
      }

      throw error
    }
  }, [getAuthHeaders])

  const fetchUser = useCallback(async (profileId) => {
    try {
      const { data } = await requestWithAuth((headers) =>
        api.post(`/api/user/profiles`, {profileId}, { headers })
      )
      if(data.success){
        setUser(data.profile)
        setPosts(data.posts)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }, [requestWithAuth])

  useEffect(()=>{
    if (!isLoaded || !isSignedIn) return

    if(profileId){
      fetchUser(profileId)
    }else if(currentUser?._id){
      fetchUser(currentUser._id)
    }
  }, [profileId, currentUser?._id, fetchUser, isLoaded, isSignedIn])

  useEffect(() => {
    if (!profileId && currentUser?._id) {
      setUser(currentUser)
    }
  }, [profileId, currentUser])

  const portfolio = user?.portfolio || {}
  const portfolioSections = [
    { title: 'Linguagens', items: portfolio.languages || [] },
    { title: 'Bibliotecas', items: portfolio.libraries || [] },
    { title: 'Frameworks', items: portfolio.frameworks || [] },
  ]
  const hasPortfolioItems = portfolioSections.some((section) => section.items.length > 0)

  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6 no-scrollbar'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {user.cover_photo && <img src={user.cover_photo} alt='' className='w-full h-full object-cover' />}
          </div>
          {/* User Info */}
          <UserProfileInfo  user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>

        {/* Tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {["posts","media","portfolio","likes"].map((tab)=>(
              <button onClick={()=> setActiveTab(tab)} key={tab} className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                {tab === 'portfolio' ? 'Portfolio' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Posts */}
          {activeTab === 'posts' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {posts.map((post)=> (
                <PostCard
                  key={post._id}
                  post={post}
                  showDelete={isOwnerProfile}
                  onDeleted={handlePostDeleted}
                />
              ))}
            </div>
          )}

          {/* Media */}
          {activeTab === 'media' && (
            <div className='flex flex-wrap mt-6 max-w-6xl'>
              {
                posts.filter((post)=>post.image_urls.length > 0).map((post)=> (
                  <>
                  {post.image_urls.map((image, index)=> (
                    <Link target='_blank' to={image} key={index} className='relative group'>
                    <img src={image} key={index} className='w-64 aspect-video object-cover' alt="" />
                    <p className='absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300'>Posted {moment(post.createAt).fromNow()}</p>
                    </Link> 
                  ))}
                  </>
                ))
              }
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className='mt-6 rounded-2xl bg-white p-6 shadow'>
              <div className='mb-5 flex items-start justify-between gap-4'>
                <div>
                  <h2 className='text-xl font-semibold text-gray-900'>Portfolio tecnico</h2>
                  <p className='text-sm text-gray-500'>Competencias, ferramentas e curriculo do perfil.</p>
                </div>

                {portfolio.resume?.url && (
                  <a
                    href={portfolio.resume.url}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition'
                  >
                    <Download className='h-4 w-4' />
                    Curriculo
                  </a>
                )}
              </div>

              <div className='grid gap-4 md:grid-cols-3'>
                {portfolioSections.map((section) => (
                  <div key={section.title} className='rounded-xl border border-gray-100 p-4'>
                    <h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500'>{section.title}</h3>
                    {section.items.length > 0 ? (
                      <div className='flex flex-wrap gap-2'>
                        {section.items.map((item, index) => (
                          <span key={`${section.title}-${item}-${index}`} className='rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700'>
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className='text-sm text-gray-400'>Nada informado.</p>
                    )}
                  </div>
                ))}
              </div>

              {!hasPortfolioItems && !portfolio.resume?.url && (
                <div className='mt-5 flex items-center gap-3 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500'>
                  <FileText className='h-5 w-5 text-gray-400' />
                  Nenhuma informacao de portfolio cadastrada ainda.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      {/* Edit Profile Modal */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit}/>}
    </div>
  ) : (<Loading />)
}

export default Profile
