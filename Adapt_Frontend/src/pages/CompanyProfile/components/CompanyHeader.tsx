import React from "react";
import { Building2, MapPin, Globe2, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CompanyHeaderProps {
  name: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  cover?: string;
  logo?: string;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  name,
  industry,
  size,
  location,
  website,
  cover,
  logo,
}) => {
  return (
    <>
      {/* Capa */}
      <div className="relative h-48 md:h-64 bg-gray-200">
        {cover && (
          <ImageWithFallback
            src={cover}
            alt="Capa da empresa"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Informações principais */}
      <div className="-mt-16 md:-mt-20 px-6 md:px-10 pb-6 flex items-end gap-4 relative z-10">
        <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center">
          {logo ? (
            <ImageWithFallback
              src={logo}
              alt="Logo"
              className="object-contain w-full h-full"
            />
          ) : (
            <Building2 className="text-indigo-600 w-10 h-10" />
          )}
        </div>

        <div className="text-white">
          <h1 className="text-2xl md:text-3xl">{name}</h1>
          <p className="text-shadow-gray-200 text-sm md:text-base">
            {industry}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-gray-500 mt-5 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {size}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {location}
            </div>
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-600 hover:underline"
              >
                <Globe2 className="w-4 h-4" /> Site
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
