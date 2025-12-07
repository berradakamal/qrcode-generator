"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  BarChart3,
  Globe,
  MapPin,
  Cpu,
  LayoutDashboard,
  Users,
  Settings,
  PieChart,
  Plus,
  Search,
  Bell,
  ChevronDown,
  CreditCard,
  FileText,
  MoreVertical,
  Clock,
  X,
  Palette,
  Maximize2,
  PenSquare,
} from 'lucide-react';
import { QRStudio } from '@/components/qr-studio';
import { QRWizard } from '@/components/wizard';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { OnboardingPrompt } from '@/components/dashboard/OnboardingPrompt';
import { MyQRCodesView } from '@/components/dashboard/MyQRCodesView';
import { QRTypePieChart } from '@/components/dashboard/QRTypePieChart';
import { OSBreakdownChart } from '@/components/dashboard/OSBreakdownChart';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { qrcodesApi, analyticsApi } from '@/lib/api';
import { useQRTemplate } from '@/components/qr-studio/hooks/useQRTemplate';
import type { QRCodeDocument, QRCodeType } from '@/types/qr-code';
import type { QRTemplate } from '@/types/qr-template';

interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean | null;
  icon: React.ReactElement;
  color: 'blue' | 'purple' | 'emerald' | 'orange';
}

interface Session {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  color: string;
  avatar: string;
  startTime: number;
  url: string;
  device: string;
  browser: string;
}

// Types for real data (will be fetched from API)
interface QRCode {
  id: string;
  name: string;
  type: string;
  scans: number;
  status: 'Active' | 'Paused';
  date: string;
}

