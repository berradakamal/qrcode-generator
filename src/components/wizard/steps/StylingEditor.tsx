'use client';

import { QRStudio } from '@/components/qr-studio/QRStudio';
import type { QRTemplate } from '@/types/qr-template';

interface StylingEditorProps {
  styling: QRTemplate;
  onStylingChange: (styling: QRTemplate) => void;
  qrData: string;
}

export function StylingEditor({
  styling,
  onStylingChange,
  qrData,
}: StylingEditorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customize Your QR Code
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Style your QR code with colors, patterns, and branding
        </p>
      </div>

      <QRStudio
        mode="wizard"
        initialContent={qrData}
        initialTemplate={styling}
        onTemplateChange={onStylingChange}
        showSaveButton={false}
      />
    </div>
  );
}
