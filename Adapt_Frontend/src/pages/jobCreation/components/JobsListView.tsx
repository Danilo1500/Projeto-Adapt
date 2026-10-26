import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Briefcase, Plus, MapPin, Building2, Clock, DollarSign, Trash2, Pencil } from 'lucide-react';
import { JobData } from '../JobCreation';
import { useLanguage } from '../../../context/Language.js';
import { useTheme } from '../../../context/ThemeContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface JobsListViewProps {
  jobs: JobData[];
  onCreateNew: () => void;
  onEditJob: (job: JobData) => void;
  onDeleteJob: (id: string) => void;
  isLoading?: boolean;
}

export function JobsListView({ jobs, onCreateNew, onEditJob, onDeleteJob, isLoading = false }: JobsListViewProps) {
  const { locale } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const formatDate = (date?: Date) => {
    if (!date || Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className={`min-h-screen p-3 sm:p-6 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className={`rounded-2xl p-4 shadow sm:p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 sm:h-12 sm:w-12">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className={isDark ? 'text-slate-100' : 'text-gray-900'}>Vagas da empresa</h1>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>
                  Gerencie vagas de emprego para profissionais de tecnologia
                </p>
              </div>
            </div>
            <Button
              onClick={onCreateNew}
              size="lg"
              className="w-full shrink-0 bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Nova Vaga
            </Button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-5xl mx-auto py-8">
        {isLoading ? (
          <Card className="p-10 text-center">
            <Briefcase className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-slate-300">Carregando vagas...</p>
          </Card>
        ) : jobs.length === 0 ? (
          <Card className="p-10 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="mb-2 text-gray-900 dark:text-slate-100">Nenhuma vaga cadastrada</h3>
            <p className="mb-6 text-gray-600 dark:text-slate-300">
              Comece criando sua primeira vaga de emprego
            </p>
            <Button onClick={onCreateNew} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Vaga
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {jobs.map((job) => {
              const salaryRange =
                job.salaryMin && job.salaryMax
                  ? `${job.currency} ${job.salaryMin} - ${job.currency} ${job.salaryMax}/mês`
                  : 'A combinar';

              return (
                <Card key={job.id} className={`min-w-0 p-4 transition-shadow hover:shadow-xl sm:p-6 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-gray-900'}`}>
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-start gap-2 sm:gap-3">
                        <h3 data-i18n-ignore className="text-gray-900 dark:text-slate-100">{job.title}</h3>
                        {job.status === 'draft' && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Rascunho
                          </Badge>
                        )}
                        {job.isUrgent && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            Urgente
                          </Badge>
                        )}
                        {(job.workMode === 'remote' || job.isRemote) && <Badge variant="secondary" className="bg-blue-100 text-blue-700">Remoto</Badge>}
                        {job.workMode === 'hybrid' && <Badge variant="secondary" className="bg-violet-100 text-violet-700">Híbrido</Badge>}
                      </div>

                      <div className="mb-4 flex items-center gap-2 text-gray-600 dark:text-slate-300">
                        <Building2 className="w-4 h-4" />
                        <span data-i18n-ignore>{job.company}</span>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-slate-300">
                          <MapPin className="w-4 h-4" />
                          <span data-i18n-ignore>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-slate-300">
                          <Clock className="w-4 h-4" />
                          <span data-i18n-ignore>{job.contractType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-slate-300">
                          <Briefcase className="w-4 h-4" />
                          <span data-i18n-ignore>{job.experienceLevel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 text-sm dark:text-slate-100">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span>{salaryRange}</span>
                        </div>
                      </div>

                      <p data-i18n-ignore className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                        <span>Publicado em {formatDate(job.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
                      <Button variant="outline" aria-label={job.status === 'draft' ? 'Continuar edição da vaga' : 'Editar vaga'} className="min-w-0 flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 sm:flex-none" onClick={() => onEditJob(job)}>
                        <Pencil className="mr-1 h-4 w-4" /> {job.status === 'draft' ? 'Continuar' : 'Editar'}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir vaga?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. A vaga "<span data-i18n-ignore>{job.title}</span>" será
                              permanentemente removida.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteJob(job.id!)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

