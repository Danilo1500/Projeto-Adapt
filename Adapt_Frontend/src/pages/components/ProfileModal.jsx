import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil, Code2, Layers, Award, Plus, X, Upload, FileCheck } from 'lucide-react';
import { useSelector } from 'react-redux';

const programmingOptions = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'C++',
  'Go',
  'Rust',
  'PHP',
  'Kotlin',
];

const ProfileModal = ({ setShowEdit }) => {
  const user = useSelector((state)=>state.user.value)
  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
    // novos campos:
    languages: user.languages ?? [], // array de strings
    frameworks: user.frameworks ?? [], // array de strings
    certificates: user.certificates ?? [], // array de { title, issuer, date, file }
  });

  const [frameworkInput, setFrameworkInput] = useState('');
  const [certDraft, setCertDraft] = useState({ title: '', issuer: '', date: '', file: null });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    // aqui você enviaria o editForm ao backend
    console.log('Salvar profile payload:', editForm);
    setShowEdit(false);
  }

  // languages toggle (checkbox)
  const handleLanguageToggle = (lang) => {
    const exists = editForm.languages.includes(lang);
    const languages = exists
      ? editForm.languages.filter(l => l !== lang)
      : [...editForm.languages, lang];
    setEditForm({ ...editForm, languages });
  };

  // frameworks: add / remove
  const addFramework = () => {
    const fw = frameworkInput.trim();
    if (!fw) return;
    if (!editForm.frameworks.includes(fw)) {
      setEditForm({ ...editForm, frameworks: [...editForm.frameworks, fw] });
    }
    setFrameworkInput('');
  };
  const removeFramework = (fw) => {
    setEditForm({ ...editForm, frameworks: editForm.frameworks.filter(f => f !== fw) });
  };

  // certificates: add / remove / change
  const addCertificate = () => {
    if (!certDraft.title.trim()) return;
    setEditForm({ ...editForm, certificates: [...editForm.certificates, certDraft] });
    setCertDraft({ title: '', issuer: '', date: '', file: null });
  };
  const removeCertificate = (index) => {
    const certificates = editForm.certificates.filter((_, i) => i !== index);
    setEditForm({ ...editForm, certificates });
  };
  const handleCertFileChange = (e) => {
    const file = e.target.files[0] ?? null;
    setCertDraft({ ...certDraft, file });
  };
  const handleCertChange = (field, value) => {
    setCertDraft({ ...certDraft, [field]: value });
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-[110] h-screen overflow-y-scroll bg-black/60 backdrop-blur-sm flex items-start justify-center p-4'>
      <div className='max-w-3xl w-full my-6'>
        <div className='bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100'>
          {/* Header */}
          <div className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6 relative'>
            <h1 className='text-white text-2xl'>Editar Perfil</h1>
            <p className='text-indigo-100 mt-1'>Atualize suas informações profissionais</p>
            <button 
              onClick={() => setShowEdit(false)}
              className='absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors'
              aria-label='Fechar'
            >
              <X className='w-5 h-5 text-white' />
            </button>
          </div>

          <form className='p-8 space-y-8' onSubmit={handleSaveProfile}>
            {/* Imagens Section */}
            <div className='space-y-6'>
              <h2 className='flex items-center gap-2 text-gray-900'>
                <div className='p-2 bg-indigo-100 rounded-lg'>
                  <Pencil className='w-4 h-4 text-indigo-600' />
                </div>
                Fotos do Perfil
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                {/* Profile Picture */}
                <div>
                  <label htmlFor="profile_picture" className='block text-gray-700 mb-3'>
                    Foto de Perfil
                  </label>
                  <input 
                    hidden 
                    type="file" 
                    accept='image/*' 
                    id='profile_picture' 
                    onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })} 
                  />
                  <label htmlFor="profile_picture" className='cursor-pointer block'>
                    <div className='group/profile relative inline-block'>
                      <img 
                        src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} 
                        alt="" 
                        className='w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-white ring-2 ring-indigo-100' 
                      />
                      <div className='absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover/profile:opacity-100 flex items-center justify-center transition-opacity duration-200'>
                        <div className='flex flex-col items-center gap-2'>
                          <Pencil className='w-6 h-6 text-white' />
                          <span className='text-white text-xs'>Alterar</span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Cover Photo */}
                <div>
                  <label htmlFor="cover_photo" className='block text-gray-700 mb-3'>
                    Foto de Capa
                  </label>
                  <input 
                    hidden 
                    type="file" 
                    accept='image/*' 
                    id='cover_photo' 
                    onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })} 
                  />
                  <label htmlFor="cover_photo" className='cursor-pointer block'>
                    <div className='group/cover relative'>
                      <img 
                        src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} 
                        alt="" 
                        className='w-full h-32 rounded-2xl bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover shadow-lg border-4 border-white ring-2 ring-indigo-100' 
                      />
                      <div className='absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover/cover:opacity-100 flex items-center justify-center transition-opacity duration-200'>
                        <div className='flex flex-col items-center gap-2'>
                          <Pencil className='w-6 h-6 text-white' />
                          <span className='text-white text-xs'>Alterar</span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className='space-y-4'>
              <h2 className='text-gray-900'>Informações Básicas</h2>

              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-gray-700 mb-2'>
                    Nome Completo
                  </label>
                  <input 
                    type="text" 
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none' 
                    placeholder='Seu nome completo' 
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} 
                    value={editForm.full_name} 
                  />
                </div>

                <div>
                  <label className='block text-gray-700 mb-2'>
                    Nome de Usuário
                  </label>
                  <input 
                    type="text" 
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none' 
                    placeholder='@username' 
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} 
                    value={editForm.username} 
                  />
                </div>
              </div>

              <div>
                <label className='block text-gray-700 mb-2'>
                  Biografia
                </label>
                <textarea 
                  rows={3} 
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none' 
                  placeholder='Conte um pouco sobre você...' 
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} 
                  value={editForm.bio} 
                />
              </div>

              <div>
                <label className='block text-gray-700 mb-2'>
                  Localização
                </label>
                <input 
                  type="text" 
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none' 
                  placeholder='Cidade, País' 
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} 
                  value={editForm.location} 
                />
              </div>
            </div>

            {/* Linguagens de Programação */}
            <div className='space-y-4'>
              <h2 className='flex items-center gap-2 text-gray-900'>
                <div className='p-2 bg-indigo-100 rounded-lg'>
                  <Code2 className='w-4 h-4 text-indigo-600' />
                </div>
                Linguagens de Programação
              </h2>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
                {programmingOptions.map((lang) => (
                  <label 
                    key={lang} 
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                      editForm.languages.includes(lang) 
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-200'
                    }`}
                  >
                    <input
                      type='checkbox'
                      checked={editForm.languages.includes(lang)}
                      onChange={() => handleLanguageToggle(lang)}
                      className='w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500'
                    />
                    <span className='text-sm'>{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Frameworks / Bibliotecas */}
            <div className='space-y-4'>
              <h2 className='flex items-center gap-2 text-gray-900'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <Layers className='w-4 h-4 text-purple-600' />
                </div>
                Frameworks / Bibliotecas
              </h2>

              <div className='flex gap-2'>
                <input
                  type='text'
                  value={frameworkInput}
                  onChange={(e) => setFrameworkInput(e.target.value)}
                  placeholder='Ex: React, Next.js, Express...'
                  className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none'
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFramework(); } }}
                />
                <button 
                  type='button' 
                  onClick={addFramework} 
                  className='px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200 flex items-center gap-2'
                >
                  <Plus className='w-4 h-4' />
                  Adicionar
                </button>
              </div>

              {editForm.frameworks.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {editForm.frameworks.map((fw) => (
                    <span 
                      key={fw} 
                      className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl text-purple-700 group hover:shadow-md transition-all'
                    >
                      <span className='text-sm'>{fw}</span>
                      <button 
                        type='button' 
                        onClick={() => removeFramework(fw)} 
                        className='p-0.5 hover:bg-purple-200 rounded-full transition-colors' 
                        aria-label={`Remover ${fw}`}
                      >
                        <X className='w-3.5 h-3.5' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Certificados */}
            <div className='space-y-4'>
              <h2 className='flex items-center gap-2 text-gray-900'>
                <div className='p-2 bg-amber-100 rounded-lg'>
                  <Award className='w-4 h-4 text-amber-600' />
                </div>
                Certificados
              </h2>

              {/* Formulário de Adição */}
              <div className='bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    type='text'
                    placeholder='Nome do certificado'
                    className='px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white'
                    value={certDraft.title}
                    onChange={(e) => handleCertChange('title', e.target.value)}
                  />
                  <input
                    type='text'
                    placeholder='Emissor (ex: AWS, Google)'
                    className='px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white'
                    value={certDraft.issuer}
                    onChange={(e) => handleCertChange('issuer', e.target.value)}
                  />
                  <input
                    type='date'
                    className='px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white'
                    value={certDraft.date}
                    onChange={(e) => handleCertChange('date', e.target.value)}
                  />
                  <label className='flex items-center gap-2 px-4 py-3 border-2 border-amber-200 rounded-xl cursor-pointer bg-white hover:border-amber-400 transition-all'>
                    <input type='file' accept='.pdf,image/*' onChange={handleCertFileChange} className='hidden' />
                    <Upload className='w-4 h-4 text-amber-600' />
                    <span className='text-gray-700 flex-1 truncate'>
                      {certDraft.file ? certDraft.file.name : 'Upload do arquivo'}
                    </span>
                    {certDraft.file && <FileCheck className='w-4 h-4 text-green-600' />}
                  </label>
                </div>

                <div className='flex gap-2'>
                  <button 
                    type='button' 
                    onClick={addCertificate} 
                    className='flex-1 px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2'
                  >
                    <Plus className='w-4 h-4' />
                    Adicionar certificado
                  </button>
                  <button 
                    type='button' 
                    onClick={() => setCertDraft({ title: '', issuer: '', date: '', file: null })} 
                    className='px-5 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all'
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* Lista de Certificados */}
              {editForm.certificates.length > 0 ? (
                <div className='space-y-3'>
                  {editForm.certificates.map((c, i) => (
                    <div 
                      key={i} 
                      className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl bg-white hover:shadow-md transition-all group'
                    >
                      <div className='flex-1 min-w-0'>
                        <div className='text-gray-900'>{c.title}</div>
                        <div className='text-gray-500 mt-1'>
                          {c.issuer} {c.date && `• ${c.date}`}
                        </div>
                        {c.file && (
                          <div className='text-xs text-gray-400 truncate mt-1 flex items-center gap-1'>
                            <FileCheck className='w-3 h-3' />
                            {c.file.name}
                          </div>
                        )}
                      </div>
                      <button 
                        type='button' 
                        onClick={() => removeCertificate(i)} 
                        className='ml-4 p-2 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-1.5'
                      >
                        <X className='w-4 h-4' />
                        <span className='text-sm'>Remover</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-center text-gray-400 py-8 italic'>Nenhum certificado adicionado ainda</p>
              )}
            </div>

            {/* Botões de Ação */}
            <div className='flex gap-3 pt-6 border-t-2 border-gray-100'>
              <button 
                onClick={() => setShowEdit(false)} 
                type='button' 
                className='flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all'
              >
                Cancelar
              </button>
              <button 
                type='submit' 
                className='flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-indigo-200'
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
