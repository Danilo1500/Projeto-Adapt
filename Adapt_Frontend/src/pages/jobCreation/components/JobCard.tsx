import { JobData } from "../JobCreation";

type Props = {
  job: JobData;
  onApply?: (job: JobData) => void;
  onDelete?: (id?: string) => void;
};

function formatDate(value?: string | Date) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function JobCard({ job, onApply, onDelete }: Props) {
  const salary =
    job.salaryMin || job.salaryMax
      ? `${job.currency ?? ""} ${job.salaryMin ?? ""}${job.salaryMax ? " - " + job.salaryMax : ""}`
      : "A combinar";

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
              <span className="opacity-80">🏢</span>
              <span>{job.company}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="opacity-80">📍</span>
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="opacity-80">🕒</span>
              <span>{job.contractType}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="opacity-80">🎯</span>
              <span>{job.experienceLevel}</span>
            </div>
          </div>

          {job.description && <p className="mt-4 text-slate-700">{job.description}</p>}

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div>Publicado em {formatDate(job.createdAt)}</div>
            <div className="text-sm text-green-600 font-medium">{salary}</div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {onApply && (
            <button
              onClick={() => onApply(job)}
              className="bg-violet-600 text-white px-3 py-2 rounded-md text-sm hover:opacity-95"
            >
              Candidatar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(job.id)}
              className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-sm hover:opacity-90"
            >
              🗑 Remover
            </button>
          )}
        </div>
      </div>
    </article>
  );
}