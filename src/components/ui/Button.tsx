import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#A53860] hover:bg-[#8a2e50] text-white',
    secondary: 'bg-[#FFA5AB] hover:bg-[#DA627D] dark:bg-[#6f2440] dark:hover:bg-[#8a2e50] text-[#450920] dark:text-[#F9DBBD]',
    danger: 'bg-[#DA627D] hover:bg-[#A53860] text-white',
    success: 'bg-[#A53860] hover:bg-[#8a2e50] text-white',
  };

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
