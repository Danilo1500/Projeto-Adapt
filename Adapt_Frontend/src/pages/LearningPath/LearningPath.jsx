import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { ExternalLink, GraduationCap, LoaderCircle, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/Language.js";

const courseStatuses = [
  ["want", "Quero fazer"],
  ["in_progress", "Em andamento"],
  ["completed", "Concluído"],
];
const projectStatuses = [
  ["planned", "Projeto planejado"],
  ["in_progress", "Projeto em andamento"],
  ["completed", "Projeto concluído"],
];

const getCourseReason = (course, t) => {
  const skills = (course.reasonSkills || course.relatedSkills || []).join(", ");
  if (course.reasonKind === "compatible-gap") return t("Desenvolve {{skills}}, ainda não identificada em {{count}} vaga(s) comparável(is) que compartilham competências com seu perfil.").replace("{{skills}}", skills).replace("{{count}}", String(course.reasonVacancyCount));
  if (course.reasonKind === "published-gap") return t("Desenvolve {{skills}}, citada em {{count}} vaga(s) publicada(s). Nenhuma teve correspondência positiva com seu perfil, então esta sugestão se baseia na demanda observada, não em compatibilidade.").replace("{{skills}}", skills).replace("{{count}}", String(course.reasonVacancyCount));
  if (course.reasonKind === "goal") return t("Recomendado porque você informou interesse em desenvolver {{skills}}.").replace("{{skills}}", skills);
  if (course.reasonKind === "profile") return t("Aproveita sua base declarada em {{skills}} para construir evidências práticas no portfólio.").replace("{{skills}}", skills);
  return t("Sugestão geral de aprendizagem para construir um portfólio web demonstrável; não foi baseada em vagas compatíveis nem em uma meta profissional informada.");
};

const getVacancyNotice = (diagnosis, t) => {
  if (diagnosis.vacancyNoticeCode === "compatible") return t("Recomendações fundamentadas em {{count}} vagas publicadas que compartilham competências com o perfil.").replace("{{count}}", String(diagnosis.vacancyCount));
  if (diagnosis.vacancyNoticeCode === "requirements-only") return t("Nenhuma vaga teve correspondência positiva com as competências declaradas. As sugestões usam requisitos de vagas publicadas, não são apresentadas como vagas compatíveis.");
  return t("Não foram encontradas vagas comparáveis. As sugestões usam as competências do perfil, seus objetivos e materiais gerais de portfólio.");
};

export default function LearningPath() {
  const { getToken } = useAuth();
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const isEnglish = language === "en";
  const isDark = theme === "dark";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [skillDrafts, setSkillDrafts] = useState({});
  const [targetRole, setTargetRole] = useState("");
  const [desiredSkills, setDesiredSkills] = useState("");
  const panel = isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900";
  const muted = isDark ? "text-slate-300" : "text-slate-600";

  const load = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await api.get("/api/user/learning-recommendations", { headers: { Authorization: `Bearer ${token}` } });
      setData(response.data);
      setSkillDrafts(Object.fromEntries((response.data.courses || []).map((course) => [course.id, (course.progress.acquiredSkills || []).join(", ")])));
      setTargetRole(response.data.diagnosis.targetRole || "");
      setDesiredSkills((response.data.diagnosis.desiredSkills || []).join(", "));
    } catch (error) {
      toast.error(error.response?.data?.message || t("Não foi possível carregar seu plano de aprendizagem."));
    } finally {
      setLoading(false);
    }
  }, [getToken, t]);

  useEffect(() => { load(); }, [load]);

  const saveProgress = async (courseId, updates) => {
    setSaving(courseId);
    try {
      const token = await getToken();
      await api.patch("/api/user/learning-progress", { courseId, ...updates }, { headers: { Authorization: `Bearer ${token}` } });
      await load();
      toast.success(t("Progresso salvo. As recomendações foram atualizadas."));
    } catch (error) {
      toast.error(error.response?.data?.message || t("Não foi possível salvar o progresso."));
    } finally {
      setSaving("");
    }
  };

  const savePreferences = async () => {
    setSaving("preferences");
    try {
      const token = await getToken();
      await api.patch("/api/user/learning-preferences", {
        targetRole,
        desiredSkills: desiredSkills.split(",").map((skill) => skill.trim()).filter(Boolean),
      }, { headers: { Authorization: `Bearer ${token}` } });
      await load();
      toast.success(t("Objetivos atualizados; recomendações recalculadas."));
    } catch (error) {
      toast.error(error.response?.data?.message || t("Não foi possível salvar seus objetivos."));
    } finally {
      setSaving("");
    }
  };

  if (loading) return <div className="flex min-h-full items-center justify-center"><LoaderCircle className="animate-spin text-indigo-600" /></div>;

  return (
    <main className={`min-h-full overflow-y-auto p-5 md:p-9 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className={`rounded-2xl border p-6 md:p-8 ${panel}`}>
          <div className="flex items-center gap-3 text-indigo-500"><GraduationCap /><span className="text-sm font-semibold">ADAPT • APRENDIZAGEM</span></div>
          <h1 className="mt-3 text-3xl font-bold">{t("Evolua seu portfólio")}</h1>
          <p className={`mt-2 max-w-3xl ${muted}`}>{t("Encontre competências citadas em vagas relevantes, estude com materiais oficiais e registre projetos que tornam seu aprendizado visível.")}</p>
          {data?.criteria && <p className={`mt-4 text-xs ${muted}`}>{t(data.criteria.method)} {t("{{count}} vaga(s) comparável(is) analisada(s).").replace("{{count}}", String(data.criteria.comparableVacancies))}</p>}
        </header>

        <section className={`rounded-2xl border p-6 ${panel}`}>
          <h2 className="text-xl font-bold">{t("Seus objetivos profissionais")}</h2>
          <p className={`mt-1 text-sm ${muted}`}>{t("Use esses objetivos para personalizar sugestões quando não houver vagas comparáveis.")}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
            <input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} maxLength={100} placeholder={t("Área desejada (ex.: Frontend)")} className="rounded-lg border border-slate-300 bg-transparent p-2 text-inherit" />
            <input value={desiredSkills} onChange={(event) => setDesiredSkills(event.target.value)} placeholder={t("Competências para desenvolver (separadas por vírgula)")} className="rounded-lg border border-slate-300 bg-transparent p-2 text-inherit" />
            <button type="button" onClick={savePreferences} disabled={saving === "preferences"} className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-60">{t("Salvar objetivos")}</button>
          </div>
        </section>

        <section className={`rounded-2xl border p-6 ${panel}`}>
          <h2 className="text-xl font-bold">{t("Diagnóstico do portfólio")}</h2>
          <p className={`mt-2 ${muted}`}><strong>{isEnglish ? "Declared skills:" : "Competências declaradas:"}</strong> <span data-i18n-ignore>{data?.diagnosis.identifiedSkills.join(", ") || (isEnglish ? "No skills in the portfolio yet." : "Nenhuma competência cadastrada no portfólio ainda.")}</span></p>
          <p className={`mt-2 ${muted}`}>{t(data?.diagnosis.evidenceNotice || "")}</p>
          <p className={`mt-2 ${muted}`}>{t(data?.diagnosis.projectNotice || "")}</p>
          <p className={`mt-2 ${muted}`}>{getVacancyNotice(data?.diagnosis || {}, t)}</p>
          <p className={`mt-2 text-sm ${muted}`}>{isEnglish ? "Recommendation basis:" : "Base das recomendações:"} {data?.criteria.recommendationSource === "compatible-jobs" ? t("vagas compatíveis e lacunas encontradas") : data?.criteria.recommendationSource === "published-job-requirements" ? t("requisitos publicados (sem correspondência positiva)") : data?.criteria.recommendationSource === "profile-goals" ? t("competências e objetivos do perfil; sem vagas comparáveis") : t("catálogo geral de portfólio; informe sua área para personalizar")}.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data?.diagnosis.skillsToDevelop.map(({ skill, vacancyCount }) => <span key={skill} className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">{skill} · {vacancyCount} vaga(s)</span>)}
            {!data?.diagnosis.skillsToDevelop.length && <span className={`text-sm ${muted}`}>Não há lacunas identificadas no momento.</span>}
          </div>
        </section>

        <section>
          <h2 className={`mb-4 text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{t("Cursos e projetos práticos")}</h2>
          {!data?.courses.length && <div className={`rounded-xl border p-6 ${panel}`}>{t("Adicione competências ao portfólio ou volte quando houver vagas publicadas para receber recomendações.")}</div>}
          <div className="grid gap-4 lg:grid-cols-2">
            {data?.courses.map((course) => (
              <article key={course.id} className={`rounded-2xl border p-5 ${panel}`}>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{course.platform} · {course.type}</p>
                <h3 data-i18n-ignore className="mt-2 text-lg font-bold">{course.title}</h3>
                <p className={`mt-2 text-sm ${muted}`}>{t(course.description)}</p>
                <p className={`mt-3 text-sm ${muted}`}><strong>{t("Por que foi recomendado:")}</strong> {getCourseReason(course, t)}</p>
                <p className={`mt-2 text-sm ${muted}`}><strong>{t("Competência:")}</strong> <span data-i18n-ignore>{course.relatedSkills.join(", ")}</span> · <strong>{t("Custo:")}</strong> {t(course.cost)} · <strong>{t("Nível:")}</strong> {t(course.level || "Consulte a plataforma")}</p>
                <p className={`mt-2 text-sm ${muted}`}><strong>{t("Pré-requisitos:")}</strong> {t(course.prerequisites)}</p>
                {course.project && <div className={`mt-4 rounded-xl p-4 ${isDark ? "bg-slate-800" : "bg-indigo-50"}`}>
                  <h4 className="font-semibold">{t("Projeto sugerido:")} {t(course.project.title)}</h4>
                  <p className={`mt-1 text-sm ${muted}`}>{t(course.project.description)}</p>
                  <p className={`mt-2 text-sm ${muted}`}><strong>{t("Funcionalidades:")}</strong> {course.project.features.map((feature) => t(feature)).join(" · ")}</p>
                  <p className={`mt-2 text-sm ${muted}`}><strong>{t("Tecnologias:")}</strong> <span data-i18n-ignore>{course.project.technologies.join(", ")}</span></p>
                  <p className={`mt-2 text-sm ${muted}`}><strong>{t("Como fortalece o portfólio:")}</strong> {t("O projeto demonstra {{skills}} por meio de código, testes e documentação pública.").replace("{{skills}}", course.relatedSkills.join(", "))}</p>
                  {course.relatedJobs.length > 0 && <p className={`mt-2 text-sm ${muted}`}><strong>{t("Vagas relacionadas:")}</strong> <span data-i18n-ignore>{course.relatedJobs.map((job) => `${job.title} — ${job.company}`).join("; ")}</span></p>}
                </div>}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className={`text-sm ${muted}`}>{t("Acompanhamento do curso")}<select value={course.progress.status} onChange={(event) => saveProgress(course.id, { status: event.target.value })} disabled={saving === course.id} className="mt-1 w-full rounded-lg border border-slate-300 bg-transparent p-2 text-inherit">
                    {courseStatuses.map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}
                  </select></label>
                  <label className={`text-sm ${muted}`}>{t("Acompanhamento do projeto")}<select value={course.progress.projectStatus} onChange={(event) => saveProgress(course.id, { projectStatus: event.target.value })} disabled={saving === course.id} className="mt-1 w-full rounded-lg border border-slate-300 bg-transparent p-2 text-inherit">
                    {projectStatuses.map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}
                  </select></label>
                </div>
                <label className={`mt-3 block text-sm ${muted}`}>{t("Competências adquiridas (confirme manualmente, separadas por vírgula)")}<input value={skillDrafts[course.id] || ""} onChange={(event) => setSkillDrafts((current) => ({ ...current, [course.id]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 bg-transparent p-2 text-inherit" placeholder={t("Ex.: Docker, containers")} /></label>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className={`text-sm ${muted}`}>{course.cost} · {course.level || "Nível varia"}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => saveProgress(course.id, { acquiredSkills: (skillDrafts[course.id] || "").split(",").map((skill) => skill.trim()).filter(Boolean) })} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><Save size={16} /> {t("Salvar competências")}</button>
                    <a href={course.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white">{t("Acessar curso")} <ExternalLink size={16} /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
