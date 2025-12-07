export interface SmartStoreContent {
  type: 'smartstore';
  productUrl: string;
  shopifyDomain?: string;
  buyButtonConfig: {
    buttonText: string;
    buttonColor: string;
    showPrice: boolean;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  photoUrl?: string;
  allergens: string[];
  isAvailable: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuContent {
  type: 'menu';
  restaurantName: string;
  logoUrl?: string;
  categories: MenuCategory[];
  currency: string;
  showAllergens: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label?: string;
  order: number;
}

export interface VCardContent {
  type: 'vcard';
  firstName: string;
  lastName: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  photoUrl?: string;
  socials: SocialLink[];
}

export interface WiFiContent {
  type: 'wifi';
  ssid: string;
  password: string;
  securityType: 'WPA' | 'WPA2' | 'WEP' | 'nopass';
  isHidden: boolean;
}

export interface SecretContent {
  type: 'secret';
  message: string;
  pinCode: string;
  pinHint?: string;
}

export interface MP3Content {
  type: 'mp3';
  title: string;
  artist?: string;
  coverUrl?: string;
  audioUrl: string;
  duration?: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface ImagesContent {
  type: 'images';
  title?: string;
  images: GalleryImage[];
  displayMode: 'grid' | 'slideshow' | 'carousel';
}

export interface VideoContent {
  type: 'video';
  title?: string;
  videoSource: 'upload' | 'youtube' | 'vimeo';
  videoUrl: string;
  thumbnailUrl?: string;
  autoplay: boolean;
}

export interface AppsContent {
  type: 'apps';
  appName: string;
  iosUrl?: string;
  androidUrl?: string;
  fallbackUrl?: string;
  iconUrl?: string;
}

export interface SocialContent {
  type: 'social';
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  links: SocialLink[];
  theme: 'light' | 'dark' | 'gradient';
}

export interface EventLocation {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface EventContent {
  type: 'event';
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location: EventLocation;
  enableRsvp: boolean;
  maxAttendees?: number;
  coverImageUrl?: string;
}

export interface WhatsAppContent {
  type: 'whatsapp';
  phoneNumber: string;
  prefilledMessage?: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface BusinessContent {
  type: 'business';
  name: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  hours: BusinessHours[];
  services: string[];
  socials: SocialLink[];
}

export interface CouponContent {
  type: 'coupon';
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  description?: string;
  expiryDate?: string;
  terms?: string;
  brandLogoUrl?: string;
  brandColor?: string;
}

export interface FeedbackQuestion {
  id: string;
  type: 'rating' | 'text' | 'multipleChoice';
  question: string;
  required: boolean;
  options?: string[];
  maxRating?: number;
}

export interface FeedbackContent {
  type: 'feedback';
  title: string;
  description?: string;
  questions: FeedbackQuestion[];
  thankYouMessage: string;
  redirectUrl?: string;
}

export interface ZapierCustomField {
  key: string;
  value: string;
}

export type WebhookMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ZapierContent {
  type: 'zapier';
  webhookUrl: string;
  httpMethod: WebhookMethod;
  redirectUrl?: string;
  customFields: ZapierCustomField[];
}

export interface N8nContent {
  type: 'n8n';
  webhookUrl: string;
  httpMethod: WebhookMethod;
  redirectUrl?: string;
  customFields: ZapierCustomField[];
}

export type QRContentData =
  | SmartStoreContent
  | MenuContent
  | VCardContent
  | WiFiContent
  | SecretContent
  | MP3Content
  | ImagesContent
  | VideoContent
  | AppsContent
  | SocialContent
  | EventContent
  | WhatsAppContent
  | BusinessContent
  | CouponContent
  | FeedbackContent
  | ZapierContent
  | N8nContent;

export interface RSVPResponse {
  id: string;
  qrCodeId: string;
  name: string;
  email?: string;
  attending: boolean;
  guestCount: number;
  submittedAt: Date;
}

export interface FeedbackResponse {
  id: string;
  qrCodeId: string;
  answers: Record<string, string | number>;
  submittedAt: Date;
}

export function getDefaultContent(type: string): QRContentData {
  switch (type) {
    case 'wifi':
      return {
        type: 'wifi',
        ssid: '',
        password: '',
        securityType: 'WPA2',
        isHidden: false,
      };
    case 'vcard':
      return {
        type: 'vcard',
        firstName: '',
        lastName: '',
        socials: [],
      };
    case 'whatsapp':
      return {
        type: 'whatsapp',
        phoneNumber: '',
      };
    case 'social':
      return {
        type: 'social',
        displayName: '',
        links: [],
        theme: 'light',
      };
    case 'business':
      return {
        type: 'business',
        name: '',
        hours: [
          { day: 'Monday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'Tuesday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'Wednesday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'Thursday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'Friday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'Saturday', open: '10:00', close: '14:00', isClosed: false },
          { day: 'Sunday', open: '10:00', close: '14:00', isClosed: true },
        ],
        services: [],
        socials: [],
      };
    case 'menu':
      return {
        type: 'menu',
        restaurantName: '',
        categories: [],
        currency: 'USD',
        showAllergens: true,
      };
    case 'event':
      return {
        type: 'event',
        title: '',
        startDate: new Date().toISOString(),
        location: { name: '' },
        enableRsvp: false,
      };
    case 'coupon':
      return {
        type: 'coupon',
        code: '',
        discountType: 'percentage',
        discountValue: 10,
      };
    case 'feedback':
      return {
        type: 'feedback',
        title: '',
        questions: [],
        thankYouMessage: 'Thank you for your feedback!',
      };
    case 'mp3':
      return {
        type: 'mp3',
        title: '',
        audioUrl: '',
      };
    case 'images':
      return {
        type: 'images',
        images: [],
        displayMode: 'grid',
      };
    case 'video':
      return {
        type: 'video',
        videoSource: 'youtube',
        videoUrl: '',
        autoplay: false,
      };
    case 'apps':
      return {
        type: 'apps',
        appName: '',
      };
    case 'secret':
      return {
        type: 'secret',
        message: '',
        pinCode: '',
      };
    case 'smartstore':
      return {
        type: 'smartstore',
        productUrl: '',
        buyButtonConfig: {
          buttonText: 'Add to Cart',
          buttonColor: '#000000',
          showPrice: true,
        },
      };
    case 'zapier':
      return {
        type: 'zapier',
        webhookUrl: '',
        httpMethod: 'POST',
        customFields: [],
      };
    case 'n8n':
      return {
        type: 'n8n',
        webhookUrl: '',
        httpMethod: 'POST',
        customFields: [],
      };
    default:
      return {
        type: 'wifi',
        ssid: '',
        password: '',
        securityType: 'WPA2',
        isHidden: false,
      };
  }
}
