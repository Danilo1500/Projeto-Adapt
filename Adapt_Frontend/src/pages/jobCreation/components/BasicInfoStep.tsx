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
  companyLoading?: boolean;
}

export function BasicInfoStep({ formData, setFormData, onNext, companyLoading = false }: BasicInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]').forEach((field) => {
      field.setCustomValidity(field.value.trim() ? '' : 'Preencha este campo.');
    });
    if (!form.reportValidity()) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-6 text-card-foreground">Informações básicas da vaga</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="title">Título da vaga *</Label>
          <Input
            id="title"
            maxLength={160}
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
            readOnly
            aria-describedby="company-help"
            className="mt-2 bg-muted text-muted-foreground"
            required
          />
          <p id="company-help" className="mt-1 text-xs text-muted-foreground">
            {companyLoading ? 'Carregando empresa…' : formData.company ? 'Empresa vinculada à sua conta.' : 'Cadastre ou sincronize sua empresa antes de publicar uma vaga.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="location">Localização *</Label>
          <Input
            id="location"
            maxLength={160}
            placeholder="Ex: São Paulo - SP"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="contractType">Tipo de contrato *</Label>
          <Select
            value={formData.contractType}
            onValueChange={(value) => setFormData({ ...formData, contractType: value })}
          >
            <SelectTrigger id="contractType" className="mt-2">
              <SelectValue />
            </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
              <SelectItem value="Tempo Integral">Tempo integral</SelectItem>
              <SelectItem value="Meio Período">Meio período</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
              <SelectItem value="Estágio">Estágio</SelectItem>
              <SelectItem value="Temporário">Temporário</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="workMode">Modalidade de trabalho *</Label>
          <Select value={formData.workMode} onValueChange={(value) => setFormData({ ...formData, workMode: value as JobData['workMode'], isRemote: value === 'remote' })}>
            <SelectTrigger id="workMode" className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground"><SelectItem value="onsite">Presencial</SelectItem><SelectItem value="hybrid">Híbrido</SelectItem><SelectItem value="remote">Remoto</SelectItem></SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="experienceLevel">Nível de experiência *</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
            <SelectTrigger id="experienceLevel" className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground"><SelectItem value="Estágio">Estágio</SelectItem><SelectItem value="Aprendiz">Aprendiz</SelectItem><SelectItem value="Trainee">Trainee</SelectItem><SelectItem value="Júnior (0-2 anos)">Júnior (0-2 anos)</SelectItem><SelectItem value="Pleno (2-5 anos)">Pleno (2-5 anos)</SelectItem><SelectItem value="Sênior (5+ anos)">Sênior (5+ anos)</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="urgent"
            checked={formData.isUrgent}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isUrgent: checked as boolean })
            }
          />
          <Label htmlFor="urgent" className="cursor-pointer">
            Vaga urgente
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_1fr] items-center gap-2 mb-8">
        <Label htmlFor="salaryMin">Salário (opcional)</Label>
        <div className="flex items-center gap-2">
          <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
            <SelectTrigger id="currency" className="w-20"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground"><SelectItem value="R$">R$</SelectItem><SelectItem value="US$">US$</SelectItem><SelectItem value="€">€</SelectItem></SelectContent>
          </Select>
          <Input id="salaryMin" placeholder="Mínimo" inputMode="decimal" maxLength={15} value={formData.salaryMin} onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })} />
        </div>
        <span className="text-muted-foreground">até</span>
        <Input id="salaryMax" aria-label="Salário máximo" placeholder="Máximo" inputMode="decimal" maxLength={15} value={formData.salaryMax} onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
          Próximo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}

