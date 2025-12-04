"use client";

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
} from 'lucide-react';

export interface QRType {
  id: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  title: string;
  desc: string;
  feat: string;
  kpi: string;
}

export const QR_TYPES: QRType[] = [
  { id: 'smartstore', icon: <ShoppingBag className="w-6 h-6"/>, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Smart Store', desc: 'Shopify/Ecom integration with Buy Buttons.', feat: 'Add to Cart', kpi: 'Add to Cart' },
  { id: 'menu', icon: <Utensils className="w-6 h-6"/>, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Menu', desc: 'Digital Menu with photos, allergens & pricing.', feat: 'Photos & Prices', kpi: 'Scroll Depth' },
  { id: 'vcard', icon: <User className="w-6 h-6"/>, color: 'text-indigo-500', bg: 'bg-indigo-50', title: 'vCard Plus', desc: 'Share contact info & socials in one scan.', feat: 'Save to Contact', kpi: 'Contact Saves' },
  { id: 'wifi', icon: <Wifi className="w-6 h-6"/>, color: 'text-cyan-500', bg: 'bg-cyan-50', title: 'Wi-Fi', desc: 'Connect guests to Wi-Fi instantly.', feat: 'Auto-Connect', kpi: 'Copy Rate' },
  { id: 'secret', icon: <Lock className="w-6 h-6"/>, color: 'text-slate-700', bg: 'bg-slate-100', title: 'Secret', desc: 'Password protected hidden messages.', feat: 'PIN Protection', kpi: 'Unlocks' },
  { id: 'mp3', icon: <Music className="w-6 h-6"/>, color: 'text-violet-500', bg: 'bg-violet-50', title: 'MP3 Player', desc: 'Play songs directly in the browser.', feat: 'Background Play', kpi: 'Play Rate' },
  { id: 'images', icon: <ImageIcon className="w-6 h-6"/>, color: 'text-pink-500', bg: 'bg-pink-50', title: 'Gallery', desc: 'Showcase portfolios or event photos.', feat: 'Slideshow', kpi: 'Views' },
  { id: 'video', icon: <Video className="w-6 h-6"/>, color: 'text-rose-500', bg: 'bg-rose-50', title: 'Video', desc: 'Play videos without ads.', feat: 'No Ads', kpi: 'Watch Time' },
  { id: 'apps', icon: <Box className="w-6 h-6"/>, color: 'text-purple-500', bg: 'bg-purple-50', title: 'App Store', desc: 'Redirect to iOS/Android automatically.', feat: 'Smart Routing', kpi: 'Clicks' },
  { id: 'social', icon: <Share2 className="w-6 h-6"/>, color: 'text-orange-500', bg: 'bg-orange-50', title: 'Social Bio', desc: 'LinkTree style page for all profiles.', feat: 'All Platforms', kpi: 'Clicks' },
  { id: 'event', icon: <Calendar className="w-6 h-6"/>, color: 'text-teal-500', bg: 'bg-teal-50', title: 'Event', desc: 'RSVP, Maps, and Calendar invite.', feat: 'RSVP & Maps', kpi: 'RSVPs' },
  { id: 'whatsapp', icon: <MessageCircle className="w-6 h-6"/>, color: 'text-green-500', bg: 'bg-green-50', title: 'WhatsApp', desc: 'Start a chat with a pre-filled message.', feat: 'Pre-filled Text', kpi: 'Chats' },
  { id: 'business', icon: <MapPin className="w-6 h-6"/>, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Business', desc: 'Show hours, location & services.', feat: 'Opening Hours', kpi: 'Directions' },
  { id: 'coupon', icon: <Gift className="w-6 h-6"/>, color: 'text-red-500', bg: 'bg-red-50', title: 'Coupon', desc: 'Discount codes with countdowns.', feat: 'Expiry Timer', kpi: 'Copies' },
  { id: 'feedback', icon: <MessageSquare className="w-6 h-6"/>, color: 'text-yellow-500', bg: 'bg-yellow-50', title: 'Feedback', desc: 'Collect ratings and reviews.', feat: 'Star Ratings', kpi: 'Avg Rating' },
];
