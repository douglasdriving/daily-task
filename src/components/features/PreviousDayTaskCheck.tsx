import React from 'react';
import { Task } from '../../types';
import { Card } from '../ui/Card';

interface PreviousDayTaskCheckProps {
  task: Task;
  onCompleted: () => void;
  onNotCompleted: () => void;
}

export function PreviousDayTaskCheck({ task, onCompleted, onNotCompleted }: PreviousDayTaskCheckProps) {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bangers text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.9)] mb-6 transform -rotate-2">
          WAIT A SEC! 🤔
        </h1>
        <p className="text-xl font-sans text-white drop-shadow-lg mb-4">
          Yesterday you were supposed to do:
        </p>
        <div className="bg-white/90 dark:bg-black/80 p-6 rounded-2xl border-6 border-black mb-6">
          <h2 className="text-3xl font-shrikhand text-black dark:text-white">
            {task.name}
          </h2>
        </div>
        <p className="text-2xl font-bangers text-white drop-shadow-lg">
          DID YOU DO IT?!
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onCompleted}
          className="w-full px-8 py-6 rounded-2xl text-3xl font-bangers bg-neon-lime text-black hover:bg-neon-yellow transition-all shadow-2xl hover:scale-105 border-4 border-black transform -rotate-1 hover:rotate-1"
        >
          ✓ YES I DID!
        </button>

        <button
          onClick={onNotCompleted}
          className="w-full px-8 py-6 rounded-2xl text-3xl font-shrikhand bg-neon-pink text-white hover:bg-neon-purple transition-all shadow-2xl hover:scale-105 border-4 border-black transform rotate-1 hover:-rotate-1"
        >
          Nope... 😔
        </button>
      </div>
    </div>
  );
}
