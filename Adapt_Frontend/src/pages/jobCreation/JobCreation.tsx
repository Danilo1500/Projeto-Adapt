import { useState } from 'react';
import { Briefcase, ArrowLeft, Save } from 'lucide-react';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { BasicInfoStep } from './components/BasicInfoStep';
import { DetailsStep } from './components/DetailsStep';
import { ReviewStep } from './components/ReviewStep';
import { JobsListView } from './components/JobsListView';

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
  createdAt?: Date;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [jobs, setJobs] = useState<JobData[]>([
    {
      id: '1',
      title: 'Técnico de Suporte N2',
      company: 'TechSolutions',
      location: 'São Paulo - SP',
      contractType: 'CLT',
      experienceLevel: 'Pleno (2-5 anos)',
      salaryMin: '3500',
      salaryMax: '5500',
      currency: 'R$',
      isRemote: true,
      isUrgent: false,
      description: 'Buscamos técnico de suporte nível 2 para atendimento avançado de chamados técnicos.',
      requirements: ['Windows Server', 'Active Directory', 'Troubleshooting avançado'],
      benefits: ['Vale transporte', 'Vale refeição', 'Plano de saúde', 'Home office'],
      createdAt: new Date('2025-10-05'),
    },
  ]);

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
    { number: 1, title: 'Informações Básicas' },
    { number: 2, title: 'Detalhes da Vaga' },
    { number: 3, title: 'Revisão e Publicação' },
  ];

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
    }
  };

  const handlePublish = () => {
    const newJob: JobData = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setJobs([newJob, ...jobs]);
    setView('list');
    setCurrentStep(1);
    resetForm();
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

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  if (view === 'list') {
    return (
      <JobsListView 
        jobs={jobs} 
        onCreateNew={() => setView('create')}
        onDeleteJob={handleDeleteJob}
      />
    );
  }

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-bl-[50px]">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-white">Criar Nova Vaga</h1>
                <p className="text-purple-100 text-sm">Encontre os melhores talentos para sua empresa</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Rascunho
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.number
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`${
                      currentStep >= step.number
                        ? 'text-purple-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className="h-0.5 bg-gray-300 relative">
                      <div
                        className="h-full bg-purple-600 transition-all duration-300"
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
        <div className="bg-white rounded-2xl shadow-xl p-8">
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
