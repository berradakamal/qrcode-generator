"use client";

import {
  Heart,
  Star,
  ShoppingCart,
  Lock,
  Music,
  PlayCircle,
  SkipForward,
  Share2,
  Box,
  Image as ImageIcon,
  Globe,
  Clock,
  MapPin,
  FileText,
  User,
  Wifi,
  ArrowRight,
} from 'lucide-react';

interface PhoneScreenProps {
  type: string;
  title: string;
}

export const PhoneScreen = ({ type, title }: PhoneScreenProps) => {
  switch (type) {
    case 'smartstore':
      return (
        <div className="h-full bg-slate-50 flex flex-col overflow-y-auto pb-12">
          <div className="h-64 bg-slate-200 relative">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">Product Image</div>
            <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm">
              <Heart className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="p-6 bg-white rounded-t-3xl -mt-6 flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-xl text-slate-900">Minimalist Chair</h3>
              <span className="font-bold text-emerald-600 text-lg">$149</span>
            </div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
              <span className="text-xs text-slate-400 ml-1">(42)</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Ergonomic design meets modern aesthetics. Premium wood finish with comfortable padding.
            </p>
            <div className="space-y-3 mt-auto">
              <button className="w-full bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button className="w-full bg-slate-100 text-slate-900 py-3.5 rounded-xl font-bold">
                Buy with Apple Pay
              </button>
            </div>
          </div>
        </div>
      );

    case 'secret':
      return (
        <div className="h-full bg-slate-900 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-slate-800 to-slate-950"></div>
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
              <Lock className="w-8 h-8 text-white/80" />
            </div>
            <h3 className="text-xl font-bold mb-2">Restricted Content</h3>
            <p className="text-slate-400 text-sm mb-8 text-center">Enter the PIN to unlock this message.</p>

            <div className="flex gap-3 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-14 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl font-mono">
                  {i === 1 ? '•' : ''}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-60">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg transition-colors">
                  {n}
                </button>
              ))}
              <div />
              <button className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-lg">0</button>
            </div>
          </div>
        </div>
      );

    case 'mp3':
    case 'playlist':
      return (
        <div className="h-full bg-gradient-to-b from-indigo-900 to-black text-white flex flex-col p-6">
          <div className="w-full aspect-square bg-slate-800 rounded-2xl shadow-2xl mb-8 mt-4 relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Music className="w-16 h-16 text-white/50" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">Neon Nights</h3>
          <p className="text-slate-400 text-sm mb-8">Synthwave Collection</p>

          <div className="w-full bg-slate-700 h-1 rounded-full mb-2">
            <div className="w-1/3 bg-white h-full rounded-full"></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-8">
            <span>1:24</span>
            <span>3:45</span>
          </div>

          <div className="flex justify-between items-center px-4">
            <SkipForward className="w-8 h-8 rotate-180 text-slate-400" />
            <PlayCircle className="w-16 h-16 text-white" />
            <SkipForward className="w-8 h-8 text-slate-400" />
          </div>
        </div>
      );

    case 'video':
      return (
        <div className="h-full bg-black flex flex-col items-center justify-center">
          <div className="w-full aspect-video bg-slate-900 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-white opacity-80" />
            </div>
            <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="h-1 bg-red-600 w-1/2 rounded-full"></div>
            </div>
          </div>
          <div className="p-4 w-full text-left">
            <h3 className="text-white font-bold text-lg">Product Launch 2024</h3>
            <p className="text-gray-400 text-xs mt-1">12K views • 2 hours ago</p>
            <div className="flex gap-4 mt-4">
              <button className="flex items-center gap-1 text-white text-xs bg-white/10 px-3 py-1.5 rounded-full"><Heart className="w-3 h-3" /> Like</button>
              <button className="flex items-center gap-1 text-white text-xs bg-white/10 px-3 py-1.5 rounded-full"><Share2 className="w-3 h-3" /> Share</button>
            </div>
          </div>
        </div>
      );

    case 'apps':
      return (
        <div className="h-full bg-slate-50 flex flex-col p-6 items-center text-center pt-12">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-lg mb-6 flex items-center justify-center">
            <Box className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">TaskMaster Pro</h3>
          <p className="text-slate-500 text-sm mb-8">Organize your life in seconds</p>

          <div className="space-y-3 w-full">
            <button className="w-full bg-black text-white p-3 rounded-xl flex items-center justify-center gap-3 shadow-lg">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-white/60 leading-none">Download on the</div>
                <div className="text-lg font-bold leading-none mt-1">App Store</div>
              </div>
            </button>
            <button className="w-full bg-white border border-slate-200 text-slate-800 p-3 rounded-xl flex items-center justify-center gap-3 shadow-sm">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">Get it on</div>
                <div className="text-lg font-bold leading-none mt-1">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      );

    case 'website':
    case 'landing':
      return (
        <div className="h-full bg-white flex flex-col">
          <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            <div className="flex-1 bg-white h-6 rounded-md shadow-sm flex items-center px-2 text-[10px] text-slate-400">
              <Lock className="w-2 h-2 mr-1" /> mysite.com
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="w-full h-32 bg-slate-100 rounded-lg"></div>
            <div className="w-3/4 h-6 bg-slate-100 rounded"></div>
            <div className="space-y-2">
              <div className="w-full h-2 bg-slate-50 rounded"></div>
              <div className="w-full h-2 bg-slate-50 rounded"></div>
              <div className="w-5/6 h-2 bg-slate-50 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="h-24 bg-slate-50 rounded-lg"></div>
              <div className="h-24 bg-slate-50 rounded-lg"></div>
            </div>
          </div>
        </div>
      );

    case 'images':
      return (
        <div className="h-full bg-black overflow-y-auto">
          <div className="p-4 grid grid-cols-2 gap-2">
            <div className="h-32 bg-slate-800 rounded-lg"></div>
            <div className="h-32 bg-slate-800 rounded-lg"></div>
            <div className="col-span-2 h-48 bg-slate-800 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-slate-600" />
            </div>
            <div className="h-32 bg-slate-800 rounded-lg"></div>
            <div className="h-32 bg-slate-800 rounded-lg"></div>
          </div>
          <div className="p-4 text-white">
            <h3 className="font-bold">Summer Trip 2024</h3>
            <p className="text-xs text-slate-400">24 Photos</p>
          </div>
        </div>
      );

    case 'business':
      return (
        <div className="h-full bg-white flex flex-col">
          <div className="h-40 bg-slate-200 relative">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">Map View</div>
            <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 w-8 h-8 drop-shadow-md" />
          </div>
          <div className="p-6">
            <h3 className="font-bold text-xl text-slate-900 mb-1">Downtown Coffee</h3>
            <p className="text-slate-500 text-sm mb-6">Best espresso in the city.</p>

            <div className="space-y-4 mb-6">
              <div className="flex gap-3 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-green-600 font-bold">Open Now</span>
                <span className="text-slate-400">• Closes 8PM</span>
              </div>
              <div className="flex gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">123 Main St, New York</span>
              </div>
              <div className="flex gap-3 text-sm">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-blue-500">downtowncoffee.com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-md">Directions</button>
              <button className="bg-slate-100 text-slate-900 py-3 rounded-xl font-bold text-sm">Call Now</button>
            </div>
          </div>
        </div>
      );

    case 'email':
      return (
        <div className="h-full bg-white flex flex-col p-4">
          <div className="border-b border-slate-100 py-3 flex gap-2 text-sm">
            <span className="text-slate-400">To:</span> <span className="font-medium">support@company.com</span>
          </div>
          <div className="border-b border-slate-100 py-3 flex gap-2 text-sm">
            <span className="text-slate-400">Subject:</span> <span className="font-medium">Inquiry about Service</span>
          </div>
          <div className="py-4 text-slate-600 text-sm leading-relaxed">
            Hello, I would like to know more about your premium features...
          </div>
          <button className="mt-auto w-full bg-blue-600 text-white py-3 rounded-full font-bold shadow-lg">Send Email</button>
        </div>
      );

    case 'menu':
      return (
        <div className="h-full bg-white overflow-hidden flex flex-col">
          <div className="h-40 bg-amber-500 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 left-4 text-white font-bold text-xl">The Burger Joint</div>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto pb-20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-3 pb-3 border-b border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-lg shrink-0"></div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-slate-800">Classic Burger</div>
                  <div className="text-xs text-slate-500 mt-1">Beef, lettuce, tomato.</div>
                  <div className="text-sm font-bold text-amber-600 mt-2">$12.99</div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <button className="w-full bg-slate-900 text-white py-3 rounded-full font-bold shadow-lg">View PDF</button>
          </div>
        </div>
      );

    case 'vcard':
      return (
        <div className="h-full bg-slate-50 flex flex-col pt-12 p-6 items-center text-center">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg mb-4">
            <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sarah Smith</h2>
          <p className="text-indigo-600 text-sm font-medium mb-8">Marketing Director</p>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 mt-auto mb-8">Save Contact</button>
        </div>
      );

    case 'wifi':
      return (
        <div className="h-full bg-slate-900 flex flex-col items-center justify-center p-8 text-white text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Wifi className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Join Wi-Fi</h3>
          <div className="w-full bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 mb-8 mt-8">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Network Name</p>
            <p className="font-mono text-xl tracking-wider">Guest_Network_5G</p>
          </div>
          <button className="w-full bg-green-500 text-white py-4 rounded-xl font-bold shadow-lg">Connect Now</button>
        </div>
      );

    case 'social':
      return (
        <div className="h-full bg-gradient-to-b from-orange-50 to-white p-6 flex flex-col pt-12 items-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full p-[3px] mb-4">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center"><Share2 className="w-8 h-8 text-slate-300" /></div>
          </div>
          <h3 className="font-bold text-lg mb-6">@CreativeStudio</h3>
          <div className="w-full space-y-3">
            {['Instagram', 'TikTok', 'YouTube'].map(net => (
              <button key={net} className="w-full py-3.5 px-6 bg-white border border-slate-200 rounded-full font-bold text-slate-700 shadow-sm flex justify-between items-center">{net} <ArrowRight className="w-4 h-4 text-slate-300" /></button>
            ))}
          </div>
        </div>
      );

    case 'feedback':
      return (
        <div className="h-full bg-white flex flex-col">
          <div className="bg-yellow-400 h-32 flex items-center justify-center text-yellow-900 font-bold text-xl">Rate Visit</div>
          <div className="p-6 -mt-6 bg-white rounded-t-3xl flex-1 flex flex-col items-center">
            <div className="flex gap-2 mb-8 mt-4">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-8 h-8 text-slate-200 hover:text-yellow-400 fill-current" />)}
            </div>
            <textarea className="w-full bg-slate-50 rounded-xl p-4 text-sm mb-4 h-32 resize-none" placeholder="Comments..."></textarea>
            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Submit</button>
          </div>
        </div>
      );

    case 'event':
      return (
        <div className="h-full bg-white flex flex-col">
          <div className="h-48 bg-teal-600 relative p-6 flex items-end"><h3 className="text-2xl font-bold text-white">Future Summit</h3></div>
          <div className="p-6 space-y-6">
            <div className="flex gap-4 items-center"><div className="bg-teal-50 p-3 rounded-xl"><Clock className="w-5 h-5 text-teal-600" /></div><div><div className="font-bold text-sm">Sat, Dec 12</div></div></div>
            <div className="flex gap-4 items-center"><div className="bg-teal-50 p-3 rounded-xl"><MapPin className="w-5 h-5 text-teal-600" /></div><div><div className="font-bold text-sm">Convention Ctr</div></div></div>
            <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg mt-4">RSVP Now</button>
          </div>
        </div>
      );

    case 'coupon':
      return (
        <div className="h-full bg-red-600 flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-2xl p-6 text-center relative overflow-hidden">
            <h3 className="text-4xl font-extrabold text-slate-900 mb-2">50% OFF</h3>
            <div className="border-2 border-dashed border-slate-300 p-3 rounded-lg bg-slate-50 font-mono font-bold text-slate-700 mb-4">SAVE50NOW</div>
            <p className="text-xs text-slate-400">Valid until Dec 31</p>
          </div>
        </div>
      );

    default:
      return (
        <div className="h-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
          <p className="text-slate-500 text-sm">Optimized Document Viewer</p>
          <button className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold">Open File</button>
        </div>
      );
  }
};
