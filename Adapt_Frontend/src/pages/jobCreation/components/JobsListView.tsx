import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Briefcase, Plus, MapPin, Building2, Clock, DollarSign, Trash2 } from 'lucide-react';
import { JobData } from '../JobCreation';
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
  onDeleteJob: (id: string) => void;
}

export function JobsListView({ jobs, onCreateNew, onDeleteJob }: JobsListViewProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-bl-[50px]">
        <div className="container mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-white">Portal de Vagas TI</h1>
                <p className="text-purple-100">
                  Gerencie vagas de emprego para técnicos em TI
                </p>
              </div>
            </div>
            <Button
              onClick={onCreateNew}
              className="bg-white text-purple-600 hover:bg-purple-50"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Nova Vaga
            </Button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="container mx-auto px-8 py-12">
        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">Nenhuma vaga publicada</h3>
            <p className="text-gray-600 mb-6">
              Comece criando sua primeira vaga de emprego
            </p>
            <Button onClick={onCreateNew} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Vaga
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => {
              const salaryRange =
                job.salaryMin && job.salaryMax
                  ? `${job.currency} ${job.salaryMin} - ${job.currency} ${job.salaryMax}/mês`
                  : 'A combinar';

              return (
                <Card key={job.id} className="p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <h3 className="text-gray-900">{job.title}</h3>
                        {job.isUrgent && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            Urgente
                          </Badge>
                        )}
                        {job.isRemote && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Remoto
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{job.contractType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.experienceLevel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 text-sm">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span>{salaryRange}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Publicado em {formatDate(job.createdAt!)}</span>
                      </div>
                    </div>

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
                            Esta ação não pode ser desfeita. A vaga "{job.title}" será
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
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
