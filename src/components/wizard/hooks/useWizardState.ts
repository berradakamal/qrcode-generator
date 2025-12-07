'use client';

import { useState, useCallback } from 'react';
import type { QRCodeType } from '@/types/qr-code';
import type { QRContentData } from '@/types/qr-content';
import { getDefaultContent } from '@/types/qr-content';
import { QRTemplate, DEFAULT_TEMPLATE } from '@/types/qr-template';

export interface WizardState {
  currentStep: number;
  selectedType: QRCodeType | null;
  content: QRContentData | null;
  styling: QRTemplate;
  name: string;
  isDirty: boolean;
}

export interface WizardActions {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setType: (type: QRCodeType) => void;
  updateContent: <T extends QRContentData>(updates: Partial<T>) => void;
  setContent: (content: QRContentData) => void;
  updateStyling: (updates: Partial<QRTemplate>) => void;
  setStyling: (styling: QRTemplate) => void;
  setName: (name: string) => void;
  resetWizard: () => void;
  canProceed: () => boolean;
}

const TOTAL_STEPS = 4;

export function useWizardState(
  initialType?: QRCodeType,
  initialStyling?: QRTemplate
): [WizardState, WizardActions] {
  const [state, setState] = useState<WizardState>(() => ({
    currentStep: initialType ? 1 : 0,
    selectedType: initialType || null,
    content: initialType ? getDefaultContent(initialType) : null,
    styling: initialStyling || DEFAULT_TEMPLATE,
    name: '',
    isDirty: false,
  }));

  const setStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS - 1),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  const setType = useCallback((type: QRCodeType) => {
    setState((prev) => ({
      ...prev,
      selectedType: type,
      content: getDefaultContent(type),
      isDirty: true,
    }));
  }, []);

  const updateContent = useCallback(<T extends QRContentData>(updates: Partial<T>) => {
    setState((prev) => {
      if (!prev.content) return prev;
      return {
        ...prev,
        content: { ...prev.content, ...updates } as QRContentData,
        isDirty: true,
      };
    });
  }, []);

  const setContent = useCallback((content: QRContentData) => {
    setState((prev) => ({
      ...prev,
      content,
      isDirty: true,
    }));
  }, []);

  const updateStyling = useCallback((updates: Partial<QRTemplate>) => {
    setState((prev) => ({
      ...prev,
      styling: {
        ...prev.styling,
        ...updates,
        colors: { ...prev.styling.colors, ...updates.colors },
        patterns: { ...prev.styling.patterns, ...updates.patterns },
        logo: { ...prev.styling.logo, ...updates.logo },
        frame: { ...prev.styling.frame, ...updates.frame },
      },
      isDirty: true,
    }));
  }, []);

  const setStyling = useCallback((styling: QRTemplate) => {
    setState((prev) => ({
      ...prev,
      styling,
      isDirty: true,
    }));
  }, []);

  const setName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      name,
      isDirty: true,
    }));
  }, []);

  const resetWizard = useCallback(() => {
    setState({
      currentStep: 0,
      selectedType: null,
      content: null,
      styling: DEFAULT_TEMPLATE,
      name: '',
      isDirty: false,
    });
  }, []);

  const canProceed = useCallback((): boolean => {
    switch (state.currentStep) {
      case 0:
        return state.selectedType !== null;
      case 1:
        return state.content !== null && validateContent(state.content);
      case 2:
        return true;
      case 3:
        return state.name.trim().length > 0;
      default:
        return false;
    }
  }, [state.currentStep, state.selectedType, state.content, state.name]);

  return [
    state,
    {
      setStep,
      nextStep,
      prevStep,
      setType,
      updateContent,
      setContent,
      updateStyling,
      setStyling,
      setName,
      resetWizard,
      canProceed,
    },
  ];
}

function validateContent(content: QRContentData): boolean {
  switch (content.type) {
    case 'wifi':
      return content.ssid.trim().length > 0;
    case 'vcard':
      return content.firstName.trim().length > 0 || content.lastName.trim().length > 0;
    case 'whatsapp':
      return content.phoneNumber.trim().length > 0;
    case 'social':
      return content.displayName.trim().length > 0;
    case 'business':
      return content.name.trim().length > 0;
    case 'menu':
      return content.restaurantName.trim().length > 0;
    case 'event':
      return content.title.trim().length > 0 && content.startDate.length > 0;
    case 'coupon':
      return content.code.trim().length > 0;
    case 'feedback':
      return content.title.trim().length > 0;
    case 'mp3':
      return content.title.trim().length > 0 && content.audioUrl.trim().length > 0;
    case 'images':
      return content.images.length > 0;
    case 'video':
      return content.videoUrl.trim().length > 0;
    case 'apps':
      return content.appName.trim().length > 0 && (!!content.iosUrl || !!content.androidUrl);
    case 'secret':
      return content.message.trim().length > 0 && content.pinCode.trim().length >= 4;
    case 'smartstore':
      return content.productUrl.trim().length > 0;
    case 'zapier':
      return content.webhookUrl.trim().length > 0;
    case 'n8n':
      return content.webhookUrl.trim().length > 0;
    default:
      return false;
  }
}
