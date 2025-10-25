import React from 'react';
import { TimeAvailability } from '../../types';
import { Card } from '../ui/Card';

interface TimeAvailabilityCheckProps {
  onSubmit: (availability: TimeAvailability) => void;
}

export function TimeAvailabilityCheck({ onSubmit }: TimeAvailabilityCheckProps) {
  const options: { value: TimeAvailability; label: string; description: string }[] = [
    {
      value: 'limited',
      label: 'Very limited time',
      description: 'I have less time than usual today',
    },
    {
      value: 'normal',
      label: 'Normal day',
      description: 'A regular day for me',
    },
    {
      value: 'extra',
      label: 'Extra time today',
      description: 'I have more time than usual',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bangers text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.9)] mb-4 transform -rotate-2 animate-pulse">
           HOW MUCH TIME YOU GOT?!
        </h1>
      </div>

      <div className="space-y-6">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onSubmit(option.value)}
            className="w-full"
          >
            <div className={`p-6 rounded-2xl cursor-pointer transition-all hover:shadow-2xl hover:scale-110 active:scale-95 border-4 border-black ${
              index === 0 ? 'bg-neon-pink transform -rotate-1 hover:rotate-1' :
              index === 1 ? 'bg-neon-cyan transform rotate-1 hover:-rotate-1' :
              'bg-neon-yellow transform -rotate-1 hover:rotate-2'
            }`}>
              <div className="flex items-center justify-center py-2">
                <h3 className={`text-2xl font-bold ${
                  index === 0 ? 'font-shrikhand text-white' :
                  index === 1 ? 'font-sans text-black' :
                  'font-bangers text-black'
                }`}>
                  {option.label.toUpperCase()}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
