'use client';

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSave?: () => void;
  canProceed: boolean;
  isSaving?: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSave,
  canProceed,
  isSaving = false,
}: WizardNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={onBack}
        disabled={isFirstStep}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${
            isFirstStep
              ? 'opacity-0 pointer-events-none'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      {isLastStep ? (
        <button
          onClick={onSave}
          disabled={!canProceed || isSaving}
          className={`
            flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
            ${
              canProceed && !isSaving
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Create QR Code'
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
            ${
              canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
