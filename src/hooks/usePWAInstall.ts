import { useState, useEffect, useCallback } from 'react';
import { isStandalonePWA } from '../utils/inAppBrowser';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    __deferredPWAInstallPrompt?: BeforeInstallPromptEvent | null;
    __pwaInstalled?: boolean;
  }
}

const DISMISSED_KEY = 'pwa_dismissed';
const INSTALLED_KEY = 'alreda_app_installed_v1';

function detectIOS(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const classicIOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
  const iPadOS =
    navigator.platform === 'MacIntel' &&
    typeof navigator.maxTouchPoints === 'number' &&
    navigator.maxTouchPoints > 1;
  return classicIOS || iPadOS;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.__deferredPWAInstallPrompt ?? null;
  });
  const [isIOS, setIsIOS] = useState<boolean>(() => detectIOS());
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return (
        Boolean(window.__pwaInstalled) ||
        isStandalonePWA() ||
        window.localStorage.getItem(INSTALLED_KEY) === '1'
      );
    } catch {
      return isStandalonePWA();
    }
  });
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem(DISMISSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsIOS(detectIOS());
    const standalone =
      Boolean(window.__pwaInstalled) ||
      isStandalonePWA() ||
      (() => {
        try {
          return window.localStorage.getItem(INSTALLED_KEY) === '1';
        } catch {
          return false;
        }
      })();
    if (standalone) {
      setIsStandalone(true);
    }

    if (window.__deferredPWAInstallPrompt) {
      setDeferredPrompt(window.__deferredPWAInstallPrompt);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvt = e as BeforeInstallPromptEvent;
      window.__deferredPWAInstallPrompt = promptEvt;
      setDeferredPrompt(promptEvt);
    };

    const handleEarlyCaptured = () => {
      if (window.__deferredPWAInstallPrompt) {
        setDeferredPrompt(window.__deferredPWAInstallPrompt);
      }
    };

    const handleAppInstalled = () => {
      window.__deferredPWAInstallPrompt = null;
      window.__pwaInstalled = true;
      setDeferredPrompt(null);
      setIsStandalone(true);
      try {
        window.localStorage.setItem(INSTALLED_KEY, '1');
      } catch {
        // ignore storage errors
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('alreda:beforeinstallprompt', handleEarlyCaptured);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('alreda:appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('alreda:beforeinstallprompt', handleEarlyCaptured);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('alreda:appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    const promptEvt =
      deferredPrompt || (typeof window !== 'undefined' ? window.__deferredPWAInstallPrompt : null);

    if (!promptEvt) {
      return 'unavailable';
    }

    try {
      await promptEvt.prompt();
      const { outcome } = await promptEvt.userChoice;
      window.__deferredPWAInstallPrompt = null;
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        window.__pwaInstalled = true;
        setIsStandalone(true);
        try {
          window.localStorage.setItem(INSTALLED_KEY, '1');
        } catch {
          // ignore
        }
      }
      return outcome;
    } catch {
      return 'unavailable';
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    setDismissed(true);
  }, []);

  return {
    install,
    isIOS,
    isStandalone,
    dismissed,
    dismiss,
    hasNativePrompt: Boolean(deferredPrompt),
  };
}
