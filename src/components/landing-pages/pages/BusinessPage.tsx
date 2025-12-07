'use client';

import { MapPin, Phone, Mail, Globe, Clock, ExternalLink } from 'lucide-react';
import type { QRCodeDocument } from '@/types/qr-code';
import type { BusinessContent } from '@/types/qr-content';

interface BusinessPageProps {
  qrCode: QRCodeDocument;
}

export function BusinessPage({ qrCode }: BusinessPageProps) {
  const content = qrCode.content as BusinessContent;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = content.hours.find((h) => h.day === today);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {content.coverUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={content.coverUrl}
            alt={content.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className={`text-center ${content.coverUrl ? '-mt-16 relative z-10' : ''}`}>
          {content.logoUrl ? (
            <img
              src={content.logoUrl}
              alt={content.name}
              className="w-24 h-24 rounded-xl mx-auto mb-4 object-cover bg-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl mx-auto mb-4 bg-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">
                {content.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{content.name}</h1>
          {content.description && (
            <p className="text-gray-600 mt-2">{content.description}</p>
          )}
        </div>

        <div className="mt-8 space-y-4">
          {todayHours && (
            <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Today&apos;s Hours</p>
                  <p className="font-semibold text-gray-900">
                    {todayHours.isClosed
                      ? 'Closed'
                      : `${todayHours.open} - ${todayHours.close}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {content.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(content.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <MapPin className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold text-gray-900">{content.address}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          )}

          {content.phone && (
            <a
              href={`tel:${content.phone}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">{content.phone}</p>
              </div>
            </a>
          )}

          {content.email && (
            <a
              href={`mailto:${content.email}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{content.email}</p>
              </div>
            </a>
          )}

          {content.website && (
            <a
              href={content.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Website</p>
                <p className="font-semibold text-gray-900 truncate">{content.website}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          )}

          {content.services && content.services.length > 0 && (
            <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Services</p>
              <div className="flex flex-wrap gap-2">
                {content.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {content.hours && content.hours.length > 0 && (
            <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Business Hours</p>
              <div className="space-y-2">
                {content.hours.map((hours) => (
                  <div
                    key={hours.day}
                    className={`flex justify-between text-sm ${
                      hours.day === today ? 'font-semibold' : ''
                    }`}
                  >
                    <span className="text-gray-600">{hours.day}</span>
                    <span className="text-gray-900">
                      {hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.socials && content.socials.length > 0 && (
            <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Follow Us</p>
              <div className="flex flex-wrap gap-3">
                {content.socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Powered by QRG
        </p>
      </div>
    </div>
  );
}