interface LocationStat {
  city: string;
  scans: string;
  pct: number;
  color: string;
}

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [animated, setAnimated] = useState(false);

  // Wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardInitialType, setWizardInitialType] = useState<QRCodeType | null>(null);

  // Load saved template for wizard
  const { template: savedTemplate } = useQRTemplate(session?.user?.id);

  // Real data state
  const [userQRCodes, setUserQRCodes] = useState<QRCodeDocument[]>([]);
  const [isLoadingQRCodes, setIsLoadingQRCodes] = useState(true);
  const [scansByType, setScansByType] = useState<Record<string, { totalScans: number; uniqueScans: number; count: number }>>({});
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [osBreakdown, setOsBreakdown] = useState<Record<string, number>>({});
  const [deviceBreakdown, setDeviceBreakdown] = useState<Record<string, number>>({});
  const [isLoadingOSBreakdown, setIsLoadingOSBreakdown] = useState(true);
  const [qrCodes] = useState<QRCode[]>([]);
  const [locations] = useState<LocationStat[]>([]);
  const [stats] = useState({
    totalScans: 0,
    activeQRs: 0,
    uniqueUsers: 0,
    avgTime: null as string | null
  });

  // Check if user has any data
  const hasData = userQRCodes.length > 0;

  // Fetch user QR codes
  useEffect(() => {
    if (session?.user?.id) {
      setIsLoadingQRCodes(true);
      qrcodesApi.list()
        .then(data => {
          const qrCodes: QRCodeDocument[] = (data.qrCodes || []).map(qr => ({
            id: qr._id,
            userId: qr.userId,
            type: qr.type as QRCodeType,
            name: qr.name,
            shortCode: qr.shortCode,
            status: qr.status,
            content: qr.content,
            styling: qr.styling as QRTemplate,
            analytics: {
              totalScans: qr.analytics.totalScans,
              uniqueScans: qr.analytics.uniqueScans,
              lastScanAt: qr.analytics.lastScanAt ? new Date(qr.analytics.lastScanAt) : null,
            },
            createdAt: new Date(qr.createdAt),
            updatedAt: new Date(qr.updatedAt),
          }));
          setUserQRCodes(qrCodes);
        })
        .catch(console.error)
        .finally(() => setIsLoadingQRCodes(false));
    }
  }, [session?.user?.id]);

  // Fetch analytics by type
  useEffect(() => {
    if (session?.user?.id) {
      setIsLoadingAnalytics(true);
      analyticsApi.getByType()
        .then(data => {
          setScansByType(data.byType || {});
        })
        .catch(console.error)
        .finally(() => setIsLoadingAnalytics(false));
    }
  }, [session?.user?.id]);

  // Fetch OS breakdown
  useEffect(() => {
    if (session?.user?.id) {
      setIsLoadingOSBreakdown(true);
      analyticsApi.getOSBreakdown()
        .then(data => {
          setOsBreakdown(data.osBreakdown || {});
          setDeviceBreakdown(data.deviceBreakdown || {});
        })
        .catch(console.error)
        .finally(() => setIsLoadingOSBreakdown(false));
    }
  }, [session?.user?.id]);

  // Open wizard with optional pre-selected type
  const openWizard = (type?: QRCodeType) => {
    setWizardInitialType(type || null);
    setShowWizard(true);
  };

  // Handle wizard completion
  const handleWizardComplete = (qrCode: QRCodeDocument) => {
    setShowWizard(false);
    setWizardInitialType(null);
    setUserQRCodes(prev => [qrCode, ...prev]);
    setActiveTab('qrs');
  };

  // Handle QR code deletion
  const handleDeleteQRCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return;
    try {
      await qrcodesApi.delete(id);
      setUserQRCodes(prev => prev.filter(qr => qr.id !== id));
    } catch (error) {
      console.error('Failed to delete QR code:', error);
    }
  };

  // Handle QR code status toggle
  const handleToggleStatus = async (id: string, status: 'active' | 'paused') => {
    try {
      await qrcodesApi.update(id, { status });
      setUserQRCodes(prev =>
        prev.map(qr => qr.id === id ? { ...qr, status } : qr)
      );
    } catch (error) {
      console.error('Failed to update QR code status:', error);
    }
  };

  // User info from session with fallbacks
  const userName = session?.user?.name || 'User';
  const userImage = session?.user?.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
  const firstName = userName.split(' ')[0];

  // Admin check
  const ADMIN_EMAIL = 'berradakam@gmail.com';
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  useEffect(() => {
    // Trigger animations on mount
    const timer = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300 z-20">
        <Link href="/dashboard" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="QRCode Generator Logo"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>QRCode <span className="text-blue-500">Generator</span></span>
        </Link>

        <div className="px-4 py-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Main Menu</p>
          <nav className="space-y-1">
            <SidebarItem icon={<LayoutDashboard />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarItem icon={<Globe />} label="Realtime" active={false} onClick={() => router.push('/realtime')} />
            <SidebarItem icon={<Palette />} label="QR Studio" active={activeTab === 'studio'} onClick={() => setActiveTab('studio')} />
            <SidebarItem icon={<QrCode />} label="My QR Codes" active={activeTab === 'qrs'} onClick={() => setActiveTab('qrs')} />
            <SidebarItem icon={<PieChart />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <SidebarItem icon={<Users />} label="Audience" active={activeTab === 'audience'} onClick={() => setActiveTab('audience')} />
          </nav>
        </div>

        {isAdmin && (
          <div className="px-4 py-2 mt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Admin</p>
            <nav className="space-y-1">
              <SidebarItem icon={<PenSquare />} label="Blog Posts" active={false} onClick={() => router.push('/admin/posts')} />
            </nav>
          </div>
        )}

        <div className="px-4 py-2 mt-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Account</p>
          <nav className="space-y-1">
            <SidebarItem icon={<CreditCard />} label="Billing" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
            <SidebarItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-border">
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">Free Plan</span>
              <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mb-2">
              <div style={{ width: `${(stats.totalScans / 5000) * 100}%` }} className="bg-blue-500 h-full rounded-full"></div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{stats.totalScans.toLocaleString()} scans</span>
              <span>5,000 limit</span>
            </div>
            <button className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background relative">
        {/* Decorative Background Blob */}
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* TOP HEADER */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Dashboard</h1>
            <div className="h-6 w-px bg-border mx-2"></div>
            <div className="relative group">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search QR codes..."
                className="bg-card border border-border text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer hover:opacity-80 transition-opacity">
              <img src={userImage} alt="User" className="w-8 h-8 rounded-full bg-muted" />
              <div className="hidden md:block text-sm text-left">
                <div className="font-bold leading-none">{userName}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Free Plan</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD AREA */}
        {activeTab === 'studio' ? (
          <div className="flex-1 overflow-hidden">
            <QRStudio mode="dashboard" showSaveButton />
          </div>
        ) : activeTab === 'qrs' ? (
          <MyQRCodesView
            qrCodes={userQRCodes}
            onCreateNew={() => openWizard()}
            onEdit={(qr) => console.log('Edit QR:', qr.id)}
            onDelete={handleDeleteQRCode}
            onToggleStatus={handleToggleStatus}
          />
        ) : !hasData && !isLoadingQRCodes ? (
          <OnboardingPrompt onCreateQR={openWizard} />
        ) : (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">

          {/* WELCOME & ACTION BAR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Welcome back, {firstName}!</h2>
              <p className="text-muted-foreground text-sm">Here's what's happening with your QR codes today.</p>
            </div>
            <button onClick={() => openWizard()} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5">
              <Plus className="w-4 h-4" /> Create New QR
            </button>
          </div>

          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Scans" value={stats.totalScans.toLocaleString()} trend="--" trendUp={null} icon={<BarChart3 />} color="blue" />
            <StatCard label="Active QRs" value={stats.activeQRs.toString()} trend="--" trendUp={null} icon={<QrCode />} color="purple" />
            <StatCard label="Unique Users" value={stats.uniqueUsers.toLocaleString()} trend="--" trendUp={null} icon={<Users />} color="emerald" />
            <StatCard label="Avg. Time" value={stats.avgTime || '--'} trend="--" trendUp={null} icon={<Clock />} color="orange" />
          </div>

          {/* --- MAIN GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* 1. GLOBE VISUALIZATION (1/3 width) */}
            <div className="lg:col-span-4 bg-card border border-border rounded-3xl relative overflow-hidden min-h-[400px] flex flex-col shadow-2xl">
              <div className="p-4 border-b border-border flex justify-between items-center z-10 bg-card/50 backdrop-blur-sm">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Live Activity</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">Live</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/realtime')}
                  className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  title="View fullscreen"
                >
                  <Maximize2 className="w-4 h-4"/>
                </button>
              </div>

              <div className="flex-1 relative">
                <GlobeViz />
              </div>
            </div>

            {/* 2. PIE CHART - Scans by Type (1/3 width) */}
            <div className="lg:col-span-4 min-h-[400px]">
              <QRTypePieChart data={scansByType} isLoading={isLoadingAnalytics} />
            </div>

            {/* 3. TOP LOCATIONS (1/3 width) */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* Top Locations */}
              <div className="bg-card border border-border rounded-3xl p-6 flex-1 shadow-lg min-h-[400px]">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-400" /> Top Locations</h3>
                <div className="space-y-5">
                  {locations.length > 0 ? locations.map((loc: LocationStat, i: number) => (
                    <div key={i} className="group">
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-foreground flex items-center gap-2">
                           <span className={`w-1.5 h-1.5 rounded-full ${loc.color}`}></span>
                           {loc.city}
                        </span>
                        <span className="text-muted-foreground font-mono text-xs">{loc.scans}</span>
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: animated ? `${loc.pct}%` : '0%' }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                          className={`h-full ${loc.color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                        />
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No location data yet</p>
                  )}
                </div>
                <button className="w-full mt-6 py-3 border border-border rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                  View Full Report
                </button>
              </div>
            </div>

            {/* 3. DEVICE & METRICS ROW */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Recent QRs List */}
               <div className="md:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-400" /> Recent Activity</h3>
                    <button className="text-sm text-blue-400 font-bold hover:underline">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                     {qrCodes.length > 0 ? qrCodes.map((qr: QRCode) => (
                        <div key={qr.id} className="flex items-center justify-between p-3 hover:bg-accent/50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-border">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-lg p-0.5">
                                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qr.name}`} className="w-full h-full mix-blend-multiply opacity-80" alt="QR" />
                              </div>
                              <div>
                                 <div className="font-bold text-sm">{qr.name}</div>
                                 <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">{qr.type}</span>
                                    <span>• {qr.date}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-right hidden sm:block">
                                 <div className="font-bold text-sm">{qr.scans}</div>
                                 <div className="text-[10px] text-muted-foreground uppercase">Scans</div>
                              </div>
                              <div className={`text-xs font-bold px-2 py-1 rounded-full ${qr.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                 {qr.status}
                              </div>
                              <button className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4"/></button>
                           </div>
                        </div>
                     )) : (
                        <p className="text-muted-foreground text-sm text-center py-4">No QR codes yet</p>
                     )}
                  </div>
               </div>

               {/* Tech Specs / OS */}
               <OSBreakdownChart
                 osBreakdown={osBreakdown}
                 deviceBreakdown={deviceBreakdown}
                 isLoading={isLoadingOSBreakdown}
               />
            </div>

          </div>
          
          <div className="text-center text-muted-foreground text-xs mt-12 pb-4">
             © 2024 QRCode Generator • <Link href="/privacy" className="hover:text-foreground">Privacy</Link> • <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>

        </div>
        )}

        {/* Wizard Modal */}
        <AnimatePresence>
          {showWizard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowWizard(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-background rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <QRWizard
                  initialType={wizardInitialType ?? undefined}
                  initialStyling={savedTemplate}
                  onComplete={handleWizardComplete}
                  onCancel={() => {
                    setShowWizard(false);
                    setWizardInitialType(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
      active
        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-4 h-4 ${active ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}` })}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const StatCard = ({ label, value, trend, trendUp, icon, color }: StatCardProps) => {
  const colorMap = {
     blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
     purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
     emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
     orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20'
  };

  return (
    <div className="bg-card border border-border p-6 rounded-2xl hover:border-accent transition-colors shadow-lg group">
       <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl ${colorMap[color]} group-hover:scale-110 transition-transform`}>
             {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
          </div>
          {trendUp !== null && (
             <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trendUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {trendUp ? '↑' : '↓'} {trend}
             </span>
          )}
          {trendUp === null && (
             <span className="text-xs font-bold px-2 py-1 rounded-full text-muted-foreground bg-muted">
                {trend}
             </span>
          )}
       </div>
       <div className="text-3xl font-extrabold mb-1 tracking-tight">{value}</div>
       <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
};

// --- GLOBE VIZ COMPONENT ---
const DEMO_URLS = [
  'https://myrestaurant.com/menu',
  'https://shop.example.com/sale',
  'https://event.tickets/concert',
  'https://realestate.co/listing/123'
];

const DEVICES = ['iPhone 15 Pro', 'iPhone 14', 'Samsung Galaxy S24', 'Pixel 8'];
const BROWSERS = ['Safari', 'Chrome', 'Firefox'];

const LOCATIONS = [
  { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
  { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
  { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
  { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia' },
  { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany' },
  { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' },
  { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE' },
];

const COLORS = ['#ef4444', '#a855f7', '#f97316', '#10b981', '#3b82f6'];
const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max'
];

interface GlobeInstance {
  pointOfView: (pov?: { lat?: number; lng?: number; altitude?: number }, ms?: number) => { lat: number; lng: number; altitude: number };
  controls: () => { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean };
  htmlElementsData: (data: Session[]) => GlobeInstance;
  htmlLat: (fn: (d: Session) => number) => GlobeInstance;
  htmlLng: (fn: (d: Session) => number) => GlobeInstance;
  htmlElement: (fn: (d: Session) => HTMLElement) => GlobeInstance;
  globeImageUrl: (url: string) => GlobeInstance;
  backgroundImageUrl: (url: string | null) => GlobeInstance;
  width: (w: number) => GlobeInstance;
  height: (h: number) => GlobeInstance;
  _destructor?: () => void;
}

const GLOBE_TEXTURES = {
  day: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
  night: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  dayBackground: null,
  nightBackground: '//unpkg.com/three-globe/example/img/night-sky.png'
};

const GlobeViz = () => {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [mounted, setMounted] = useState(false);
  const lastSessionRef = useRef<string | null>(null);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  const generateRandomSession = useCallback(() => {
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
    const browser = BROWSERS[Math.floor(Math.random() * BROWSERS.length)];
    const url = DEMO_URLS[Math.floor(Math.random() * DEMO_URLS.length)];
    return {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      ...location,
      color,
      avatar,
      startTime: Date.now(),
      url,
      device,
      browser,
    };
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!globeRef.current) return;
    const pov = globeRef.current.pointOfView();
    const newAltitude = direction === 'in'
      ? Math.max(1.2, pov.altitude - 0.3)
      : Math.min(4, pov.altitude + 0.3);
    globeRef.current.pointOfView({ ...pov, altitude: newAltitude }, 300);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let globe: any;
    let destroyed = false;

    const initGlobe = async () => {
      try {
        const GlobeModule = await import('globe.gl');
        const Globe = GlobeModule.default;

        if (destroyed || !containerRef.current) return;

        globe = new Globe(containerRef.current)
          .globeImageUrl(isDark ? GLOBE_TEXTURES.night : GLOBE_TEXTURES.day)
          .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundImageUrl(isDark ? GLOBE_TEXTURES.nightBackground : GLOBE_TEXTURES.dayBackground)
          .showAtmosphere(true)
          .atmosphereColor('rgba(100, 180, 255, 0.3)')
          .atmosphereAltitude(0.2)
          .pointOfView({ lat: 20, lng: 0, altitude: 2.2 })
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);

        globe.controls().autoRotate = false;
        globe.controls().autoRotateSpeed = 0.3;
        globe.controls().enableZoom = false;

        globeRef.current = globe;
        
        // Handle resize explicitly
        const resizeObserver = new ResizeObserver(() => {
             if (containerRef.current && globe) {
                 const { clientWidth, clientHeight } = containerRef.current;
                 globe.width(clientWidth).height(clientHeight);
             }
        });
        resizeObserver.observe(containerRef.current);

        setIsGlobeReady(true);
        return () => { resizeObserver.disconnect(); };
      } catch (error) { console.error('Globe init error:', error); }
    };
    initGlobe();
    return () => { destroyed = true; if (globeRef.current) { globeRef.current._destructor?.(); } };
  }, [isDark]);

  // Update globe textures when theme changes
  useEffect(() => {
    if (!isGlobeReady || !globeRef.current || !mounted) return;

    globeRef.current
      .globeImageUrl(isDark ? GLOBE_TEXTURES.night : GLOBE_TEXTURES.day)
      .backgroundImageUrl(isDark ? GLOBE_TEXTURES.nightBackground : GLOBE_TEXTURES.dayBackground);
  }, [isDark, isGlobeReady, mounted]);

  useEffect(() => {
    if (!isGlobeReady || !globeRef.current) return;

    // Initial population
    setSessions(Array.from({ length: 3 }, () => generateRandomSession()));

    // Add new sessions randomly
    const addInterval = setInterval(() => {
      setSessions(prev => {
        const newSession = generateRandomSession();
        const updated = [...prev, newSession];
        return updated.length > 8 ? updated.slice(-8) : updated;
      });
    }, 4000);

    // Remove old sessions
    const removeInterval = setInterval(() => {
      setSessions(prev => {
        const now = Date.now();
        return prev.filter(session => now - session.startTime < 40000); // Keep longer for visual effect
      });
    }, 2000);

    return () => { clearInterval(addInterval); clearInterval(removeInterval); };
  }, [isGlobeReady, generateRandomSession]);

  useEffect(() => {
    if (!globeRef.current || !isGlobeReady) return;

    globeRef.current
      .htmlElementsData(sessions)
      .htmlLat(d => d.lat)
      .htmlLng(d => d.lng)
      .htmlElement(d => {
        const el = document.createElement('div');
        el.className = 'globe-marker';
        el.innerHTML = `
          <div class="marker-container group relative">
            <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            <div class="relative z-10 w-8 h-8 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden bg-slate-900 transition-transform hover:scale-125 cursor-pointer">
              <img src="${d.avatar}" class="w-full h-full object-cover" alt="User" />
            </div>
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
               ${d.city}
            </div>
          </div>
        `;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedSession(d);
          if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
          }
        });
        return el;
      });
  }, [sessions, isGlobeReady]);

  // Handle spinning behavior: spin after 30s of no new markers
  useEffect(() => {
    if (!globeRef.current || !isGlobeReady) return;

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    globeRef.current.controls().autoRotate = false;

    if (sessions.length === 0) {
      spinTimeoutRef.current = setTimeout(() => {
        if (globeRef.current) {
          globeRef.current.controls().autoRotate = true;
        }
      }, 30000);
      return;
    }

    const latestSession = sessions[sessions.length - 1];
    if (latestSession && latestSession.id !== lastSessionRef.current) {
      lastSessionRef.current = latestSession.id;

      globeRef.current.pointOfView(
        { lat: latestSession.lat, lng: latestSession.lng, altitude: 2.2 },
        1500
      );
    }

    spinTimeoutRef.current = setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
      }
    }, 30000);

    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, [sessions, isGlobeReady]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full h-full absolute inset-0">
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
        <button onClick={() => handleZoom('in')} className="w-8 h-8 flex items-center justify-center bg-card/80 backdrop-blur text-foreground rounded-lg border border-border hover:bg-accent">+</button>
        <button onClick={() => handleZoom('out')} className="w-8 h-8 flex items-center justify-center bg-card/80 backdrop-blur text-foreground rounded-lg border border-border hover:bg-accent">−</button>
      </div>

      <AnimatePresence>
      {selectedSession && (
        <motion.div 
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.9, y: 20 }}
           className="absolute bottom-6 left-6 z-30"
        >
          <div className="bg-card/90 backdrop-blur-md border border-border rounded-2xl p-5 w-72 shadow-2xl relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSelectedSession(null);
                if (globeRef.current) globeRef.current.controls().autoRotate = true;
              }}
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/50">
               <img src={selectedSession.avatar} alt="User" className="w-12 h-12 rounded-xl bg-muted" />
               <div>
                  <div className="font-bold text-sm">{selectedSession.city}, {selectedSession.country}</div>
                  <div className="text-xs text-blue-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {formatTime(selectedSession.startTime)}</div>
               </div>
            </div>
            
            <div className="space-y-3">
               <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-medium">{selectedSession.device}</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Browser</span>
                  <span className="font-medium">{selectedSession.browser}</span>
               </div>
               <div className="bg-muted rounded-lg p-2 mt-2">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">Target URL</div>
                  <div className="text-xs text-blue-400 truncate font-mono">{selectedSession.url}</div>
               </div>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;