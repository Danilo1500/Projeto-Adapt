import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { ArrowRight, Plus, X } from 'lucide-react';
import { JobData } from '../JobCreation';

interface DetailsStepProps {
  formData: JobData;
  setFormData: (data: JobData) => void;
  onNext: () => void;
}

export function DetailsStep({ formData, setFormData, onNext }: DetailsStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]').forEach((field) => {
      field.setCustomValidity(field.value.trim() ? '' : 'Preencha este campo.');
    });
    if (!form.reportValidity()) return;
    onNext();
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addDesiredRequirement = () => setFormData({ ...formData, desiredRequirements: [...formData.desiredRequirements, ''] });
  const removeDesiredRequirement = (index: number) => setFormData({ ...formData, desiredRequirements: formData.desiredRequirements.filter((_, i) => i !== index) });
  const updateDesiredRequirement = (index: number, value: string) => {
    const next = [...formData.desiredRequirements];
    next[index] = value;
    setFormData({ ...formData, desiredRequirements: next });
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: newBenefits });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-6 text-card-foreground">Detalhes da vaga</h2>

      <div className="mb-6">
        <Label htmlFor="description">Descrição da vaga *</Label>
        <Textarea
          id="description"
          maxLength={12000}
          placeholder="Descreva as principais responsabilidades e o que o candidato irá fazer no dia a dia..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="mt-2 min-h-[120px]"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <Label>Requisitos *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRequirement}
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar requisito
          </Button>
        </div>
        <div id="requirements" className="space-y-3">
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex gap-2">
              <Input
                id={index === 0 ? 'requirements-input' : undefined}
                maxLength={500}
                placeholder={`Requisito ${index + 1}`}
                value={requirement}
                onChange={(e) => updateRequirement(index, e.target.value)}
                required
              />
              {formData.requirements.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRequirement(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Label>Requisitos desejáveis</Label>
            <p className="mt-1 text-xs text-muted-foreground">Diferencie conhecimentos que contam como bônus dos requisitos obrigatórios.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addDesiredRequirement}>
            <Plus className="w-4 h-4 mr-1" /> Adicionar desejável
          </Button>
        </div>
        <div id="desiredRequirements" className="space-y-3">
          {formData.desiredRequirements.map((requirement, index) => (
            <div key={index} className="flex gap-2">
              <Input maxLength={500} placeholder={`Desejável ${index + 1} (opcional)`} value={requirement} onChange={(e) => updateDesiredRequirement(index, e.target.value)} />
              {formData.desiredRequirements.length > 1 && <Button type="button" variant="ghost" size="icon" aria-label={`Remover requisito desejável ${index + 1}`} onClick={() => removeDesiredRequirement(index)}><X className="w-4 h-4" /></Button>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <Label>Benefícios (opcionais)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBenefit}
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar benefício
          </Button>
        </div>
        <div className="space-y-3">
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Benefício ${index + 1}`}
                maxLength={500}
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
              />
              {formData.benefits.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBenefit(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700">
          Próximo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}

