'use client';

import {
  ShoppingBag,
  Utensils,
  User,
  Wifi,
  Lock,
  Music,
  Image as ImageIcon,
  Video,
  Box,
  Share2,
  Calendar,
  MessageCircle,
  MapPin,
  Gift,
  MessageSquare,
  Zap,
  Workflow,
  LucideIcon,
} from 'lucide-react';
import type { QRCodeType } from '@/types/qr-code';

interface TypeSelectorProps {
  selectedType: QRCodeType | null;
  onSelect: (type: QRCodeType) => void;
}

interface QRTypeOption {
  id: QRCodeType;
  icon: LucideIcon;
  color: string;
  bg: string;
  title: string;
  description: string;
}

const QR_TYPE_OPTIONS: QRTypeOption[] = [
  {
    id: 'wifi',
    icon: Wifi,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-950',
    title: 'Wi-Fi',
    description: 'Connect guests instantly',
  },
  {
    id: 'vcard',
    icon: User,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    title: 'vCard Plus',
    description: 'Share contact info & socials',
  },
  {
    id: 'social',
    icon: Share2,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950',
    title: 'Social Bio',
    description: 'LinkTree style page',
  },
  {
    id: 'whatsapp',
    icon: MessageCircle,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950',
    title: 'WhatsApp',
    description: 'Start a chat instantly',
  },
  {
    id: 'business',
    icon: MapPin,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950',
    title: 'Business',
    description: 'Hours, location & services',
  },
  {
    id: 'menu',
    icon: Utensils,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950',
    title: 'Menu',
    description: 'Digital menu with photos',
  },
  {
    id: 'event',
    icon: Calendar,
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-950',
    title: 'Event',
    description: 'RSVP, maps & calendar',
  },
  {
    id: 'coupon',
    icon: Gift,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950',
    title: 'Coupon',
    description: 'Discount codes with timer',
  },
  {
    id: 'feedback',
    icon: MessageSquare,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    title: 'Feedback',
    description: 'Collect ratings & reviews',
  },
  {
    id: 'mp3',
    icon: Music,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950',
    title: 'MP3 Player',
    description: 'Play audio in browser',
  },
  {
    id: 'images',
    icon: ImageIcon,
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-950',
    title: 'Gallery',
    description: 'Showcase photos',
  },
  {
    id: 'video',
    icon: Video,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950',
    title: 'Video',
    description: 'Play videos without ads',
  },
  {
    id: 'apps',
    icon: Box,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950',
    title: 'App Store',
    description: 'Smart iOS/Android redirect',
  },
  {
    id: 'secret',
    icon: Lock,
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800',
    title: 'Secret',
    description: 'PIN protected messages',
  },
  {
    id: 'smartstore',
    icon: ShoppingBag,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    title: 'Smart Store',
    description: 'Shopify integration',
  },
  {
    id: 'zapier',
    icon: Zap,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950',
    title: 'Zapier',
    description: 'Trigger automations',
  },
  {
    id: 'n8n',
    icon: Workflow,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950',
    title: 'n8n',
    description: 'Trigger workflows',
  },
];

export function TypeSelector({ selectedType, onSelect }: TypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Choose QR Code Type
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Select the type of content your QR code will link to
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {QR_TYPE_OPTIONS.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                flex flex-col items-center text-center
                hover:scale-[1.02] hover:shadow-lg
                ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-blue-600" />
              )}
              <div className={`p-3 rounded-xl ${type.bg} mb-3`}>
                <Icon className={`w-6 h-6 ${type.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {type.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
