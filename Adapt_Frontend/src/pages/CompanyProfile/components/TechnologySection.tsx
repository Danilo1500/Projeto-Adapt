import React from "react";
import { Code2 } from "lucide-react";

interface TechnologySectionProps {
  technologies: string[];
}

export const TechnologySection: React.FC<TechnologySectionProps> = ({
  technologies,
}) => {
  return (
    <div className="px-6 md:px-10 py-6 border-b border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Code2 className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-gray-900">Tecnologias Utilizadas</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};
