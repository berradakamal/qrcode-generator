import { notFound } from 'next/navigation';
import { LandingPageRenderer } from '@/components/landing-pages/LandingPageRenderer';
import type { QRCodeDocument, QRCodeType } from '@/types/qr-code';
import type { QRTemplate } from '@/types/qr-template';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

async function getQRCodeByShortCode(shortCode: string): Promise<QRCodeDocument | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/qr/${shortCode}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (!data.qrCode) {
      return null;
    }

    return {
      id: data.qrCode.id,
      userId: '',
      type: data.qrCode.type as QRCodeType,
      name: data.qrCode.name,
      shortCode: data.qrCode.shortCode,
      status: data.qrCode.status,
      content: data.qrCode.content,
      styling: data.qrCode.styling as QRTemplate,
      analytics: { totalScans: 0, uniqueScans: 0, lastScanAt: null },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch {
    return null;
  }
}

export default async function ContentPage({ params }: PageProps) {
  const { shortCode } = await params;

  const qrCode = await getQRCodeByShortCode(shortCode);

  if (!qrCode) {
    notFound();
  }

  if (qrCode.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            QR Code Paused
          </h1>
          <p className="text-gray-600">
            This QR code is currently not active.
          </p>
        </div>
      </div>
    );
  }

  return <LandingPageRenderer qrCode={qrCode} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { shortCode } = await params;
  const qrCode = await getQRCodeByShortCode(shortCode);

  if (!qrCode) {
    return { title: 'Not Found' };
  }

  return {
    title: qrCode.name,
    description: `View ${qrCode.name}`,
  };
}
