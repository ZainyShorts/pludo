import React from 'react';
import { cn } from '@/lib/utils';
import { templateOptions } from '@/lib/utils';
import { LayoutTemplate, Paintbrush, Briefcase, Sparkles, Crown } from 'lucide-react';

interface TemplateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ value, onChange, className }) => {
  // Map of template values to their respective icons
  const iconMap = {
    corporate: <Briefcase className="w-5 h-5 mb-2" />,
    creative: <Paintbrush className="w-5 h-5 mb-2" />,
    minimal: <LayoutTemplate className="w-5 h-5 mb-2" />,
    bold: <Sparkles className="w-5 h-5 mb-2" />,
    elegant: <Crown className="w-5 h-5 mb-2" />,
  };

  return (
    <div className={cn("grid grid-cols-2 sm:gird-cols-3  gap-3", className)}>
      {templateOptions.map((template) => (
        <button
          key={template.value}
          type="button"
          onClick={() => onChange(template.value)}
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200",
            "border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm",
            value === template.value
              ? "border-primary bg-neutral-800/80 text-white shadow-lg"
              : "text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/40 hover:text-white"
          )}
        >
          {iconMap[template.value as keyof typeof iconMap]}
          <span className="text-sm font-medium">{template.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TemplateSelector;