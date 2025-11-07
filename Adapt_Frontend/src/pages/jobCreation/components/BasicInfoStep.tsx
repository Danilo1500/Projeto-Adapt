import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ArrowRight } from 'lucide-react';
import { JobData } from '../JobCreation';

interface BasicInfoStepProps {
  formData: JobData;
  setFormData: (data: JobData) => void;
  onNext: () => void;
}

export function BasicInfoStep({ formData, setFormData, onNext }: BasicInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-gray-900 mb-6">Informações Básicas da Vaga</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="title">Título da Vaga *</Label>
          <Input
            id="title"
            placeholder="Ex: Técnico de Redes Pleno"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="company">Empresa *</Label>
          <Input
            id="company"
            placeholder="Nome da sua empresa"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="location">Localização *</Label>
          <Input
            id="location"
            placeholder="Ex: São Paulo - SP"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="contractType">Tipo de Contrato *</Label>
          <Select
            value={formData.contractType}
            onValueChange={(value) => setFormData({ ...formData, contractType: value })}
          >
            <SelectTrigger id="contractType" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Tempo Integral">Tempo Integral</SelectItem>
              <SelectItem value="Meio Período">Meio Período</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
              <SelectItem value="Estágio">Estágio</SelectItem>
              <SelectItem value="Temporário">Temporário</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="experienceLevel">Nível de Experiência *</Label>
          <Select
            value={formData.experienceLevel}
            onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
          >
            <SelectTrigger id="experienceLevel" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="Júnior (0-2 anos)">Júnior (0-2 anos)</SelectItem>
              <SelectItem value="Pleno (2-5 anos)">Pleno (2-5 anos)</SelectItem>
              <SelectItem value="Sênior (5+ anos)">Sênior (5+ anos)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Salário</Label>
          <div className="flex items-center gap-3 mt-2">
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="R$">R$</SelectItem>
                <SelectItem value="US$">US$</SelectItem>
                <SelectItem value="€">€</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Mín"
              value={formData.salaryMin}
              onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
              className="flex-1"
            />
            <span className="text-gray-500">até</span>
            <Input
              placeholder="Máx"
              value={formData.salaryMax}
              onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote"
            checked={formData.isRemote}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isRemote: checked as boolean })
            }
          />
          <Label htmlFor="remote" className="cursor-pointer">
            Trabalho Remoto
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="urgent"
            checked={formData.isUrgent}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isUrgent: checked as boolean })
            }
          />
          <Label htmlFor="urgent" className="cursor-pointer">
            Vaga Urgente
          </Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
          Próximo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
