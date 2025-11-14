import React from "react";

interface CompanyDescriptionProps {
  description: string;
}

export const CompanyDescription: React.FC<CompanyDescriptionProps> = ({
  description,
}) => {
  return (
    <div className="px-6 md:px-10 pb-6 border-b border-gray-100">
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};
