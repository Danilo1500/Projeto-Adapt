import { useEffect, useRef, useState } from 'react';
import { Briefcase, ArrowLeft, Save } from 'lucide-react';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { BasicInfoStep } from './components/BasicInfoStep';
import { DetailsStep } from './components/DetailsStep';
import { ReviewStep } from './components/ReviewStep';
import { JobsListView } from './components/JobsListView';
import { useAuth } from '@clerk/clerk-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { requestWithAuth } from '../../utils/authRequest';
import { useTheme } from '../../context/ThemeContext';

export interface JobData {
  id?: string;
  title: string;
  company: string;
  location: string;
  contractType: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  isRemote: boolean;
  workMode: 'onsite' | 'hybrid' | 'remote';
  isUrgent: boolean;
  description: string;
  requirements: string[];
  desiredRequirements: string[];
  benefits: string[];
  status?: 'draft' | 'published';
  createdAt?: Date;
}

export default function JobCreation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<JobData>({
    title: '',
    company: '',
    location: '',
    contractType: 'Tempo Integral',
    experienceLevel: 'Júnior (0-2 anos)',
    salaryMin: '',
    salaryMax: '',
    currency: 'R$',
    isRemote: false,
    workMode: 'onsite',
    isUrgent: false,
    description: '',
    requirements: [''],
    desiredRequirements: [''],
    benefits: [''],
  });

  const steps = [
    { number: 1, title: 'Informações básicas' },
    { number: 2, title: 'Detalhes da vaga' },
    { number: 3, title: 'Revisão e publicação' },
  ];

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data } = await requestWithAuth(
        getToken,
        (headers: Record<string, string>) => api.get('/api/job/mine', { headers })
      );
      if (data.success) {
        const mapped = (data.jobs || []).map((job: any) => ({
          ...job,
          id: job._id,
          createdAt: job.createdAt ? new Date(job.createdAt) : undefined,
        }));
        setJobs(mapped);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    requestWithAuth(getToken, (headers: Record<string, string>) => api.get('/api/company/my', { headers }))
      .then(({ data }) => {
        if (data.success && data.company?.name) {
          setCompanyName(data.company.name);
          setFormData((current) => ({ ...current, company: data.company.name }));
        } else {
          toast.error('Cadastre uma empresa antes de criar vagas.');
        }
      })
      .catch(() => toast.error('Não foi possível carregar os dados da empresa.'))
      .finally(() => setCompanyLoading(false));
  }, []);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setView('list');
      setCurrentStep(1);
      resetForm();
      setEditingJobId(null);
    }
  };

  const startNewJob = () => {
    resetForm();
    setFieldErrors({});
    setEditingJobId(null);
    setCurrentStep(1);
    setView('create');
  };

  const startEditJob = (job: JobData) => {
    setFieldErrors({});
    setFormData({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      contractType: job.contractType || 'Tempo Integral',
      experienceLevel: job.experienceLevel || 'Júnior (0-2 anos)',
      salaryMin: job.salaryMin || '',
      salaryMax: job.salaryMax || '',
      currency: job.currency || 'R$',
      isRemote: !!job.isRemote,
      workMode: job.workMode || (job.isRemote ? 'remote' : 'onsite'),
      isUrgent: !!job.isUrgent,
      description: job.description || '',
      requirements: job.requirements?.length ? job.requirements : [''],
      desiredRequirements: job.desiredRequirements?.length ? job.desiredRequirements : [''],
      benefits: job.benefits?.length ? job.benefits : [''],
      status: job.status,
      id: job.id,
    });
    setEditingJobId(job.id || null);
    setCurrentStep(1);
    setView('create');
  };

  const handlePublish = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setFieldErrors({});
    const payload = {
      ...formData,
      requirements: formData.requirements.filter((req) => req.trim()),
      desiredRequirements: formData.desiredRequirements.filter((req) => req.trim()),
      benefits: formData.benefits.filter((benefit) => benefit.trim()),
      status: 'published',
    };

    try {
      const endpoint = editingJobId ? '/api/job/update' : '/api/job/create';
      const body = editingJobId ? { ...payload, jobId: editingJobId } : payload;
      const { data } = await requestWithAuth(
        getToken,
        (headers: Record<string, string>) => api.post(endpoint, body, { headers })
      );
      if (data.success) {
        toast.success(data.message);
        setView('list');
        setCurrentStep(1);
        resetForm();
        setEditingJobId(null);
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors || {};
      setFieldErrors(errors);
      if (Object.keys(errors).length) setCurrentStep(Object.keys(errors).some((key: string) => ['description', 'requirements', 'desiredRequirements', 'benefits'].includes(key)) ? 2 : 1);
      toast.error(error.response?.data?.message || error.message || 'Não foi possível publicar a vaga.');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setFieldErrors({});
    const payload = {
      ...formData,
      requirements: formData.requirements.filter((req) => req.trim()),
      desiredRequirements: formData.desiredRequirements.filter((req) => req.trim()),
      benefits: formData.benefits.filter((benefit) => benefit.trim()),
      status: 'draft',
    };

    try {
      const endpoint = editingJobId ? '/api/job/update' : '/api/job/draft';
      const body = editingJobId ? { ...payload, jobId: editingJobId } : payload;
      const { data } = await requestWithAuth(
        getToken,
        (headers: Record<string, string>) => api.post(endpoint, body, { headers })
      );
      if (data.success) {
        toast.success(data.message);
        setView('list');
        setCurrentStep(1);
        resetForm();
        setEditingJobId(null);
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors || {};
      setFieldErrors(errors);
      if (Object.keys(errors).length) setCurrentStep(Object.keys(errors).some((key: string) => ['description', 'requirements', 'desiredRequirements', 'benefits'].includes(key)) ? 2 : 1);
      toast.error(error.response?.data?.message || error.message || 'Não foi possível salvar o rascunho.');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: companyName,
      location: '',
      contractType: 'Tempo Integral',
      experienceLevel: 'Júnior (0-2 anos)',
      salaryMin: '',
      salaryMax: '',
      currency: 'R$',
      isRemote: false,
      workMode: 'onsite',
      isUrgent: false,
      description: '',
      requirements: [''],
      desiredRequirements: [''],
      benefits: [''],
    });
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const { data } = await requestWithAuth(
        getToken,
        (headers: Record<string, string>) => api.post(
          '/api/job/delete',
          { jobId: id },
          { headers }
        )
      );
      if (data.success) {
        toast.success(data.message);
        setJobs((prev) => prev.filter((job) => job.id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (view === 'list') {
    return (
      <JobsListView
        jobs={jobs}
        isLoading={isLoading}
        onCreateNew={startNewJob}
        onEditJob={startEditJob}
        onDeleteJob={handleDeleteJob}
      />
    );
  }

  const progressPercentage = (currentStep / 3) * 100;

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
                <h1 className={isDark ? 'text-slate-100' : 'text-gray-900'}>Criar nova vaga</h1>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>Encontre os melhores talentos para sua empresa</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Button
                variant="ghost"
                className="text-gray-600 hover:bg-gray-100"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={handleSaveDraft}
                disabled={isSubmitting || companyLoading || !companyName}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar rascunho
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className={`mt-4 rounded-2xl p-4 shadow sm:mt-6 sm:p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-y-3">
            {steps.map((step, index) => (
                <div key={step.number} className="flex min-w-[30%] flex-1 items-center sm:min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.number
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.number}
                  </div>
                    <span
                    className={`${
                      currentStep >= step.number
                        ? 'text-indigo-600'
                        : 'text-gray-500'
                    } hidden sm:inline`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-2 hidden flex-1 sm:block sm:mx-4">
                    <div className="h-0.5 bg-gray-200 relative">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{
                          width: currentStep > step.number ? '100%' : '0%',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-1" />
        </div>

        {/* Form Content */}
        <div className={`mt-4 rounded-2xl p-4 shadow sm:mt-6 sm:p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          {Object.keys(fieldErrors).length > 0 && <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800" role="alert" aria-live="assertive">
            <p className="font-semibold">Revise os campos abaixo:</p>
            <ul className="mt-2 list-inside list-disc">{Object.entries(fieldErrors).map(([field, message]) => {
              const labels: Record<string, string> = { salaryMin: 'Salário mínimo', salaryMax: 'Salário máximo', requirements: 'Requisitos obrigatórios', desiredRequirements: 'Requisitos desejáveis', workMode: 'Modalidade de trabalho', title: 'Título', location: 'Localização', contractType: 'Tipo de contrato', experienceLevel: 'Nível de experiência', description: 'Descrição' };
              return <li key={field}><a className="underline" href={`#${field}`}>{labels[field] || field}</a>: {message}</li>;
            })}</ul>
          </div>}
          {currentStep === 1 && (
            <BasicInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} companyLoading={companyLoading} />
          )}
          {currentStep === 2 && (
            <DetailsStep formData={formData} setFormData={setFormData} onNext={handleNext} />
          )}
          {currentStep === 3 && (
            <ReviewStep formData={formData} onPublish={handlePublish} isSubmitting={isSubmitting} />
          )}
        </div>
      </div>
    </div>
  );
}



