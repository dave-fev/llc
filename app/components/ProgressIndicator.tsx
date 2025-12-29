'use client';

import React from 'react';
import * as Progress from '@radix-ui/react-progress';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Desktop View - Full Horizontal Layout */}
      <div className="hidden md:block">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Registration Progress</h3>
              <p className="text-xs text-neutral-500 font-medium">Step {currentStep + 1} of {totalSteps}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-neutral-900 mb-1">{Math.round(progress)}%</div>
            <div className="text-xs text-neutral-500 font-medium">Complete</div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <Progress.Root
            className="relative h-4 w-full overflow-hidden rounded-full bg-neutral-100 shadow-inner border border-neutral-200"
            value={progress}
          >
            <Progress.Indicator
              className="h-full w-full bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 transition-transform duration-1000 ease-out shadow-lg relative overflow-hidden"
              style={{ transform: `translateX(-${100 - progress}%)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </Progress.Indicator>
          </Progress.Root>
        </div>

        {/* Desktop Steps - Full Layout */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-neutral-200 -z-0">
            <div
              className="h-full bg-gradient-to-r from-neutral-800 to-neutral-900 transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="flex justify-between items-start relative z-10">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isUpcoming = index > currentStep;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 max-w-[140px] group"
                >
                  {/* Step Circle */}
                  <div
                    className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-black text-base mb-4 transition-all duration-500 transform ${
                      isCompleted
                        ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 text-white shadow-xl scale-110 hover:scale-115'
                        : isCurrent
                        ? 'bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-2xl scale-125 ring-4 ring-neutral-200 ring-offset-2 animate-pulse-slow'
                        : 'bg-white text-neutral-400 border-2 border-neutral-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className={isCurrent ? 'text-lg' : ''}>{index + 1}</span>
                    )}
                    
                    {/* Current Step Glow Effect */}
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-2xl bg-neutral-900 opacity-50 animate-ping"></div>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="text-center">
                    <span
                      className={`block text-sm font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'text-neutral-900'
                          : isCurrent
                          ? 'text-neutral-900 text-base'
                          : 'text-neutral-400'
                      }`}
                    >
                      {step}
                    </span>
                    {isCurrent && (
                      <span className="block text-xs text-neutral-500 mt-1 font-medium">Current</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View - Compact Vertical Layout */}
      <div className="md:hidden">
        {/* Mobile Header - Only Progress */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-neutral-900">Step {currentStep + 1} of {totalSteps}</h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">{steps[currentStep]}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-neutral-900">{Math.round(progress)}%</div>
            <div className="text-xs text-neutral-500 font-medium">Complete</div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div>
          <Progress.Root
            className="relative h-3.5 w-full overflow-hidden rounded-full bg-neutral-100 shadow-inner border border-neutral-200"
            value={progress}
          >
            <Progress.Indicator
              className="h-full w-full bg-gradient-to-r from-neutral-800 to-neutral-900 transition-transform duration-1000 ease-out shadow-md"
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </Progress.Root>
        </div>
      </div>
    </div>
  );
}
