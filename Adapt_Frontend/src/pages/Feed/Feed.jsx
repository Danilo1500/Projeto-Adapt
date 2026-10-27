import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'
import { useAuth } from '@clerk/clerk-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { requestWithAuth } from '../../utils/authRequest'
import { ArrowUpRight, BriefcaseBusiness, Cloud, GraduationCap, ShieldCheck } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const sponsoredAds = [
  {
    title: 'Curso Full Stack com React e Node.js',
    advertiser: 'TechAcademy Demo',
    category: 'Educação',
    description: 'Aprenda a desenvolver aplicações web completas.',
    action: 'Conhecer curso',
    Icon: GraduationCap,
  },
  {
    title: 'Preparação para Certificação AWS',
    advertiser: 'CloudSkills Demo',
    category: 'Cloud',
    description: 'Aprimore seus conhecimentos em computação em nuvem.',
    action: 'Ver treinamento',
    Icon: Cloud,
  },
  {
    title: 'Bootcamp de Segurança da Informação',
    advertiser: 'CyberLab Demo',
    category: 'Segurança',
    description: 'Conheça fundamentos de redes e proteção de sistemas.',
    action: 'Saiba mais',
    Icon: ShieldCheck,
  },
  {
    title: 'Oportunidade para Desenvolvedor Júnior',
    advertiser: 'DevStart Demo',
    category: 'Carreira',
    description: 'Confira uma oportunidade fictícia para profissionais em início de carreira.',
    action: 'Ver oportunidade',
    Icon: BriefcaseBusiness,
  },
]

const Feed = () => {

  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const { getToken, isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchFeeds();
    }
  }, [isLoaded, isSignedIn])

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const { data } = await requestWithAuth(
        getToken,
        (headers) => api.get('/api/post/feed', { headers })
      )


      if (data.success) {
        setFeeds(data.posts)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
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
      <aside className='max-xl:hidden sticky top-0 w-80 shrink-0'>
        <section
          aria-labelledby='sponsored-heading'
          className={`flex h-[300px] max-w-xs flex-col rounded-md p-4 shadow ${
            isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'
          }`}
        >
          <div className='mb-3 shrink-0'>
            <h2 id='sponsored-heading' className='text-sm font-semibold'>Sponsored</h2>
            <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Anúncios fictícios para demonstração.
            </p>
          </div>
          <div className='min-h-0 flex-1 space-y-3 overflow-y-auto pr-1'>
            {sponsoredAds.map(({ title, advertiser, category, description, action, Icon }) => (
              <article
                key={title}
                className={`rounded-lg border p-3 ${
                  isDark ? 'border-slate-700 bg-slate-900/60' : 'border-gray-200 bg-white'
                }`}
              >
                <div className='mb-3 flex items-center justify-between gap-2'>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
                    isDark ? 'bg-indigo-950 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    Patrocinado · Demo
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {category}
                  </span>
                </div>
                <div className='flex items-start gap-3'>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isDark ? 'bg-slate-800 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Icon className='h-5 w-5' aria-hidden='true' />
                  </div>
                  <div className='min-w-0'>
                    <h3 className={`text-sm font-semibold leading-snug ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {title}
                    </h3>
                    <p className={`mt-1 text-xs font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {advertiser}
                    </p>
                  </div>
                </div>
                <p className={`mt-3 text-xs leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {description}
                </p>
                <button
                  type='button'
                  onClick={() => toast('Anúncio demonstrativo: links e ofertas não estão ativos.')}
                  className={`mt-3 inline-flex w-full items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition ${
                    isDark
                      ? 'bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {action}
                  <ArrowUpRight className='h-3.5 w-3.5' aria-hidden='true' />
                </button>
              </article>
            ))}
          </div>
          <p className={`mt-2 shrink-0 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Anunciantes e ofertas fictícios. Nenhuma parceria comercial real.
          </p>
        </section>

        <RecentMessages />
      </aside>

    </div>
  )
}

export default Feed
