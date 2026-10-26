import { useState } from "react";
import { Building2, Clock3, ExternalLink, MapPin, Sparkles, Target } from "lucide-react";
import { JobData } from "../JobCreation";
import { useLanguage } from "../../../context/Language.js";

type JobCardData = JobData & {
  _id?: string;
  externalUrl?: string;
  sourceLabel?: string;
  salary?: string;
  aiMatch?: {
    score?: number | null;
    matchReasons?: string[];
    matchedSkills?: string[];
    requiredSkills?: string[];
    matchedRequired?: string[];
    missingRequired?: string[];
    desiredSkills?: string[];
    matchedDesired?: string[];
    missingDesired?: string[];
    inferredSkills?: string[];
    matchedInferred?: string[];
    missingInferred?: string[];
    declaredSkills?: string[];
    evidenceNotice?: string;
    missingSkills?: string[];
    summary?: string;
    profileIncomplete?: boolean;
    profileNotice?: string;
    comparisonNotice?: string;
    notEvaluated?: string[];
    scoreMeaning?: string;
    courses?: Array<{
      id: string;
      title: string;
      description: string;
      platform: string;
      url: string;
      level?: string;
      duration?: string;
      cost: string;
      type: string;
      relatedSkills: string[];
      reason: string;
    }>;
  };
};

type Props = {
  job: JobCardData;
  onApply?: (job: JobData) => void;
  onDelete?: (id?: string) => void;
  onAnalyze?: (job: JobCardData) => Promise<void> | void;
};

function formatDate(value: string | Date | undefined, locale: string) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
}

