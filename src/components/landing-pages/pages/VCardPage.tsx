'use client';

import { User, Mail, Phone, MapPin, Globe, Building, Briefcase, Download } from 'lucide-react';
import type { QRCodeDocument } from '@/types/qr-code';
import type { VCardContent } from '@/types/qr-content';

interface VCardPageProps {
  qrCode: QRCodeDocument;
}

export function VCardPage({ qrCode }: VCardPageProps) {
  const content = qrCode.content as VCardContent;
  const fullName = `${content.firstName} ${content.lastName}`.trim();

  const downloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${fullName}`,
      `N:${content.lastName};${content.firstName};;;`,
      content.company ? `ORG:${content.company}` : '',
      content.title ? `TITLE:${content.title}` : '',
      content.email ? `EMAIL:${content.email}` : '',
      content.phone ? `TEL:${content.phone}` : '',
      content.website ? `URL:${content.website}` : '',
      content.address ? `ADR:;;${content.address};;;;` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName.replace(/\s+/g, '_')}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-500 p-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-white/20 mb-4">
              {content.photoUrl ? (
                <img
                  src={content.photoUrl}
                  alt={fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{fullName}</h1>
            {content.title && (
              <p className="text-indigo-100 mt-1">{content.title}</p>
            )}
            {content.company && (
              <p className="text-indigo-200 text-sm mt-1">{content.company}</p>
            )}
          </div>

          <div className="p-6 space-y-3">
            {content.email && (
              <a
                href={`mailto:${content.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-700">{content.email}</span>
              </a>
            )}

            {content.phone && (
              <a
                href={`tel:${content.phone}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-700">{content.phone}</span>
              </a>
            )}

            {content.website && (
              <a
                href={content.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-700 truncate">{content.website}</span>
              </a>
            )}

            {content.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(content.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-700">{content.address}</span>
              </a>
            )}

            {content.socials && content.socials.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-3">Social Links</p>
                <div className="space-y-2">
                  {content.socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-indigo-500" />
                      <span className="text-gray-700">{social.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={downloadVCard}
              className="w-full mt-4 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Save Contact
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by QRG
        </p>
      </div>
    </div>
  );
}
