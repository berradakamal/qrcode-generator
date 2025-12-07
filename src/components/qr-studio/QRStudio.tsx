"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  Palette,
  Layout,
  Image as ImageIcon,
  Download,
  Link as LinkIcon,
  Check,
  Upload,
  Settings,
  RefreshCw,
  X,
  Frame,
  Save,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { ConfigSection } from './ConfigSection';
import { useQRTemplate } from './hooks/useQRTemplate';
import {
  QRTemplate,
  QRColors,
  QRPatterns,
  QRLogo,
  QRFrame,
  DEFAULT_TEMPLATE,
  DOT_STYLES,
  CORNER_STYLES,
  CORNER_DOT_STYLES,
  PRESET_COLORS,
  FrameType
} from '@/types/qr-template';

declare global {
  interface Window {
    QRCodeStyling: new (options: QRCodeStylingOptions) => QRCodeStylingInstance;
  }
}

interface QRCodeStylingOptions {
  width: number;
  height: number;
  type: string;
  data: string;
  image?: string;
  dotsOptions: { color: string; type: string };
  cornersSquareOptions: { type: string; color: string };
  cornersDotOptions: { type: string; color: string };
  backgroundOptions: { color: string };
  imageOptions: { crossOrigin: string; margin: number; imageSize: number; hideBackgroundDots: boolean };
}

interface QRCodeStylingInstance {
  append: (container: HTMLElement) => void;
  update: (options: Partial<QRCodeStylingOptions>) => void;
  download: (options: { name: string; extension: string }) => Promise<void>;
}

interface QRStudioProps {
  mode: 'dashboard' | 'landing' | 'wizard';
  initialContent?: string;
  initialTemplate?: QRTemplate;
  onTemplateChange?: (template: QRTemplate) => void;
  showSaveButton?: boolean;
  compact?: boolean;
}

