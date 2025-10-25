import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#450920] dark:text-[#F9DBBD] mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border border-[#DA627D] dark:border-[#8a2e50] rounded-lg
          focus:outline-none focus:ring-2 focus:ring-[#A53860] dark:focus:ring-[#FFA5AB]
          bg-white dark:bg-[#5a1d34] text-[#450920] dark:text-[#F9DBBD]
          ${error ? 'border-[#DA627D]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#DA627D] dark:text-[#FFA5AB]">{error}</p>
      )}
    </div>
  );
}
