import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#5a1d34] rounded-lg shadow-md p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
