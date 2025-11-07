import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import Loading from '../components/LoadingWhite'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import moment from 'moment'
import ProfileModal from '../components/ProfileModal'
import { Code2, Layers, Award, FileText, ExternalLink } from 'lucide-react'

const Profile = () => {
  const {profileId} = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async () => {
    // para demo usamos dummy; troque pela chamada real ao backend
    setUser(dummyUserData)
    setPosts(dummyPostsData)
  }

  useEffect(()=>{
    fetchUser()
  }, [])

  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6 no-scrollbar'>
      <div className='max-w-4xl mx-auto'>
        {/* Profile Card */}
        <div className='bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100'>
          {/* Cover Photo */}
          <div className='h-40 md:h-60 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 relative'>
            {user.cover_photo && <img src={user.cover_photo} alt='' className='w-full h-full object-cover' />}
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
          </div>

          {/* User Info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />

          {/* Skills & Certifications Section */}
          <div className='px-6 pb-6 pt-4 space-y-6'>
            {/* Linguagens */}
            <div className='group'>
              <div className='flex items-center gap-2 mb-3'>
                <div className='p-2 bg-indigo-100 rounded-lg'>
                  <Code2 className='w-4 h-4 text-indigo-600' />
                </div>
                <h3 className='text-gray-900'>Linguagens</h3>
              </div>
              {user.languages && user.languages.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {user.languages.map((lang) => (
                    <span 
                      key={lang} 
                      className='inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border border-indigo-200 hover:shadow-md transition-all duration-200 hover:scale-105'
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              ) : (
                <p className='text-gray-400 italic'>Nenhuma linguagem informada</p>
              )}
            </div>

            {/* Frameworks */}
            <div className='group'>
              <div className='flex items-center gap-2 mb-3'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <Layers className='w-4 h-4 text-purple-600' />
                </div>
                <h3 className='text-gray-900'>Frameworks / Bibliotecas</h3>
              </div>
              {user.frameworks && user.frameworks.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {user.frameworks.map((fw) => (
                    <span 
                      key={fw} 
                      className='inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 hover:shadow-md transition-all duration-200 hover:scale-105'
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className='text-gray-400 italic'>Nenhum framework adicionado</p>
              )}
            </div>

            {/* Certificados */}
            <div className='group'>
              <div className='flex items-center gap-2 mb-3'>
                <div className='p-2 bg-amber-100 rounded-lg'>
                  <Award className='w-4 h-4 text-amber-600' />
                </div>
                <h3 className='text-gray-900'>Certificados</h3>
              </div>

              {user.certificates && user.certificates.length > 0 ? (
                <div className='grid gap-3'>
                  {user.certificates.map((c, i) => (
                    <div 
                      key={i} 
                      className='group/cert flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:border-indigo-200 hover:shadow-lg transition-all duration-200'
                    >
                      <div className='flex items-start gap-3 flex-1 min-w-0'>
                        <div className='p-2 bg-amber-50 rounded-lg flex-shrink-0 mt-0.5'>
                          <FileText className='w-4 h-4 text-amber-600' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='text-gray-900 truncate pr-2'>{c.title}</div>
                          <div className='text-gray-500 mt-1'>
                            {c.issuer} {c.date && `• ${c.date}`}
                          </div>
                          {c.file && (
                            <div className='text-xs text-gray-400 truncate mt-1 max-w-full'>
                              {c.file.name ?? c.file}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='flex-shrink-0 ml-3'>
                        {c.file && c.file.url ? (
                          <a 
                            href={c.file.url} 
                            target='_blank' 
                            rel='noreferrer' 
                            className='flex items-center gap-1.5 px-4 py-2 border-2 border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 group-hover/cert:shadow-md'
                          >
                            <span className='text-sm'>Ver</span>
                            <ExternalLink className='w-3.5 h-3.5' />
                          </a>
                        ) : c.file && typeof c.file === 'string' ? (
                          <Link 
                            to={c.file} 
                            target='_blank' 
                            className='flex items-center gap-1.5 px-4 py-2 border-2 border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 group-hover/cert:shadow-md'
                          >
                            <span className='text-sm'>Abrir</span>
                            <ExternalLink className='w-3.5 h-3.5' />
                          </Link>
                        ) : (
                          <span className='text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg'>Sem arquivo</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-400 italic'>Nenhum certificado adicionado</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='mt-8'>
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-1.5 flex max-w-md mx-auto border border-gray-100'>
            {["posts","media","likes"].map((tab)=>(
              <button 
                onClick={()=> setActiveTab(tab)} 
                key={tab} 
                className={`flex-1 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === tab 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Posts */}
          {activeTab === 'posts' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {posts.length > 0 ? (
                posts.map((post)=> <PostCard key={post._id} post={post}/>)
              ) : (
                <div className='bg-white rounded-2xl shadow-md p-12 text-center max-w-md w-full border border-gray-100'>
                  <div className='text-gray-400 mb-2'>Nenhum post ainda</div>
                  <p className='text-gray-500'>Seja o primeiro a compartilhar algo!</p>
                </div>
              )}
            </div>
          )}

          {/* Media */}
          {activeTab === 'media' && (
            <div className='mt-6'>
              {posts.filter((post)=>post.image_urls.length > 0).length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {posts.filter((post)=>post.image_urls.length > 0).map((post)=> (
                    <React.Fragment key={post._id}>
                      {post.image_urls.map((image, index)=> (
                        <Link 
                          target='_blank' 
                          to={image} 
                          key={index} 
                          className='relative group overflow-hidden rounded-2xl aspect-video shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100'
                        >
                          <img 
                            src={image} 
                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' 
                            alt="" 
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                            <p className='absolute bottom-3 left-3 right-3 text-white backdrop-blur-sm bg-black/20 rounded-lg px-3 py-2'>
                              Posted {moment(post.createAt).fromNow()}
                            </p>
                          </div>
                        </Link> 
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className='bg-white rounded-2xl shadow-md p-12 text-center max-w-md mx-auto border border-gray-100'>
                  <div className='text-gray-400 mb-2'>Nenhuma mídia ainda</div>
                  <p className='text-gray-500'>Compartilhe fotos e vídeos!</p>
                </div>
              )}
            </div>
          )}

          {/* Likes */}
          {activeTab === 'likes' && (
            <div className='mt-6'>
              <div className='bg-white rounded-2xl shadow-md p-12 text-center max-w-md mx-auto border border-gray-100'>
                <div className='text-gray-400 mb-2'>Seção em desenvolvimento</div>
                <p className='text-gray-500'>Posts curtidos aparecerão aqui</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}

    </div>
  ) : (<Loading />)
}

export default Profile
