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
        <h1 className="text-5xl font-serif font-semibold text-zen-bark dark:text-gray-100 mb-4">
          Good morning
        </h1>
        <p className="text-xl font-light text-zen-earth dark:text-gray-400">
          How is your available time today?
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSubmit(option.value)}
            className="w-full"
          >
            <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 active:scale-100">
              <div className="flex items-center justify-center py-2">
                <div className="flex-1 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
