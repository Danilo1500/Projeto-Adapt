import React from "react";
import { Building2, Globe2, MapPin, Users } from "lucide-react";

const CompanyCard = ({ company }) => {
  const handleVisitSite = () => {
    if (company.website) {
      window.open(company.website, "_blank");
    }
  };

  return (
    <div
      key={company._id}
      className="p-5 flex flex-col justify-between w-80 shadow border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 bg-white"
    >
      {/* Header com logo */}
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto">
          <img
            src={company.logo || "https://via.placeholder.com/100"}
            alt={company.name}
            className="rounded-full w-full h-full object-cover shadow-md"
          />
        </div>
        <p className="mt-4 font-semibold text-lg text-gray-900">{company.name}</p>
        <p className="text-gray-500 text-sm">{company.industry}</p>
      </div>

      {/* Informações principais */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-gray-600">
        {company.location && (
          <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
            <MapPin className="w-4 h-4 text-rose-500" /> {company.location}
          </div>
        )}

        {company.size && (
          <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
            <Users className="w-4 h-4 text-indigo-500" /> {company.size}
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex mt-5 gap-2">
        <button
          onClick={handleVisitSite}
          disabled={!company.website}
          className={`w-full py-2 rounded-md flex justify-center items-center gap-2 ${
            company.website
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          } active:scale-95 transition`}
        >
          <Globe2 className="w-4 h-4" />
          {company.website ? "Visitar Site" : "Sem site"}
        </button>

        <button className="flex items-center justify-center w-16 border text-slate-500 group rounded-md cursor-pointer active:scale-95 transition hover:bg-gray-50">
          <Building2 className="w-5 h-5 group-hover:scale-105 transition" />
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;