export function QRStudio({
  mode,
  initialContent = 'https://mysite.com',
  initialTemplate,
  onTemplateChange,
  showSaveButton = false,
  compact = false,
}: QRStudioProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : mode === 'dashboard';
  const theme = isDark ? 'dark' : 'light';
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const shouldLoadTemplate = mode === 'dashboard' && !!userId;
  const { template, isLoading, saveTemplate, isSaving, saveSuccess } = useQRTemplate(shouldLoadTemplate ? userId : undefined);

  const startingTemplate = initialTemplate || DEFAULT_TEMPLATE;
  const [url, setUrl] = useState(initialContent);
  const [colors, setColors] = useState<QRColors>(startingTemplate.colors);
  const [patterns, setPatterns] = useState<QRPatterns>(startingTemplate.patterns);
  const [logo, setLogo] = useState<QRLogo>(startingTemplate.logo);
  const [frame, setFrame] = useState<QRFrame>(startingTemplate.frame);
  const [activeSection, setActiveSection] = useState(mode === 'wizard' ? 'colors' : 'content');
  const [qrSize] = useState(1000);
  const [templateLoaded, setTemplateLoaded] = useState(mode === 'wizard');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showAdvancedColors, setShowAdvancedColors] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStylingInstance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldLoadTemplate && !isLoading && !templateLoaded) {
      setColors(template.colors);
      setPatterns(template.patterns);
      setLogo(template.logo);
      setFrame(template.frame);
      setTemplateLoaded(true);
    }
  }, [template, isLoading, templateLoaded, shouldLoadTemplate]);

  useEffect(() => {
    if (mode === 'wizard' && onTemplateChange) {
      onTemplateChange({ colors, patterns, logo, frame });
    }
  }, [colors, patterns, logo, frame, mode, onTemplateChange]);

  const blobShape = useMemo(() => {
    if (frame.type !== 'blob') return {};

    const rng = (seed: number) => {
      let t = seed + 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    const variance = (frame.blobIntensity / 10) * 35;
    const values = Array.from({ length: 8 }, (_, i) => {
      const r = rng(frame.blobSeed + i);
      return 50 + ((r - 0.5) * 2 * variance);
    });

    const borderRadius = `${values[0]}% ${values[1]}% ${values[2]}% ${values[3]}% / ${values[4]}% ${values[5]}% ${values[6]}% ${values[7]}%`;
    return { borderRadius };
  }, [frame.type, frame.blobIntensity, frame.blobSeed]);

  useEffect(() => {
    let cancelled = false;

    const loadScript = () => {
      return new Promise<void>((resolve) => {
        if (typeof window !== 'undefined' && window.QRCodeStyling) {
          resolve();
          return;
        }

        const existingScript = document.querySelector('script[src*="qr-code-styling"]');
        if (existingScript) {
          const checkReady = setInterval(() => {
            if (window.QRCodeStyling) {
              clearInterval(checkReady);
              resolve();
            }
          }, 50);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js';
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    loadScript().then(() => {
      if (!cancelled) {
        setScriptLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !qrRef.current || !window.QRCodeStyling) return;

    const container = qrRef.current;

    const qr = new window.QRCodeStyling({
      width: qrSize,
      height: qrSize,
      type: 'canvas',
      data: url,
      image: logo.dataUrl || undefined,
      dotsOptions: { color: colors.dots, type: patterns.dotStyle },
      cornersSquareOptions: { type: patterns.cornerStyle, color: colors.eyeFrame },
      cornersDotOptions: { type: patterns.cornerDotStyle, color: colors.eyeCenter },
      backgroundOptions: { color: colors.background },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: logo.margin,
        imageSize: logo.scale,
        hideBackgroundDots: true
      }
    });

    container.innerHTML = '';
    qr.append(container);
    qrCodeInstance.current = qr;

    return () => {
      container.innerHTML = '';
      qrCodeInstance.current = null;
    };
  }, [scriptLoaded, url, colors, patterns, logo, qrSize]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setLogo(prev => ({ ...prev, dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(prev => ({ ...prev, dataUrl: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadQR = async (format: string) => {
    if (qrCodeInstance.current) {
      await qrCodeInstance.current.download({ name: "qr-code", extension: format });
    }
  };

  const syncColors = (color: string) => {
    setColors(prev => ({
      ...prev,
      dots: color,
      eyeFrame: color,
      eyeCenter: color
    }));
  };

  const handleSaveAsDefault = async () => {
    if (!userId) return;
    const currentTemplate: QRTemplate = { colors, patterns, logo, frame };
    await saveTemplate(currentTemplate);
  };

  // Theme-aware class helpers
  const labelClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputClass = isDark
    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500';
  const buttonClass = (active: boolean) => active
    ? 'bg-blue-600 border-blue-500 text-white'
    : isDark
      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300';

  return (
    <div className={`flex ${compact ? 'flex-row' : 'flex-col lg:flex-row'} h-full overflow-hidden ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      <div className={`${compact ? 'w-[320px] min-w-[320px]' : 'w-full lg:w-[380px]'} flex flex-col border-r ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} overflow-hidden`}>

        <div className={`p-4 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            QR Studio
          </h2>
          <p className={`text-sm mt-1 ${labelClass}`}>Design high-converting codes.</p>
        </div>

        <div className="flex-1 p-4 space-y-3 overflow-y-auto">

          {mode !== 'wizard' && (
            <ConfigSection
              title="Content"
              icon={<LinkIcon className="w-4 h-4" />}
              isActive={activeSection === 'content'}
              onClick={() => setActiveSection(activeSection === 'content' ? '' : 'content')}
              theme={theme}
            >
              <div className="space-y-2 pt-2">
                <label className={`text-xs font-bold uppercase ${labelClass}`}>Destination URL</label>
                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all pl-9 ${inputClass}`}
                    placeholder="https://example.com"
                  />
                  <LinkIcon className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                </div>
              </div>
            </ConfigSection>
          )}

          <ConfigSection
            title="Colors"
            icon={<Palette className="w-4 h-4" />}
            isActive={activeSection === 'colors'}
            onClick={() => setActiveSection(activeSection === 'colors' ? '' : 'colors')}
            theme={theme}
          >
            <div className="space-y-4 pt-2">
              {/* Preset Colors */}
              <div>
                <label className={`text-[10px] font-bold uppercase mb-2 block ${labelClass}`}>Presets</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => syncColors(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${colors.dots === c ? 'border-blue-500 scale-110 ring-2 ring-blue-500/30' : isDark ? 'border-slate-700 hover:scale-105' : 'border-slate-200 hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                      title={`Set color to ${c}`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Colors */}
              <div className="space-y-2">
                {/* QR Code Color */}
                <label className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isDark ? 'bg-slate-950 hover:bg-slate-900' : 'bg-slate-100 hover:bg-slate-50'}`}>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>QR Code</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg border-2 shadow-inner ${isDark ? 'border-slate-700' : 'border-slate-300'}`}
                      style={{ backgroundColor: colors.dots }}
                    />
                    <input
                      type="color"
                      value={colors.dots}
                      onChange={(e) => syncColors(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </label>

                {/* Background Color */}
                <label className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isDark ? 'bg-slate-950 hover:bg-slate-900' : 'bg-slate-100 hover:bg-slate-50'}`}>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Background</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg border-2 shadow-inner ${isDark ? 'border-slate-700' : 'border-slate-300'}`}
                      style={{ backgroundColor: colors.background }}
                    />
                    <input
                      type="color"
                      value={colors.background}
                      onChange={(e) => setColors(prev => ({ ...prev, background: e.target.value }))}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </label>
              </div>

              {/* Advanced Eye Colors */}
              <div>
                <button
                  onClick={() => setShowAdvancedColors(!showAdvancedColors)}
                  className={`flex items-center gap-2 text-xs font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {showAdvancedColors ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  Advanced Eye Colors
                </button>

                {showAdvancedColors && (
                  <div className="mt-2 space-y-2 pl-1">
                    <label className={`relative flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${isDark ? 'bg-slate-950/50 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Eye Frame</span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}
                          style={{ backgroundColor: colors.eyeFrame }}
                        />
                        <input
                          type="color"
                          value={colors.eyeFrame}
                          onChange={(e) => setColors(prev => ({ ...prev, eyeFrame: e.target.value }))}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    </label>

                    <label className={`relative flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${isDark ? 'bg-slate-950/50 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Eye Center</span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}
                          style={{ backgroundColor: colors.eyeCenter }}
                        />
                        <input
                          type="color"
                          value={colors.eyeCenter}
                          onChange={(e) => setColors(prev => ({ ...prev, eyeCenter: e.target.value }))}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            title="Pattern & Eyes"
            icon={<Layout className="w-4 h-4" />}
            isActive={activeSection === 'design'}
            onClick={() => setActiveSection(activeSection === 'design' ? '' : 'design')}
            theme={theme}
          >
            <div className="space-y-4 pt-2">
              <div>
                <label className={`text-xs font-bold uppercase mb-2 block ${labelClass}`}>Data Pattern</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {DOT_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setPatterns(prev => ({ ...prev, dotStyle: style.id }))}
                      className={`px-2 py-1.5 rounded text-[10px] font-medium border transition-colors ${buttonClass(patterns.dotStyle === style.id)}`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold uppercase mb-2 block ${labelClass}`}>Eye Shape</label>
                <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                  {CORNER_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setPatterns(prev => ({ ...prev, cornerStyle: style.id }))}
                      className={`px-2 py-1.5 rounded text-[10px] font-medium border transition-colors ${buttonClass(patterns.cornerStyle === style.id)}`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {CORNER_DOT_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setPatterns(prev => ({ ...prev, cornerDotStyle: style.id }))}
                      className={`px-2 py-1.5 rounded text-[10px] font-medium border transition-colors ${buttonClass(patterns.cornerDotStyle === style.id)}`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ConfigSection>

          <ConfigSection
            title="Logo & Branding"
            icon={<ImageIcon className="w-4 h-4" />}
            isActive={activeSection === 'logo'}
            onClick={() => setActiveSection(activeSection === 'logo' ? '' : 'logo')}
            theme={theme}
          >
            <div className="pt-2">
              {!logo.dataUrl ? (
                <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer relative transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-800/50' : 'border-slate-300 hover:bg-slate-100'
                }`}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className={`w-6 h-6 mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Upload Logo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 border p-2 rounded-lg ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <img src={logo.dataUrl} alt="Logo" className="w-8 h-8 object-contain bg-white/10 rounded" />
                    <div className="flex-1 min-w-0"><p className="text-xs truncate">Logo uploaded</p></div>
                    <button onClick={removeLogo} className="p-1 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>

                  <div className={`space-y-3 p-3 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <div>
                      <div className={`flex justify-between text-[10px] font-bold uppercase mb-1 ${labelClass}`}>
                        <span>Scale</span><span>{Math.round(logo.scale * 100)}%</span>
                      </div>
                      <input
                        type="range" min="0.1" max="0.5" step="0.05" value={logo.scale}
                        onChange={(e) => setLogo(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                        className="w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg accent-blue-500"
                      />
                    </div>
                    <div>
                      <div className={`flex justify-between text-[10px] font-bold uppercase mb-1 ${labelClass}`}>
                        <span>Padding</span><span>{logo.margin}px</span>
                      </div>
                      <input
                        type="range" min="0" max="50" step="1" value={logo.margin}
                        onChange={(e) => setLogo(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg accent-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ConfigSection>

          <ConfigSection
            title="Marketing Frame"
            icon={<Frame className="w-4 h-4" />}
            isActive={activeSection === 'marketing'}
            onClick={() => setActiveSection(activeSection === 'marketing' ? '' : 'marketing')}
            theme={theme}
          >
            <div className="space-y-3 pt-2">
              <div>
                <label className={`text-xs font-bold uppercase mb-2 block ${labelClass}`}>Frame Style</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['none', 'box', 'blob'] as FrameType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setFrame(prev => ({ ...prev, type }))}
                      className={`p-1.5 rounded border text-xs capitalize transition-colors ${buttonClass(frame.type === type)}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {frame.type === 'blob' && (
                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-[10px] font-bold uppercase ${labelClass}`}>Blob Shape</span>
                    <button onClick={() => setFrame(prev => ({ ...prev, blobSeed: Math.random() * 100000 }))} className="text-blue-500 hover:text-blue-400 transition-colors" title="Regenerate">
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Soft</span>
                    <input
                      type="range" min="1" max="10" step="1" value={frame.blobIntensity}
                      onChange={(e) => setFrame(prev => ({ ...prev, blobIntensity: parseInt(e.target.value) }))}
                      className="flex-1 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg accent-blue-500"
                    />
                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Wild</span>
                  </div>
                </div>
              )}

              {frame.type !== 'none' && (
                <>
                  <div>
                    <label className={`text-xs font-bold uppercase mb-1.5 block ${labelClass}`}>Call to Action</label>
                    <input
                      type="text"
                      value={frame.ctaText}
                      onChange={(e) => setFrame(prev => ({ ...prev, ctaText: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${inputClass}`}
                      placeholder="SCAN ME"
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-bold uppercase mb-1.5 block ${labelClass}`}>Text Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={frame.ctaColor} onChange={(e) => setFrame(prev => ({ ...prev, ctaColor: e.target.value }))} className="w-7 h-7 rounded cursor-pointer bg-transparent" />
                      <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{frame.ctaColor}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ConfigSection>

        </div>
      </div>

      <div className={`flex-1 flex flex-col relative ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
        <div className={`absolute inset-0 opacity-20 pointer-events-none`} style={{ backgroundImage: `radial-gradient(${isDark ? '#334155' : '#cbd5e1'} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div
            className={`relative transition-all duration-500 ease-in-out flex flex-col items-center justify-center
              ${frame.type === 'none' ? 'p-[1px]' : ''}
              ${frame.type === 'box' ? 'bg-white p-4 pb-10 rounded-xl shadow-2xl' : ''}
              ${frame.type === 'blob' ? 'bg-white p-12 shadow-2xl transition-[border-radius] duration-700' : ''}
            `}
            style={frame.type === 'blob' ? blobShape : {}}
          >
            <div ref={qrRef} className="w-[200px] h-[200px] rounded-lg overflow-hidden relative z-10 [&_canvas]:!w-full [&_canvas]:!h-full"></div>

            {frame.type !== 'none' && (
              <div className="text-center font-bold mt-3 text-lg tracking-tight uppercase relative z-10" style={{ color: frame.ctaColor }}>
                {frame.ctaText}
              </div>
            )}

            <div className="absolute -top-10 right-0 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Check className="w-3 h-3" /> Live Preview
            </div>
          </div>
        </div>

        <div className={`p-4 border-t flex flex-wrap justify-center gap-3 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/80'} backdrop-blur-md`}>
          <button onClick={() => downloadQR('png')} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg hover:bg-blue-500 transition-all flex items-center gap-2 hover:-translate-y-0.5">
            <Download className="w-4 h-4" /> Download PNG
          </button>

          {showSaveButton && userId && (
            <button
              onClick={handleSaveAsDefault}
              disabled={isSaving}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                saveSuccess
                  ? 'bg-green-600 text-white'
                  : isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              }`}
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save as Default'}
            </button>
          )}

          <div className={`text-[10px] flex items-center max-w-[140px] leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            * Frames are for preview only.
          </div>
        </div>
      </div>
    </div>
  );
}
