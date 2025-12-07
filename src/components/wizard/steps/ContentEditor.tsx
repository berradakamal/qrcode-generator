'use client';

import type { QRCodeType } from '@/types/qr-code';
import type { QRContentData } from '@/types/qr-content';
import { WiFiForm } from '../forms/WiFiForm';
import { VCardForm } from '../forms/VCardForm';
import { WhatsAppForm } from '../forms/WhatsAppForm';
import { SocialForm } from '../forms/SocialForm';
import { BusinessForm } from '../forms/BusinessForm';
import { MenuForm } from '../forms/MenuForm';
import { EventForm } from '../forms/EventForm';
import { CouponForm } from '../forms/CouponForm';
import { FeedbackForm } from '../forms/FeedbackForm';
import { MP3Form } from '../forms/MP3Form';
import { ImagesForm } from '../forms/ImagesForm';
import { VideoForm } from '../forms/VideoForm';
import { AppsForm } from '../forms/AppsForm';
import { SecretForm } from '../forms/SecretForm';
import { SmartStoreForm } from '../forms/SmartStoreForm';
import { ZapierForm } from '../forms/ZapierForm';
import { N8nForm } from '../forms/N8nForm';

interface ContentEditorProps {
  type: QRCodeType;
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
  userId?: string;
  qrCodeId?: string;
}

export function ContentEditor({
  type,
  content,
  onChange,
  userId,
  qrCodeId,
}: ContentEditorProps) {
  const formProps = {
    content,
    onChange,
    userId,
    qrCodeId,
  };

  const renderForm = () => {
    switch (type) {
      case 'wifi':
        return <WiFiForm {...formProps} />;
      case 'vcard':
        return <VCardForm {...formProps} />;
      case 'whatsapp':
        return <WhatsAppForm {...formProps} />;
      case 'social':
        return <SocialForm {...formProps} />;
      case 'business':
        return <BusinessForm {...formProps} />;
      case 'menu':
        return <MenuForm {...formProps} />;
      case 'event':
        return <EventForm {...formProps} />;
      case 'coupon':
        return <CouponForm {...formProps} />;
      case 'feedback':
        return <FeedbackForm {...formProps} />;
      case 'mp3':
        return <MP3Form {...formProps} />;
      case 'images':
        return <ImagesForm {...formProps} />;
      case 'video':
        return <VideoForm {...formProps} />;
      case 'apps':
        return <AppsForm {...formProps} />;
      case 'secret':
        return <SecretForm {...formProps} />;
      case 'smartstore':
        return <SmartStoreForm {...formProps} />;
      case 'zapier':
        return <ZapierForm {...formProps} />;
      case 'n8n':
        return <N8nForm {...formProps} />;
      default:
        return (
          <div className="text-center py-12 text-gray-500">
            Form not available for this type
          </div>
        );
    }
  };

  return <div className="pb-8">{renderForm()}</div>;
}
