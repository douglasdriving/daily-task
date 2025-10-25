import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#450920] dark:text-[#F9DBBD] mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border border-[#DA627D] dark:border-[#8a2e50] rounded-lg
          focus:outline-none focus:ring-2 focus:ring-[#A53860] dark:focus:ring-[#FFA5AB]
          bg-white dark:bg-[#5a1d34] text-[#450920] dark:text-[#F9DBBD]
          ${error ? 'border-[#DA627D]' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-[#DA627D] dark:text-[#FFA5AB]">{error}</p>
      )}
    </div>
  );
}
