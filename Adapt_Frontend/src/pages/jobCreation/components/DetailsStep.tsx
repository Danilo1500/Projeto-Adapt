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
      <h2 className="text-gray-900 mb-6">Detalhes da Vaga</h2>

      <div className="mb-6">
        <Label htmlFor="description">Descrição da Vaga *</Label>
        <Textarea
          id="description"
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
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Requisito
          </Button>
        </div>
        <div className="space-y-3">
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex gap-2">
              <Input
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

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <Label>Benefícios *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBenefit}
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Benefício
          </Button>
        </div>
        <div className="space-y-3">
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Benefício ${index + 1}`}
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                required
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
        <Button type="submit" className="text-white bg-purple-600 hover:bg-purple-700">
          Próximo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
