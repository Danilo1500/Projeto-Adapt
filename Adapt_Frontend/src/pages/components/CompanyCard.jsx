import React from "react";
import { Building2, Globe2, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CompanyCard = ({ company, onJoin }) => {
  const handleVisitSite = () => {
    if (company.website) {
      window.open(company.website, "_blank");
    }
  };

  return (
    <div className="flex w-80 flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow transition-shadow duration-300 hover:shadow-lg">
      <div>
        <div className="text-center">
          <div className="relative mx-auto h-20 w-20">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <Building2 className="h-8 w-8" />
              </div>
            )}
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-900">{company.name}</p>
          <p className="text-sm text-gray-500">{company.industry || "Setor nao informado"}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
          {company.location && (
            <div className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1">
              <MapPin className="h-4 w-4 text-rose-500" /> {company.location}
            </div>
          )}

          <div className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1">
            <Users className="h-4 w-4 text-indigo-500" /> {company.memberCount || 0} membros
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handleVisitSite}
            disabled={!company.website}
            className={`w-full rounded-md py-2 transition ${
              company.website
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Globe2 className="h-4 w-4" />
              {company.website ? "Visitar Site" : "Sem site"}
            </span>
          </button>

          <Link
            to={`/company/${company._id}`}
            className="flex w-16 items-center justify-center rounded-md border text-slate-500 transition hover:bg-gray-50"
          >
            <Building2 className="h-5 w-5" />
          </Link>
        </div>

        {!company.isOwner && !company.isMember && (
          <button
            onClick={() => onJoin(company._id)}
            className="w-full rounded-md border border-indigo-200 bg-indigo-50 py-2 text-sm text-indigo-700 transition hover:bg-indigo-100"
          >
            Participar da empresa
          </button>
        )}

        {company.isOwner && (
          <div className="rounded-md bg-emerald-50 py-2 text-center text-sm text-emerald-700">
            Voce e dono
          </div>
        )}

        {company.isMember && !company.isOwner && (
          <div className="rounded-md bg-indigo-50 py-2 text-center text-sm text-indigo-700">
            Voce ja participa
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
