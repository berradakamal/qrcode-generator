"use client";

import { useState, useRef } from 'react';
import { Plus, QrCode, Pause, Play, Pencil, Trash2, ExternalLink, Copy, Check, Download } from 'lucide-react';
import type { QRCodeDocument, QRCodeType } from '@/types/qr-code';
import { QR_TYPE_LABELS } from '@/types/qr-code';
import { formatDistanceToNow } from 'date-fns';
import { QRCodeThumbnail, QRCodeThumbnailRef } from '@/components/qr-code/QRCodeThumbnail';
import { QRCodeKPIs } from './QRCodeKPIs';

interface MyQRCodesViewProps {
  qrCodes: QRCodeDocument[];
  onCreateNew: () => void;
  onEdit: (qrCode: QRCodeDocument) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: 'active' | 'paused') => void;
}

const TYPE_COLORS: Record<QRCodeType, string> = {
  wifi: 'bg-emerald-500/10 text-emerald-500',
  vcard: 'bg-blue-500/10 text-blue-500',
  social: 'bg-purple-500/10 text-purple-500',
  business: 'bg-indigo-500/10 text-indigo-500',
  menu: 'bg-orange-500/10 text-orange-500',
  event: 'bg-pink-500/10 text-pink-500',
  whatsapp: 'bg-green-500/10 text-green-500',
  coupon: 'bg-yellow-500/10 text-yellow-600',
  feedback: 'bg-cyan-500/10 text-cyan-500',
  mp3: 'bg-red-500/10 text-red-500',
  images: 'bg-violet-500/10 text-violet-500',
  video: 'bg-rose-500/10 text-rose-500',
  apps: 'bg-slate-500/10 text-slate-500',
  secret: 'bg-gray-500/10 text-gray-500',
  smartstore: 'bg-amber-500/10 text-amber-500',
};

export function MyQRCodesView({
  qrCodes,
  onCreateNew,
  onEdit,
  onDelete,
  onToggleStatus
}: MyQRCodesViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const qrRefs = useRef<Map<string, QRCodeThumbnailRef>>(new Map());

  const handleDownload = (id: string) => {
    const ref = qrRefs.current.get(id);
    if (ref) {
      ref.download('png');
    }
  };

  const copyLink = (shortCode: string, id: string) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (qrCodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6">
            <QrCode className="w-8 h-8 text-muted-foreground" />
          </div>

          <h3 className="text-xl font-bold mb-2">No QR codes yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first QR code to start tracking scans and engaging your audience.
          </p>

          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            Create QR Code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">My QR Codes</h2>
          <p className="text-sm text-muted-foreground">{qrCodes.length} QR code{qrCodes.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          New QR Code
        </button>
      </div>

      <div className="grid gap-4">
        {qrCodes.map((qrCode) => (
          <div
            key={qrCode.id}
            className="p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <QRCodeThumbnail
                ref={(ref) => {
                  if (ref) {
                    qrRefs.current.set(qrCode.id, ref);
                  } else {
                    qrRefs.current.delete(qrCode.id);
                  }
                }}
                type={qrCode.type}
                content={qrCode.content}
                styling={qrCode.styling}
                shortCode={qrCode.shortCode}
                name={qrCode.name}
                size={80}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold truncate">{qrCode.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[qrCode.type]}`}>
                        {QR_TYPE_LABELS[qrCode.type]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${qrCode.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-600'}`}>
                        {qrCode.status === 'active' ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyLink(qrCode.shortCode, qrCode.id)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      title="Copy link"
                    >
                      {copiedId === qrCode.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <a
                      href={`/r/${qrCode.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      title="Open link"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                    <button
                      onClick={() => onEdit(qrCode)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(qrCode.id, qrCode.status === 'active' ? 'paused' : 'active')}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      title={qrCode.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {qrCode.status === 'active' ? (
                        <Pause className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Play className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload(qrCode.id)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      title="Download PNG"
                    >
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onDelete(qrCode.id)}
                      className="p-2 rounded-lg hover:bg-accent hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>
                    Created {formatDistanceToNow(qrCode.createdAt, { addSuffix: true })}
                  </span>
                  <span>•</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    qrg.app/r/{qrCode.shortCode}
                  </code>
                </div>
              </div>
            </div>

            <QRCodeKPIs
              analytics={qrCode.analytics}
              createdAt={qrCode.createdAt}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
