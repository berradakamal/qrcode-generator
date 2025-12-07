'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { TypeSelector } from './steps/TypeSelector';
import { ContentEditor } from './steps/ContentEditor';
import { StylingEditor } from './steps/StylingEditor';
import { PreviewSave } from './steps/PreviewSave';
import { useWizardState } from './hooks/useWizardState';
import { qrcodesApi } from '@/lib/api';
import { generateQRData } from '@/lib/qr-encoder';
import type { QRCodeType, QRCodeDocument } from '@/types/qr-code';
import type { QRTemplate } from '@/types/qr-template';

interface QRWizardProps {
  initialType?: QRCodeType;
  initialStyling?: QRTemplate;
  onComplete?: (qrCode: QRCodeDocument) => void;
  onCancel?: () => void;
}

const STEPS = [
  { label: 'Type', description: 'Choose QR type' },
  { label: 'Content', description: 'Add your info' },
  { label: 'Style', description: 'Customize look' },
  { label: 'Save', description: 'Name & create' },
];

export function QRWizard({
  initialType,
  initialStyling,
  onComplete,
  onCancel,
}: QRWizardProps) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, actions] = useWizardState(initialType, initialStyling);

  const handleSave = async () => {
    if (!session?.user?.id) {
      setError('You must be signed in to create a QR code');
      return;
    }

    if (!state.selectedType || !state.content) {
      setError('Please complete all steps');
      return;
    }

    if (!state.name.trim()) {
      setError('Please enter a name for your QR code');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await qrcodesApi.create({
        type: state.selectedType,
        name: state.name.trim(),
        content: state.content,
        styling: state.styling,
      });

      const qrCode: QRCodeDocument = {
        id: response.qrCode._id,
        userId: response.qrCode.userId,
        type: response.qrCode.type as QRCodeType,
        name: response.qrCode.name,
        shortCode: response.qrCode.shortCode,
        status: response.qrCode.status,
        content: response.qrCode.content,
        styling: response.qrCode.styling as QRTemplate,
        analytics: {
          totalScans: response.qrCode.analytics.totalScans,
          uniqueScans: response.qrCode.analytics.uniqueScans,
          lastScanAt: response.qrCode.analytics.lastScanAt ? new Date(response.qrCode.analytics.lastScanAt) : null,
        },
        createdAt: new Date(response.qrCode.createdAt),
        updatedAt: new Date(response.qrCode.updatedAt),
      };

      onComplete?.(qrCode);
    } catch (err) {
      console.error('Failed to create QR code:', err);
      setError('Failed to create QR code. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <TypeSelector
            selectedType={state.selectedType}
            onSelect={(type) => {
              actions.setType(type);
              actions.nextStep();
            }}
          />
        );
      case 1:
        return state.selectedType && state.content ? (
          <ContentEditor
            type={state.selectedType}
            content={state.content}
            onChange={actions.updateContent}
            userId={session?.user?.id}
          />
        ) : null;
      case 2:
        return state.selectedType && state.content ? (
          <StylingEditor
            styling={state.styling}
            onStylingChange={actions.setStyling}
            qrData={generateQRData(state.selectedType, state.content)}
          />
        ) : null;
      case 3:
        return state.selectedType ? (
          <PreviewSave
            type={state.selectedType}
            name={state.name}
            onNameChange={actions.setName}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create QR Code
        </h1>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6">
        <WizardProgress currentStep={state.currentStep} steps={STEPS} />

        <div className="mt-8 min-h-[400px]">{renderStep()}</div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <WizardNavigation
          currentStep={state.currentStep}
          totalSteps={STEPS.length}
          onBack={actions.prevStep}
          onNext={actions.nextStep}
          onSave={handleSave}
          canProceed={actions.canProceed()}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
