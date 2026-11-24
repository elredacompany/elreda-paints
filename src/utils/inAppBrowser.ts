export type SocialAppSource = 'facebook' | 'whatsapp' | 'instagram' | 'tiktok' | 'snapchat' | null;
export type DeviceOS = 'android' | 'ios' | 'other';

export interface InAppBrowserInfo {
  isInApp: boolean;
  os: DeviceOS;
  app: SocialAppSource;
  appLabelAr: string;
}

export function isEmbeddedIframe(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  try {
    const nav = navigator as Navigator & { standalone?: boolean };
    return (
      window.matchMedia?.('(display-mode: standalone)').matches === true ||
      nav.standalone === true ||
      (typeof document !== 'undefined' && document.referrer.includes('android-app://'))
    );
  } catch {
    return false;
  }
}

export function detectDeviceOS(ua: string): DeviceOS {
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  return 'other';
}

export function detectSocialApp(ua: string): { app: SocialAppSource; appLabelAr: string } {
  if (/TikTok|BytedanceWebview|musical_ly|ByteLocale|Aweme|trill/i.test(ua)) {
    return { app: 'tiktok', appLabelAr: 'تيك توك (TikTok)' };
  }
  if (/Instagram/i.test(ua)) {
    return { app: 'instagram', appLabelAr: 'إنستجرام (Instagram)' };
  }
  if (/WhatsApp/i.test(ua)) {
    return { app: 'whatsapp', appLabelAr: 'واتساب (WhatsApp)' };
  }
  if (/Snapchat/i.test(ua)) {
    return { app: 'snapchat', appLabelAr: 'سناب شات (Snapchat)' };
  }
  if (/FBAN|FBAV|FB_IAB|FBIOS|FB4A|Messenger|Orca-Android/i.test(ua)) {
    return { app: 'facebook', appLabelAr: 'فيسبوك (Facebook)' };
  }
  return { app: null, appLabelAr: '' };
}

export function detectInAppBrowser(): InAppBrowserInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { isInApp: false, os: 'other', app: null, appLabelAr: '' };
  }

  if (isEmbeddedIframe() || isStandalonePWA()) {
    return {
      isInApp: false,
      os: detectDeviceOS(navigator.userAgent || ''),
      app: null,
      appLabelAr: '',
    };
  }

  const ua = navigator.userAgent || '';
  const os = detectDeviceOS(ua);
  const { app, appLabelAr } = detectSocialApp(ua);

  return {
    isInApp: app !== null,
    os,
    app,
    appLabelAr,
  };
}

export function buildAndroidChromeIntentUrl(currentUrl: string): string {
  try {
    const parsed = new URL(currentUrl);
    const scheme = parsed.protocol.replace(':', '') || 'https';
    const hostAndPath = `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
    return `intent://${hostAndPath}#Intent;scheme=${scheme};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(
      currentUrl
    )};end`;
  } catch {
    const stripped = currentUrl.replace(/^https?:\/\//i, '');
    return `intent://${stripped}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(
      currentUrl
    )};end`;
  }
}

export function buildIOSSafariUrl(currentUrl: string): string {
  return `x-safari-${currentUrl}`;
}

export function getExternalBrowserRedirectUrl(os: DeviceOS, currentUrl: string): string {
  if (os === 'android') {
    return buildAndroidChromeIntentUrl(currentUrl);
  }
  if (os === 'ios') {
    return buildIOSSafariUrl(currentUrl);
  }
  return currentUrl;
}
