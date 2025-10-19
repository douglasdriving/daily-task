import React, { useState } from 'react';
import { TimeAvailability } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface TimeAvailabilityCheckProps {
  onSubmit: (availability: TimeAvailability) => void;
}

export function TimeAvailabilityCheck({ onSubmit }: TimeAvailabilityCheckProps) {
  const [selected, setSelected] = useState<TimeAvailability | null>(null);

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

  const handleSubmit = () => {
    if (selected) {
      onSubmit(selected);
    }
  };

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
          <Card
            key={option.value}
            className={`cursor-pointer transition-all ${
              selected === option.value
                ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelected(option.value)}
          >
            <div className="flex items-start">
              <input
                type="radio"
                checked={selected === option.value}
                onChange={() => setSelected(option.value)}
                className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3 flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {option.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
