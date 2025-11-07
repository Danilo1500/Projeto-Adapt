import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { CheckCircle2, MapPin, Building2, Briefcase, DollarSign, Clock } from 'lucide-react';
import { JobData } from '../JobCreation';

interface ReviewStepProps {
  formData: JobData;
  onPublish: () => void;
}

export function ReviewStep({ formData, onPublish }: ReviewStepProps) {
  const salaryRange = formData.salaryMin && formData.salaryMax
    ? `${formData.currency} ${formData.salaryMin} - ${formData.currency} ${formData.salaryMax}`
    : 'A combinar';

  return (
    <div>
      <h2 className="text-gray-900 mb-2">Revisão e Publicação</h2>
      <p className="text-gray-600 mb-6">Revise todas as informações antes de publicar a vaga</p>

      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-gray-900 mb-2">{formData.title}</h3>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Building2 className="w-4 h-4" />
              <span>{formData.company}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {formData.isRemote && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Remoto
              </Badge>
            )}
            {formData.isUrgent && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                Urgente
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{formData.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formData.contractType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm">{formData.experienceLevel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-900 mb-6">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span>{salaryRange}</span>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h4 className="text-gray-900 mb-3">Descrição</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h4 className="text-gray-900 mb-3">Requisitos</h4>
          <ul className="space-y-2">
            {formData.requirements
              .filter((req) => req.trim())
              .map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
          </ul>
        </div>

        <Separator className="my-6" />

        <div>
          <h4 className="text-gray-900 mb-3">Benefícios</h4>
          <ul className="space-y-2">
            {formData.benefits
              .filter((benefit) => benefit.trim())
              .map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
          </ul>
        </div>
      </Card>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-purple-900 text-sm">
          <strong>Atenção:</strong> Ao publicar, esta vaga ficará visível para todos os candidatos
          da plataforma. Certifique-se de que todas as informações estão corretas.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onPublish} className="text-white bg-purple-600 hover:bg-purple-700">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Publicar Vaga
        </Button>
      </div>
    </div>
  );
}
