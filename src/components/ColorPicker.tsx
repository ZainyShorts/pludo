import React from 'react';
import { cn } from '@/lib/utils';

interface ColorOption {
  value: string;
  bgClass: string;
}

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, className }) => {
  const colorOptions: ColorOption[] = [
    { value: '#0f172a', bgClass: 'bg-slate-900' },
    { value: '#1e40af', bgClass: 'bg-blue-800' },
    { value: '#047857', bgClass: 'bg-emerald-800' },
    { value: '#b91c1c', bgClass: 'bg-red-700' },
    { value: '#a21caf', bgClass: 'bg-fuchsia-700' },
    { value: '#c2410c', bgClass: 'bg-orange-700' },
    { value: '#0f766e', bgClass: 'bg-teal-700' },
    { value: '#4338ca', bgClass: 'bg-indigo-700' },
    { value: '#000000', bgClass: 'bg-black' },
    { value: '#64748b', bgClass: 'bg-slate-500' },
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {colorOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
            option.bgClass,
            value === option.value ? "ring-2 ring-white ring-offset-2 ring-offset-background" : "hover:scale-110"
          )}
          title={option.value}
          aria-label={`Select color ${option.value}`}
        >
          {value === option.value && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </button>
      ))}
      
      <button
        type="button"
        onClick={() => document.getElementById('customColor')?.click()}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center hover:scale-110 transition-all duration-200"
        title="Custom color"
      >
        <span className="sr-only">Custom color</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M12 20v-8"></path>
          <path d="M12 12l-8-8"></path>
          <path d="M12 12l8-8"></path>
          <path d="M4 20h16"></path>
        </svg>
      </button>
      
      <input
        id="customColor"
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
};

export default ColorPicker;