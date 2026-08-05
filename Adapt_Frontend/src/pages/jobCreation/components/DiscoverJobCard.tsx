import { useState } from "react";
import { Building2, Clock3, ExternalLink, MapPin, Sparkles, Target } from "lucide-react";
import { JobData } from "../JobCreation";

type JobCardData = JobData & {
  externalUrl?: string;
  sourceLabel?: string;
  salary?: string;
  aiMatch?: {
    score?: number;
    matchReasons?: string[];
    missingSkills?: string[];
    summary?: string;
  };
};

type Props = {
  job: JobCardData;
  onApply?: (job: JobData) => void;
  onDelete?: (id?: string) => void;
};

function formatDate(value?: string | Date) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function DiscoverJobCard({ job, onApply, onDelete }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <article className="bg-white text-gray-900 rounded-xl border border-gray-200 p-6 shadow-sm max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold truncate">{job.title}</h3>
            {job.isRemote && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">Remoto</span>
            )}
            {job.isUrgent && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md">Urgente</span>
            )}
          </div>

          <div className="mt-3 text-sm text-slate-600 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 opacity-80" />
              <span>{job.company}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 opacity-80" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 opacity-80" />
              <span>{job.contractType}</span>
            </div>

            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 opacity-80" />
              <span>{job.experienceLevel}</span>
            </div>
          </div>

          {job.aiMatch && (
            <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-indigo-700">
                  <Sparkles className="h-4 w-4" />
                  {job.aiMatch.score ?? 0}% compativel
                </span>
                {job.aiMatch.summary && (
                  <span className="text-sm text-slate-700">{job.aiMatch.summary}</span>
                )}
              </div>

              {Array.isArray(job.aiMatch.matchReasons) && job.aiMatch.matchReasons.length > 0 && (
                <ul className="space-y-1 text-sm text-slate-700">
                  {job.aiMatch.matchReasons.slice(0, 3).map((reason, index) => (
                    <li key={`${reason}-${index}`}>- {reason}</li>
                  ))}
                </ul>
              )}

              {Array.isArray(job.aiMatch.missingSkills) && job.aiMatch.missingSkills.length > 0 && (
                <p className="mt-2 text-sm text-slate-500">
                  Aprender depois: {job.aiMatch.missingSkills.slice(0, 4).join(", ")}
                </p>
              )}
            </div>
          )}

          {description && (
            <div className="mt-4">
              <p className={`text-slate-700 whitespace-pre-wrap ${!isExpanded ? "line-clamp-3" : ""}`}>
                {description}
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
              <span>Publicado em {formatDate(job.createdAt)}</span>
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
