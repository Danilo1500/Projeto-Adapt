import { Flag, X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { requestWithAuth } from "../../utils/authRequest";

export const REPORT_REASONS = [
  "Assédio ou intimidação",
  "Discurso de ódio",
  "Conteúdo sexual explícito",
  "Violência ou ameaças",
  "Spam",
  "Golpe ou fraude",
  "Informações pessoais expostas",
  "Vaga de emprego falsa",
  "Conteúdo enganoso",
  "Outro",
];

const ReportContentDialog = ({ open, onClose, contentType, contentId }) => {
  const { getToken } = useAuth();
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await requestWithAuth(getToken, async (headers) => {
        const { data } = await api.post("/api/moderation/report", {
          contentType,
          contentId,
          reason,
          description: description.trim(),
        }, { headers });
        if (!data.success) throw new Error(data.message);
      });
      toast.success("Denúncia enviada para análise.");
      setDescription("");
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Não foi possível enviar a denúncia.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"><Flag className="h-5 w-5 text-red-500" /> Denunciar conteúdo</h2>
          <button type="button" onClick={onClose} aria-label="Fechar"><X className="h-5 w-5 text-gray-500" /></button>
        </div>
        <label className="mt-5 block text-sm font-medium text-gray-700 dark:text-slate-300">
          Motivo
          <select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
            {REPORT_REASONS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-slate-300">
          Detalhes opcional
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} rows={4} className="mt-1 w-full resize-none rounded-lg border border-gray-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm dark:border-slate-700">Cancelar</button>
          <button type="submit" disabled={submitting} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-60">{submitting ? "Enviando..." : "Enviar denúncia"}</button>
        </div>
      </form>
    </div>
  );
};

export default ReportContentDialog;
