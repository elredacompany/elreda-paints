import React, { useState, useEffect, useMemo } from 'react';
import { Screen, JotunColor, PortfolioItem, PaintBrandOption, GalleryStageItem } from './types';
import { LuxuryHeader } from './components/LuxuryHeader';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { CalculatorScreen } from './components/CalculatorScreen';
import { ContactScreen } from './components/ContactScreen';
import { PortfolioScreen } from './components/PortfolioScreen';
import { JotunColorsScreen } from './components/JotunColorsScreen';
import { ReviewsScreen } from './components/ReviewsScreen';
import { FaqScreen } from './components/FaqScreen';
import { CustomerServiceScreen } from './components/CustomerServiceScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { AboutScreen } from './components/AboutScreen';
import { TermsScreen } from './components/TermsScreen';
import { SplashScreen } from './components/SplashScreen';
import { SmartAdvisorScreen } from './components/SmartAdvisorScreen';
import { SmartOpenScreen } from './components/SmartOpenScreen';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { PWAInstallGuide } from './components/PWAInstallGuide';
import { detectInAppBrowser } from './utils/inAppBrowser';
import { CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { COMPANY_INFO, PORTFOLIO_ITEMS } from './data/companyData';
import { PAINT_COMPANY_OPTIONS, DEFAULT_COMPANY_COVERAGE } from './data/paintCompanies';
import {
  fetchPricesFromSupabase,
  fetchCompanyCoverageFromSupabase,
} from './services/supabase';
import {
  fetchPortfolioFromFirestore,
  fetchGalleryFromFirestore,
  fetchPricesFromFirestore,
  testFirestoreConnection,
  trackVisitorInFirestore,
} from './services/firebase';

const PORTFOLIO_CACHE_KEY = 'alreda_portfolio_items_v1';

export default function ClientApp() {
  const inAppInfo = useMemo(() => detectInAppBrowser(), []);

  const initialUrlParams = useMemo(() => {
    if (typeof window === 'undefined') {
      return { screen: 'home' as Screen, projectId: null as string | null };
    }
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    const screenParam = params.get('screen');
    const initialScreen: Screen =
      projectId || screenParam === 'portfolio' ? 'portfolio' : 'home';
    return { screen: initialScreen, projectId };
  }, []);

  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialUrlParams.screen);
  const [isAndroidFrame, setIsAndroidFrame] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Firestore & Catalog State (Client-facing read-only)
  const [paintBrandPrices, setPaintBrandPrices] = useState<PaintBrandOption[]>(PAINT_COMPANY_OPTIONS);
  const [isPricesFromSupabase, setIsPricesFromSupabase] = useState<boolean>(false);
  const [companyCoverageMap, setCompanyCoverageMap] = useState<Record<string, number>>(DEFAULT_COMPANY_COVERAGE);
  const [isCoverageFromSupabase, setIsCoverageFromSupabase] = useState<boolean>(false);
  const [galleryStages, setGalleryStages] = useState<GalleryStageItem[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(true);

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(PORTFOLIO_CACHE_KEY);
      if (saved) {
        const parsed: PortfolioItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((p) => !p.imageUrl?.includes('unsplash.com'));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return PORTFOLIO_ITEMS;
  });

  const [transferredSpecs, setTransferredSpecs] = useState<{
    area: number;
    estimatedCost: number;
    paintTypeName: string;
    roomImage?: string | null;
  } | null>(null);

  const [selectedColorForCalculator, setSelectedColorForCalculator] = useState<{
    name: string;
    code: string;
    hex: string;
  } | null>(null);

  const [catalogInitialSearch, setCatalogInitialSearch] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    if (inAppInfo.isInApp) return;
    let isMounted = true;

    async function loadClientCatalogData() {
      try {
        const testConn = await testFirestoreConnection();
        if (isMounted && testConn.connected) {
          void trackVisitorInFirestore();
          const [firestorePortRes, firestoreGalleryRes, firestorePricesRes] = await Promise.all([
            fetchPortfolioFromFirestore(),
            fetchGalleryFromFirestore(),
            fetchPricesFromFirestore(),
          ]);

          if (isMounted) {
            if (firestorePortRes.success && firestorePortRes.data.length > 0) {
              setPortfolioItems(firestorePortRes.data);
              try {
                localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(firestorePortRes.data));
              } catch {
                // ignore storage quota
              }
            }

            if (firestoreGalleryRes.success) {
              setGalleryStages(firestoreGalleryRes.data);
            }

            if (firestorePricesRes.success && firestorePricesRes.data.length > 0) {
              setPaintBrandPrices(firestorePricesRes.data);
              setIsPricesFromSupabase(true);
            }
          }
        }
      } catch (err) {
        console.warn('Client catalog load note:', err);
      } finally {
        if (isMounted) {
          setIsGalleryLoading(false);
        }
      }

      try {
        const [pricesRes, coverageRes] = await Promise.all([
          fetchPricesFromSupabase(),
          fetchCompanyCoverageFromSupabase(),
        ]);
        if (isMounted && pricesRes.success && pricesRes.isFromSupabase) {
          setPaintBrandPrices(pricesRes.data);
          setIsPricesFromSupabase(true);
        }
        if (isMounted && coverageRes.success && coverageRes.isFromSupabase) {
          setCompanyCoverageMap(coverageRes.coverageMap);
          setIsCoverageFromSupabase(true);
        }
      } catch {
        // optional Supabase fallback
      }
    }

    loadClientCatalogData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (screen: Screen) => {
    if (screen === 'jotun_colors') {
      setCatalogInitialSearch('');
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddColorToCalculator = (color: { name: string; code: string; hex: string }) => {
    setSelectedColorForCalculator(color);
    setCurrentScreen('calculator');
    showToast(`تمت إضافة لون ${color.name} إلى حاسبة المواد`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenColorInCatalog = (color: JotunColor) => {
    setCatalogInitialSearch(color.code);
    setCurrentScreen('jotun_colors');
    showToast(`فتح لون ${color.nameAr} (${color.code}) في كتالوج الألوان`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToContactWithSpecs = (specs: {
    area: number;
    estimatedCost: number;
    paintTypeName: string;
    roomImage?: string | null;
  }) => {
    setTransferredSpecs(specs);
    setCurrentScreen('contact');
    showToast('تم إرفاق حسابات الغرفة في طلب المعاينة');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToContactWithProject = (projectTitle: string) => {
    setTransferredSpecs({
      area: 0,
      estimatedCost: 0,
      paintTypeName: `تشطيب مماثل لمشروع: ${projectTitle}`,
    });
    setCurrentScreen('contact');
    showToast(`تم اختيار مشروع: ${projectTitle}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectColorForInspection = (color: JotunColor) => {
    setTransferredSpecs({
      area: 0,
      estimatedCost: 0,
      paintTypeName: `طلب دهان لون جوتن: ${color.nameAr} (${color.nameEn}) كود ${color.code} [HEX: ${color.hex}]`,
    });
    setCurrentScreen('contact');
    showToast(`تم اختيار لون جوتن: ${color.nameAr} (${color.code})`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const appContent = (
    <div
      className={`min-h-screen bg-[#f8f9fa] text-[#1c1917] flex flex-col ${
        currentScreen === 'smart_advisor'
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
          : 'justify-between'
      } selection:bg-[#c87a3e] selection:text-white`}
    >
      <SmartOpenScreen />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <div
        className={
          currentScreen === 'smart_advisor'
            ? 'flex-1 min-h-0 flex flex-col overflow-hidden pb-0'
            : ''
        }
      >
        <LuxuryHeader
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          isAndroidFrame={isAndroidFrame}
          onToggleAndroidFrame={() => setIsAndroidFrame(!isAndroidFrame)}
          isInAppBrowser={inAppInfo.isInApp}
        />

        {currentScreen === 'smart_advisor' ? (
          <main className="flex-1 min-h-0 flex flex-col w-full px-2 sm:px-4 pt-1 sm:pt-2 overflow-hidden animate-in fade-in duration-200">
            <SmartAdvisorScreen
              onNavigate={handleNavigate}
              onOpenColorInCatalog={handleOpenColorInCatalog}
            />
          </main>
        ) : (
          <main className="max-w-5xl mx-auto px-4 py-5 sm:py-7 w-full animate-in fade-in duration-200">
            {currentScreen === 'home' && (
              <HomeScreen
                onNavigate={handleNavigate}
                portfolioItems={portfolioItems}
                galleryStages={galleryStages}
                isGalleryLoading={isGalleryLoading}
              />
            )}

            {currentScreen === 'jotun_colors' && (
              <JotunColorsScreen
                onBackToHome={() => handleNavigate('home')}
                onSelectColorForInspection={handleSelectColorForInspection}
                onNavigate={handleNavigate}
                onAddColorToCalculator={handleAddColorToCalculator}
                initialSearchQuery={catalogInitialSearch}
              />
            )}

            {currentScreen === 'calculator' && (
              <CalculatorScreen
                onNavigateToContactWithSpecs={handleNavigateToContactWithSpecs}
                onNavigate={handleNavigate}
                initialSelectedColor={selectedColorForCalculator}
                paintBrands={paintBrandPrices}
                isPricesFromSupabase={isPricesFromSupabase}
                companyCoverageMap={companyCoverageMap}
                isCoverageFromSupabase={isCoverageFromSupabase}
              />
            )}

            {currentScreen === 'customer_service' && (
              <CustomerServiceScreen onNavigate={handleNavigate} />
            )}

            {currentScreen === 'feedback' && (
              <FeedbackScreen onBackToHome={() => handleNavigate('home')} />
            )}

            {currentScreen === 'about' && (
              <AboutScreen onNavigate={handleNavigate} />
            )}

            {currentScreen === 'contact' && (
              <ContactScreen
                initialSpecs={transferredSpecs}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'portfolio' && (
              <PortfolioScreen
                onNavigateToContactWithProject={handleNavigateToContactWithProject}
                onNavigate={handleNavigate}
                portfolioItems={portfolioItems}
                initialSelectedProjectId={initialUrlParams.projectId}
                onShowToast={showToast}
              />
            )}

            {currentScreen === 'reviews' && (
              <ReviewsScreen
                onBackToHome={() => handleNavigate('home')}
                onNavigateToContact={() => handleNavigate('contact')}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'faq' && (
              <FaqScreen
                onBackToHome={() => handleNavigate('home')}
                onNavigateToContact={() => handleNavigate('contact')}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'terms' && (
              <TermsScreen
                onBackToHome={() => handleNavigate('home')}
                onNavigateToContact={() => handleNavigate('contact')}
                onNavigate={handleNavigate}
              />
            )}
          </main>
        )}

        {currentScreen !== 'smart_advisor' && (
          <footer className="w-full py-6 px-4 pb-28 text-xs text-[#57534e] bg-white/85 border-t border-neutral-200/80 mt-6 select-none">
            <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 text-center">
              {/* Footer Official Logo */}
              <div className="bg-white rounded-2xl px-4 py-2 border border-[#c87a3e]/20 shadow-xs">
                <img
                  src={COMPANY_INFO.logoUrl}
                  alt={COMPANY_INFO.name}
                  width={1632}
                  height={964}
                  loading="lazy"
                  decoding="async"
                  className="h-14 sm:h-16 w-auto object-contain mx-auto"
                />
              </div>

              {/* Social Media Icons & Links */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={COMPANY_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="صفحة فيسبوك الرضا للدهانات والديكورات"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/25 font-bold text-xs transition-all active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                  <span>فيسبوك</span>
                </a>

                <a
                  href={COMPANY_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="حساب إنستجرام الرضا للدهانات والديكورات"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E1306C]/10 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-[#E1306C] hover:text-white border border-[#E1306C]/25 font-bold text-xs transition-all active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>إنستجرام</span>
                </a>
              </div>

              {/* Terms & Copyright */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#78716c]">
                <span>© {new Date().getFullYear()} {COMPANY_INFO.name} - تنفيذ وتشطيبات فاخرة</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleNavigate('terms')}
                  className="text-[#a85a22] hover:underline font-bold cursor-pointer"
                >
                  الشروط والأحكام
                </button>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Floating Fast Call Buttons (Hidden on smart_advisor, jotun_colors, and calculator so text/cards are never covered) */}
      {currentScreen !== 'smart_advisor' &&
        currentScreen !== 'jotun_colors' &&
        currentScreen !== 'calculator' && (
          <div className="fixed bottom-20 left-4 z-30 flex flex-col gap-2">
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 transition-transform active:scale-95"
              title="محادثة واتساب"
            >
              <MessageCircle className="w-6 h-6 stroke-[2.3]" />
            </a>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="w-12 h-12 rounded-full copper-btn-gradient text-white flex items-center justify-center shadow-lg shadow-[#c87a3e]/30 transition-transform active:scale-95"
              title="اتصال هاتفي مباشر"
            >
              <Phone className="w-5 h-5 stroke-[2.5]" />
            </a>
          </div>
        )}

      {currentScreen !== 'smart_advisor' && (
        <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}

      {toastMessage && (
        <div className="fixed bottom-20 right-1/2 translate-x-1/2 z-50 bg-white text-[#a85a22] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-2xl border border-[#c87a3e]/40 backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {!inAppInfo.isInApp && currentScreen !== 'smart_advisor' && (
        <>
          <PWAInstallBanner />
          <PWAInstallGuide />
        </>
      )}
    </div>
  );

  if (isAndroidFrame) {
    return (
      <div className="min-h-screen bg-neutral-900 py-6 px-3 flex items-center justify-center">
        <div className="w-full max-w-[430px] bg-[#f8f9fa] rounded-[48px] shadow-2xl border-[10px] border-[#e7e5e4] overflow-hidden relative flex flex-col min-h-[880px] max-h-[94vh]">
          <div className="bg-[#f8f9fa] text-[#57534e] text-[11px] px-7 py-2.5 flex items-center justify-between font-mono shrink-0 select-none border-b border-neutral-200">
            <span className="font-bold">12:30</span>
            <div className="w-4 h-4 rounded-full bg-neutral-200 border border-neutral-300"></div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          <div
            className={`flex-1 flex flex-col ${
              currentScreen === 'smart_advisor'
                ? 'overflow-hidden h-full relative'
                : 'overflow-y-auto justify-between'
            }`}
          >
            {appContent}
          </div>

          <div className="bg-[#f8f9fa] py-2 flex justify-center items-center shrink-0 border-t border-neutral-200">
            <div className="w-32 h-1 bg-[#c87a3e]/60 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return appContent;
}
