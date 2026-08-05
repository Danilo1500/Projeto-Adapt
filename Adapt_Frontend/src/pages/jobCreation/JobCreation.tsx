import { useEffect, useState } from 'react';
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
  isUrgent: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  status?: 'draft' | 'published';
  createdAt?: Date;
}

export default function JobCreation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const { getToken } = useAuth();

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
    isUrgent: false,
    description: '',
    requirements: [''],
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
    setEditingJobId(null);
    setCurrentStep(1);
    setView('create');
  };

  const startEditJob = (job: JobData) => {
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
      isUrgent: !!job.isUrgent,
      description: job.description || '',
      requirements: job.requirements?.length ? job.requirements : [''],
      benefits: job.benefits?.length ? job.benefits : [''],
      status: job.status,
      id: job.id,
    });
    setEditingJobId(job.id || null);
    setCurrentStep(1);
    setView('create');
  };

  const handlePublish = async () => {
    const payload = {
      ...formData,
      requirements: formData.requirements.filter((req) => req.trim()),
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
        if (!editingJobId) {
          const newJob: JobData = {
            ...formData,
            id: `temp-${Date.now()}`,
            createdAt: new Date(),
            status: 'published',
          };
          setJobs((prev) => [newJob, ...prev]);
        }
        setView('list');
        setCurrentStep(1);
        resetForm();
        setEditingJobId(null);
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSaveDraft = async () => {
    const payload = {
      ...formData,
      requirements: formData.requirements.filter((req) => req.trim()),
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
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      contractType: 'Tempo Integral',
      experienceLevel: 'Júnior (0-2 anos)',
      salaryMin: '',
      salaryMax: '',
      currency: 'R$',
      isRemote: false,
      isUrgent: false,
      description: '',
      requirements: [''],
      benefits: [''],
    });
  };

  const handleDeleteJob = async (id: string) => {
    if (id.startsWith('temp-')) {
      setJobs((prev) => prev.filter((job) => job.id !== id));
      return;
    }

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
      toast.error(error.message);
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 rounded-full w-12 h-12 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-gray-900">Criar nova vaga</h1>
                <p className="text-gray-500 text-sm">Encontre os melhores talentos para sua empresa</p>
              </div>
            </div>
            <div className="flex gap-3">
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
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar rascunho
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
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
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
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
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          {currentStep === 1 && (
            <BasicInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <DetailsStep formData={formData} setFormData={setFormData} onNext={handleNext} />
          )}
          {currentStep === 3 && (
            <ReviewStep formData={formData} onPublish={handlePublish} />
          )}
        </div>
      </div>
    </div>
  );
}



