import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { CheckCircle2, MapPin, Building2, Briefcase, DollarSign, Clock } from 'lucide-react';
import { JobData } from '../JobCreation';

interface ReviewStepProps {
  formData: JobData;
  onPublish: () => void;
  isSubmitting?: boolean;
}

export function ReviewStep({ formData, onPublish, isSubmitting = false }: ReviewStepProps) {
  const salaryRange = formData.salaryMin && formData.salaryMax
    ? `${formData.currency} ${formData.salaryMin} - ${formData.currency} ${formData.salaryMax}`
    : 'A combinar';

  return (
    <div>
      <h2 className="mb-2 text-card-foreground">Revisão e publicação</h2>
      <p className="mb-6 text-foreground/80">Revise todas as informações antes de publicar a vaga</p>

      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 data-i18n-ignore className="mb-2 text-foreground">{formData.title}</h3>
            <div className="mb-3 flex items-center gap-2 text-foreground/80">
              <Building2 className="w-4 h-4" />
            <span data-i18n-ignore>{formData.company}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {(formData.workMode === 'remote' || formData.isRemote) && <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">Remoto</Badge>}
            {formData.workMode === 'hybrid' && <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-100">Híbrido</Badge>}
            {formData.isUrgent && (
              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-100">
                Urgente
              </Badge>
            )}
          </div>
        </div>

        {formData.desiredRequirements.some((item) => item.trim()) && <>
          <Separator className="my-6" />
          <div className="mb-6">
            <h4 className="mb-3 text-foreground">Requisitos desejáveis</h4>
            <ul className="space-y-2">{formData.desiredRequirements.filter((item) => item.trim()).map((item, index) => <li data-i18n-ignore key={index} className="text-foreground/90">{item}</li>)}</ul>
          </div>
        </>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-foreground/80">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{formData.location}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground/80">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formData.contractType}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground/80">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm">{formData.experienceLevel}</span>
          </div>
        </div>

          <div className="mb-6 flex items-center gap-2 text-foreground">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span>{salaryRange}</span>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h4 className="mb-3 text-foreground">Descrição</h4>
          <p data-i18n-ignore className="whitespace-pre-wrap text-foreground/90">{formData.description}</p>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h4 className="mb-3 text-foreground">Requisitos</h4>
          <ul className="space-y-2">
            {formData.requirements
              .filter((req) => req.trim())
              .map((req, index) => (
                <li data-i18n-ignore key={index} className="flex items-start gap-2 text-foreground/90">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
          </ul>
        </div>

        <Separator className="my-6" />

        <div>
          <h4 className="mb-3 text-foreground">Benefícios</h4>
          <ul className="space-y-2">
            {formData.benefits
              .filter((benefit) => benefit.trim())
              .map((benefit, index) => (
                <li data-i18n-ignore key={index} className="flex items-start gap-2 text-foreground/90">
                  <CheckCircle2 className="w-5 h-5 text-green-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
          </ul>
        </div>
      </Card>

      <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-950">
        <p className="text-sm text-indigo-900 dark:text-indigo-100">
          <strong>Atenção:</strong> Ao publicar, esta vaga ficará visível para todos os candidatos
          da plataforma. Certifique-se de que todas as informações estão corretas.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onPublish} disabled={isSubmitting} className="text-white bg-indigo-600 hover:bg-indigo-700">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Salvando…' : 'Publicar vaga'}
        </Button>
      </div>
    </div>
  );
}

