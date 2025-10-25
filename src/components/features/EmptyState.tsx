import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  type: 'completed' | 'noTasks';
}

export function EmptyState({ type }: EmptyStateProps) {
  const navigate = useNavigate();

  if (type === 'completed') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="mb-12">
          <div className="text-9xl mb-8 animate-bounce">✓</div>
          <h1 className="text-6xl font-bangers text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)] mb-4 transform rotate-2">
            CRUSHED IT!
          </h1>
          <p className="text-2xl font-shrikhand text-white drop-shadow-lg">
            You're a CHAMPION!
          </p>
        </div>

        <div className="bg-neon-yellow/90 rounded-3xl p-8 mb-8 border-8 border-black transform -rotate-1">
          <p className="text-black font-sans text-2xl">
            Take a break. You earned it! 🎉
          </p>
        </div>

        <button
          onClick={() => navigate('/tasks')}
          className="px-8 py-4 rounded-2xl text-xl font-shrikhand bg-neon-cyan text-black hover:bg-neon-lime transition-all shadow-2xl hover:shadow-neon-pink hover:scale-105 border-4 border-black"
        >
          VIEW ALL TASKS
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="mb-12">
        <div className="text-9xl mb-8 animate-pulse">📝</div>
        <h1 className="text-5xl font-bangers text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)] mb-2 transform -rotate-2">
          NO TASKS YET!
        </h1>
      </div>

      <button
        onClick={() => navigate('/tasks/new')}
        className="px-10 py-6 rounded-2xl text-3xl font-bangers bg-neon-lime text-black hover:bg-neon-yellow transition-all shadow-2xl hover:shadow-neon-orange hover:scale-110 border-4 border-black transform rotate-1 hover:-rotate-1"
      >
        + ADD YOUR FIRST TASK
      </button>
    </div>
  );
}
