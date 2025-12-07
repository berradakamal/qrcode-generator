import type { QRCodeType } from '@/types/qr-code';
import type {
  QRContentData,
  WiFiContent,
  VCardContent,
  WhatsAppContent,
  AppsContent,
  EventContent,
} from '@/types/qr-content';

export function generateQRData(type: QRCodeType, content: QRContentData): string {
  switch (type) {
    case 'wifi': {
      const wifi = content as WiFiContent;
      const hidden = wifi.isHidden ? 'H:true;' : '';
      return `WIFI:T:${wifi.securityType};S:${escapeWifiString(wifi.ssid)};P:${escapeWifiString(wifi.password)};${hidden};`;
    }

    case 'vcard': {
      const vcard = content as VCardContent;
      return generateVCard(vcard);
    }

    case 'whatsapp': {
      const wa = content as WhatsAppContent;
      const phone = wa.phoneNumber.replace(/\D/g, '');
      if (wa.prefilledMessage) {
        return `https://wa.me/${phone}?text=${encodeURIComponent(wa.prefilledMessage)}`;
      }
      return `https://wa.me/${phone}`;
    }

    case 'apps': {
      const apps = content as AppsContent;
      return apps.fallbackUrl || apps.iosUrl || apps.androidUrl || 'https://qrg.app/preview';
    }

    case 'event': {
      const event = content as EventContent;
      return generateICalEvent(event);
    }

    default:
      return 'https://qrg.app/preview';
  }
}

function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

function generateVCard(vcard: VCardContent): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${vcard.lastName || ''};${vcard.firstName || ''};;;`,
    `FN:${vcard.firstName || ''} ${vcard.lastName || ''}`.trim(),
  ];

  if (vcard.company) {
    lines.push(`ORG:${vcard.company}`);
  }

  if (vcard.title) {
    lines.push(`TITLE:${vcard.title}`);
  }

  if (vcard.email) {
    lines.push(`EMAIL:${vcard.email}`);
  }

  if (vcard.phone) {
    lines.push(`TEL:${vcard.phone}`);
  }

  if (vcard.website) {
    lines.push(`URL:${vcard.website}`);
  }

  if (vcard.address) {
    lines.push(`ADR:;;${vcard.address};;;;`);
  }

  if (vcard.photoUrl) {
    lines.push(`PHOTO;VALUE=URI:${vcard.photoUrl}`);
  }

  vcard.socials?.forEach(social => {
    if (social.url) {
      lines.push(`X-SOCIALPROFILE;TYPE=${social.platform}:${social.url}`);
    }
  });

  lines.push('END:VCARD');

  return lines.join('\n');
}

function generateICalEvent(event: EventContent): string {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QRG//QR Code Generator//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.startDate)}`,
  ];

  if (event.endDate) {
    lines.push(`DTEND:${formatDate(event.endDate)}`);
  }

  lines.push(`SUMMARY:${event.title}`);

  if (event.description) {
    lines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
  }

  if (event.location?.name) {
    const locationParts = [event.location.name];
    if (event.location.address) {
      locationParts.push(event.location.address);
    }
    lines.push(`LOCATION:${locationParts.join(', ')}`);
  }

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\n');
}
