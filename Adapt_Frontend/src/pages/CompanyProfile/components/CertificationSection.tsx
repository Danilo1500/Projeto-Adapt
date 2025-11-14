import React from "react";
import { Award } from "lucide-react";

interface Certification {
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

interface CertificationSectionProps {
  certifications: Certification[];
}

export const CertificationSection: React.FC<CertificationSectionProps> = ({
  certifications,
}) => {
  return (
    <div className="px-6 md:px-10 py-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Award className="w-4 h-4 text-amber-600" />
        </div>
        <h3 className="text-gray-900">Certificações</h3>
      </div>
      <div className="grid gap-3">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:border-indigo-200 hover:shadow-lg transition-all duration-200"
          >
            <div>
              <div className="text-gray-900">{cert.name}</div>
              <div className="text-gray-500 text-sm">
                {cert.issuer} • {cert.year}
              </div>
            </div>
            {cert.url && (
              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Ver
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
