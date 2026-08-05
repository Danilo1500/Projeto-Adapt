import React, { useState } from 'react'
import { FileText, Pencil } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../features/user/userSlice';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const ProfileModal = ({setShowEdit}) => {

  const dispatch = useDispatch();
  const {getToken, isLoaded, isSignedIn} = useAuth();

    const user = useSelector((state) => state.user.value)
    const tagsToString = (items) => Array.isArray(items) ? items.join(', ') : ''
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        cover_photo: null,
        resume: null,
        full_name: user.full_name,
        languages: tagsToString(user.portfolio?.languages),
        libraries: tagsToString(user.portfolio?.libraries),
        frameworks: tagsToString(user.portfolio?.frameworks),
    })

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
          if (!isLoaded || !isSignedIn) {
            throw new Error('Sua sessao ainda nao esta pronta. Tente novamente em instantes.')
          }

          const userData = new FormData();
          const {full_name, username, bio, location, profile_picture, cover_photo, resume, languages, libraries, frameworks} = editForm

          userData.append('username', username)
          userData.append('bio', bio)
          userData.append('location', location)
          userData.append('full_name', full_name)
          userData.append('languages', languages)
          userData.append('libraries', libraries)
          userData.append('frameworks', frameworks)
          profile_picture && userData.append('profile', profile_picture)
          cover_photo && userData.append('cover', cover_photo)
          resume && userData.append('resume', resume)

          const token = await getToken({ skipCache: true })
          if (!token) {
            throw new Error('Nao foi possivel validar sua sessao. Recarregue a pagina e tente novamente.')
          }

          await dispatch(updateUser({userData, token})).unwrap()

          setShowEdit(false)
        } catch (error) {
          toast.error(error.message)
        }
    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50'>
        <div className='max-w-2xl sm:py-6 mx-auto'>
            <div className='bg-white rounded-lg shadow p-6'>
                <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>

                <form className='space-y-4' onSubmit={e=> toast.promise(
                  handleSaveProfile(e), {loading: 'Saving...'}
                )}>
                    {/* Profile Picture */}
                    <div className='flex flex-col items-start gap-3'>
                        <label htmlFor="profile_picture" className='block text-sm font-medium text-gray-700 mb-1'>
                            Profile Picture
                            <input hidden type="file" accept='image/*' id='profile_picture' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e)=>setEditForm({...editForm, profile_picture: e.target.files[0]})}/>
                            <div className='group/profile relative'>
                                <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt="" className='w-24 h-24 rounded-full object-cover mt-2'/>

                                <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                                    <Pencil className='w-5 h-5 text-white'/>
                                </div>
                            </div>
                        </label>
                    </div>

                {/* Cover Photo */}
                <div className='flex flex-col items-start gap-3'>
                    <label htmlFor="cover_photo" className='block text-sm font-medium text-gray-700 mb-1'>
                        Cover Photo
                        <input hidden type="file" accept='image/*' id='cover_photo' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e)=>setEditForm({...editForm, cover_photo: e.target.files[0]})}/>
                        <div className='group/cover relative'>
                            <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} alt="" className='w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2' />

                            <div className='absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-lg items-center justify-center'>
                                <Pencil className='w-5 h-5 text-white'/>
                            </div>
                        </div>
                    </label>
                </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Name
                        </label>
                        <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter your full name' onChange={(e)=>setEditForm({...editForm, full_name: e.target.value})} value={editForm.full_name}/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Username
                        </label>
                        <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter a username' onChange={(e)=>setEditForm({...editForm, username: e.target.value})} value={editForm.username}/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Bio
                        </label>
                        <textarea rows={3} className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter a short bio' onChange={(e)=>setEditForm({...editForm, bio: e.target.value})} value={editForm.bio}/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Location
                        </label>
                        <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter your location' onChange={(e)=>setEditForm({...editForm, location: e.target.value})} value={editForm.location}/>
                    </div>

                    <div className='border-t border-gray-100 pt-4'>
                        <h2 className='text-lg font-semibold text-gray-900'>Portfolio</h2>
                        <p className='text-sm text-gray-500'>Separe os itens por virgula.</p>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Linguagens
                        </label>
                        <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='JavaScript, Python, Java' onChange={(e)=>setEditForm({...editForm, languages: e.target.value})} value={editForm.languages}/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Bibliotecas
                        </label>
                        <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='React Query, Redux, Pandas' onChange={(e)=>setEditForm({...editForm, libraries: e.target.value})} value={editForm.libraries}/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Frameworks
                        </label>
                        <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='React, Next.js, Express, Django' onChange={(e)=>setEditForm({...editForm, frameworks: e.target.value})} value={editForm.frameworks}/>
                    </div>

                    <div>
                        <label htmlFor="resume" className='block text-sm font-medium text-gray-700 mb-1'>
                            Curriculo
                        </label>
                        <label htmlFor="resume" className='flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/40 transition'>
                            <FileText className='h-5 w-5 text-indigo-500' />
                            <span>
                                {editForm.resume?.name || user.portfolio?.resume?.fileName || 'Enviar PDF, DOC ou DOCX'}
                            </span>
                            <input hidden type="file" accept='.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' id='resume' onChange={(e)=>setEditForm({...editForm, resume: e.target.files[0]})}/>
                        </label>
                    </div>

                    <div className='flex justify-end space-x-3 pt-6'>
                        
                        <button onClick={()=> setShowEdit(false)} type='button' className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'>Cancel</button>

                        <button type='submit' className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer'>Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ProfileModal
