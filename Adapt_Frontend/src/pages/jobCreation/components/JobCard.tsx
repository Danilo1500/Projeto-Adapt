import { Building2, Clock3, ExternalLink, MapPin, Target } from "lucide-react";
import { JobData } from "../JobCreation";
import { useLanguage } from "../../../context/Language.js";
import { useTheme } from "../../../context/ThemeContext";

type JobCardData = JobData & {
  externalUrl?: string;
  sourceLabel?: string;
  salary?: string;
};

type Props = {
  job: JobCardData;
  onApply?: (job: JobData) => void;
  onDelete?: (id?: string) => void;
};

function formatDate(value: string | Date | undefined, locale: string) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
}

export default function JobCard({ job, onApply, onDelete }: Props) {
  const { locale } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const salary =
    job.salary
      ? job.salary
      : job.salaryMin || job.salaryMax
      ? `${job.currency ?? ""} ${job.salaryMin ?? ""}${job.salaryMax ? " - " + job.salaryMax : ""}`
      : "A combinar";

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
    <article className={`mx-auto w-full min-w-0 max-w-4xl rounded-xl border p-4 shadow-sm sm:p-6 ${isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-gray-200 bg-white text-gray-900"}`}>
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 data-i18n-ignore className="truncate text-lg font-semibold">{job.title}</h3>
            {(job.workMode === 'remote' || job.isRemote) && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">Remoto</span>}
            {job.workMode === 'hybrid' && <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-md">Híbrido</span>}
            {job.isUrgent && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md">Urgente</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
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

          {job.description && <p data-i18n-ignore className="mt-4 text-slate-700 dark:text-slate-200">{job.description}</p>}

          <div className="mt-4 flex flex-wrap items-start justify-between gap-3 text-xs text-slate-500">
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

        <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end sm:gap-3">
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
