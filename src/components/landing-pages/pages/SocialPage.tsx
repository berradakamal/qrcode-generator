'use client';

import { ExternalLink } from 'lucide-react';
import type { QRCodeDocument } from '@/types/qr-code';
import type { SocialContent } from '@/types/qr-content';

interface SocialPageProps {
  qrCode: QRCodeDocument;
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  tiktok: 'bg-black',
  youtube: 'bg-red-600',
  twitter: 'bg-black',
  linkedin: 'bg-blue-700',
  facebook: 'bg-blue-600',
  github: 'bg-gray-900',
  spotify: 'bg-green-500',
  website: 'bg-gray-700',
  email: 'bg-gray-600',
  phone: 'bg-green-600',
  other: 'bg-gray-500',
};

export function SocialPage({ qrCode }: SocialPageProps) {
  const content = qrCode.content as SocialContent;

  const themeClasses = {
    light: 'bg-gray-50 text-gray-900',
    dark: 'bg-gray-900 text-white',
    gradient: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white',
  };

  const buttonClasses = {
    light: 'bg-white hover:bg-gray-100 text-gray-900 shadow-md',
    dark: 'bg-gray-800 hover:bg-gray-700 text-white',
    gradient: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm',
  };

  return (
    <div className={`min-h-screen ${themeClasses[content.theme]} py-12 px-4`}>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          {content.avatarUrl ? (
            <img
              src={content.avatarUrl}
              alt={content.displayName}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center">
              <span className="text-3xl font-bold">
                {content.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <h1 className="text-2xl font-bold">{content.displayName}</h1>
          {content.bio && (
            <p className={`mt-2 ${content.theme === 'light' ? 'text-gray-600' : 'text-white/80'}`}>
              {content.bio}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {content.links
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full p-4 rounded-xl font-semibold text-center transition-transform hover:scale-[1.02] ${buttonClasses[content.theme]}`}
              >
                <span className="flex items-center justify-center gap-2">
                  {link.label || link.platform}
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </span>
              </a>
            ))}
        </div>

        <p className={`text-center text-xs mt-8 ${content.theme === 'light' ? 'text-gray-400' : 'text-white/50'}`}>
          Powered by QRG
        </p>
      </div>
    </div>
  );
}
