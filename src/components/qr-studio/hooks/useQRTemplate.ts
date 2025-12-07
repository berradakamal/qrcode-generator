"use client";

import { useState, useEffect, useCallback } from 'react';
import { QRTemplate, DEFAULT_TEMPLATE } from '@/types/qr-template';
import { templatesApi } from '@/lib/api';

interface UseQRTemplateReturn {
  template: QRTemplate;
  isLoading: boolean;
  error: string | null;
  saveTemplate: (template: QRTemplate) => Promise<void>;
  isSaving: boolean;
  saveSuccess: boolean;
}

export function useQRTemplate(userId: string | undefined): UseQRTemplateReturn {
  const [template, setTemplate] = useState<QRTemplate>(DEFAULT_TEMPLATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    templatesApi.get()
      .then(data => {
        if (!cancelled && data.template) {
          setTemplate(data.template as QRTemplate);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Failed to load template:', err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [userId]);

  const saveTemplate = useCallback(async (newTemplate: QRTemplate) => {
    if (!userId) {
      setError('Must be logged in to save template');
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);
      setError(null);
      setSaveSuccess(false);

      await templatesApi.save(newTemplate);

      setTemplate(newTemplate);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save template:', err);
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  }, [userId, isSaving]);

  return { template, isLoading, error, saveTemplate, isSaving, saveSuccess };
}