export default function DiscoverJobCard({ job, onApply, onDelete, onAnalyze }: Props) {
  const { locale } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const salary =
    job.salary
      ? job.salary
      : job.salaryMin || job.salaryMax
      ? `${job.currency ?? ""} ${job.salaryMin ?? ""}${job.salaryMax ? " - " + job.salaryMax : ""}`
      : "A combinar";

  const description = job.description?.trim() || "";
  const shouldCollapseDescription = description.length > 180;

  const handleApply = () => {
    if (onApply) {
      onApply(job);
      return;
    }

    if (job.externalUrl) {
      window.open(job.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  const canApply = Boolean(onApply || job.externalUrl);

  const handleAnalyze = async () => {
    if (!onAnalyze) return;
    setIsAnalyzing(true);
    try {
      await onAnalyze(job);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <article className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 data-i18n-ignore className="text-lg font-semibold truncate">{job.title}</h3>
            {(job.workMode === 'remote' || job.isRemote) && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">Remoto</span>}
            {job.workMode === 'hybrid' && <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-md">Híbrido</span>}
            {job.isUrgent && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md">Urgente</span>
            )}
          </div>

          <div className="mt-3 text-sm text-slate-600 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 opacity-80" />
              <span data-i18n-ignore>{job.company}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 opacity-80" />
              <span data-i18n-ignore>{job.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 opacity-80" />
              <span data-i18n-ignore>{job.contractType}</span>
            </div>

            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 opacity-80" />
              <span data-i18n-ignore>{job.experienceLevel}</span>
            </div>
          </div>

          {job.aiMatch && (
            <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-indigo-700">
                  <Sparkles className="h-4 w-4" />
                  {job.aiMatch.score === null || job.aiMatch.score === undefined
                    ? "Compatibilidade não calculada"
                    : `${job.aiMatch.score}% de requisitos atendidos`}
                </span>
                {job.aiMatch.summary && (
                  <span className="text-sm text-slate-700">{job.aiMatch.summary}</span>
                )}
              </div>

              {(job.aiMatch.profileNotice || job.aiMatch.comparisonNotice) && (
                <p className="mb-2 text-sm text-amber-800">
                  {job.aiMatch.profileNotice || job.aiMatch.comparisonNotice}
                </p>
              )}
              {job.aiMatch.scoreMeaning && (
                <p className="mb-2 text-xs text-slate-500">{job.aiMatch.scoreMeaning}</p>
              )}

              {Array.isArray(job.aiMatch.matchReasons) && job.aiMatch.matchReasons.length > 0 && (
                <ul className="space-y-1 text-sm text-slate-700">
                  {job.aiMatch.matchReasons.slice(0, 3).map((reason, index) => (
                    <li key={`${reason}-${index}`}>- {reason}</li>
                  ))}
                </ul>
              )}

              {Array.isArray(job.aiMatch.missingSkills) && job.aiMatch.missingSkills.length > 0 && (
                <p className="mt-2 text-sm text-slate-500">
                  Competências não identificadas no perfil: {job.aiMatch.missingSkills.slice(0, 6).join(", ")}
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowMatchDetails((shown) => !shown)}
                className="mt-3 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                aria-expanded={showMatchDetails}
              >
                {showMatchDetails ? "Ocultar análise" : "Por que esta vaga combina comigo?"}
              </button>

              {showMatchDetails && (
                <div className="mt-3 space-y-3 border-t border-indigo-100 pt-3 text-sm text-slate-700">
                  <p><strong>Competências identificadas:</strong> {job.aiMatch.matchedSkills?.join(", ") || "Nenhuma identificada"}</p>
                  <p><strong>Competências declaradas no portfólio:</strong> {job.aiMatch.declaredSkills?.join(", ") || "Nenhuma identificada"}</p>
                  {job.aiMatch.evidenceNotice && <p className="text-xs text-slate-500">{job.aiMatch.evidenceNotice}</p>}
                  <p><strong>Obrigatórias atendidas:</strong> {job.aiMatch.matchedRequired?.join(", ") || "Nenhuma identificada"}</p>
                  <p><strong>Obrigatórias não identificadas:</strong> {job.aiMatch.missingRequired?.join(", ") || "Nenhuma"}</p>
                  <p><strong>Desejáveis identificadas:</strong> {job.aiMatch.matchedDesired?.join(", ") || "Nenhuma identificada"}</p>
                  <p><strong>Desejáveis não identificadas:</strong> {job.aiMatch.missingDesired?.join(", ") || "Nenhuma"}</p>
                  {job.aiMatch.inferredSkills?.length ? (
                    <>
                      <p><strong>Competências citadas na vaga (sem classificação de obrigatoriedade):</strong> {job.aiMatch.inferredSkills.join(", ")}</p>
                      <p><strong>Citadas e identificadas no perfil:</strong> {job.aiMatch.matchedInferred?.join(", ") || "Nenhuma"}</p>
                      <p><strong>Citadas e não identificadas no perfil:</strong> {job.aiMatch.missingInferred?.join(", ") || "Nenhuma"}</p>
                    </>
                  ) : null}
                  {job.aiMatch.notEvaluated?.length ? (
                    <p><strong>Não avaliados:</strong> {job.aiMatch.notEvaluated.join("; ")}</p>
                  ) : null}
                  {job.aiMatch.courses?.length ? (
                    <div>
                      <h4 className="mb-2 font-semibold">Conteúdos para desenvolver competências</h4>
                      <ul className="space-y-2">
                        {job.aiMatch.courses.map((course) => (
                          <li key={course.id} className="rounded-md bg-white p-3">
                            <a href={course.url} target="_blank" rel="noreferrer" className="font-semibold text-indigo-700 underline">
                              {course.title}
                            </a>
                            <p>{course.description}</p>
                            <p className="text-xs text-slate-500">
                              {course.platform} · {course.type} · {course.cost}
                              {course.level ? ` · ${course.level}` : ""}
                              {course.duration ? ` · ${course.duration}` : ""}
                            </p>
                            <p className="mt-1 text-xs">Relaciona-se a: {course.relatedSkills.join(", ")}. {course.reason}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : job.aiMatch.missingSkills?.length ? (
                    <p>Não há um conteúdo verificado cadastrado para estas competências ainda.</p>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {!job.aiMatch && (job._id || job.externalUrl) && onAnalyze && (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:cursor-wait disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {isAnalyzing ? "Analisando vaga..." : "Como você se encaixa nesta vaga?"}
            </button>
          )}

          {description && (
            <div className="mt-4">
              <p className={`text-slate-700 whitespace-pre-wrap ${!isExpanded ? "line-clamp-3" : ""}`}>
                <span data-i18n-ignore>{description}</span>
              </p>
              {shouldCollapseDescription && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((current) => !current)}
                  className="mt-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  {isExpanded ? "Ler menos" : "Ler mais"}
                </button>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-3">
              <span>Publicado em {formatDate(job.createdAt, locale)}</span>
              {job.sourceLabel && (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                  Fonte: {job.sourceLabel}
                </span>
              )}
            </div>
            <div className="text-sm text-green-600 font-medium">{salary}</div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {canApply && (
            <button
              onClick={handleApply}
              className="bg-violet-600 text-white px-3 py-2 rounded-md text-sm hover:opacity-95"
            >
              <span className="inline-flex items-center gap-2">
                {job.externalUrl && <ExternalLink className="h-4 w-4" />}
                Ver vaga
              </span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(job.id)}
              className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-sm hover:opacity-90"
            >
              Remover
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
