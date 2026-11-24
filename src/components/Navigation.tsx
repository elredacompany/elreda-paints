import React from 'react';
import { Home, Calculator, Image as ImageIcon, Headphones, Palette, Bot } from 'lucide-react';
import { Screen } from '../types';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    {
      id: 'home' as Screen,
      label: 'الرئيسية',
      icon: Home,
    },
    {
      id: 'calculator' as Screen,
      label: 'حاسبة المواد',
      icon: Calculator,
    },
    {
      id: 'jotun_colors' as Screen,
      label: 'كتالوج الألوان',
      icon: Palette,
      badge: 'جوتن',
    },
    {
      id: 'portfolio' as Screen,
      label: 'معرض الأعمال',
      icon: ImageIcon,
    },
    {
      id: 'smart_advisor' as Screen,
      label: 'المستشار الذكي',
      icon: Bot,
      aiBadge: 'AI',
      highlight: true,
    },
    {
      id: 'customer_service' as Screen,
      label: 'خدمة العملاء',
      icon: Headphones,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#c87a3e]/25 py-1.5 px-1 sm:px-2.5 shadow-xl shadow-neutral-300/40">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-0.5 sm:gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 py-1 px-0.5 sm:px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all relative group cursor-pointer ${
                isActive
                  ? 'text-[#a85a22] font-black'
                  : 'text-[#78716c] hover:text-[#a85a22] font-semibold'
              }`}
            >
              {/* Active Copper Glow Pill */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 sm:w-8 h-1 bg-gradient-to-r from-[#df9b6d] to-[#8c4a1e] rounded-full shadow-md shadow-[#c87a3e]/40 animate-in fade-in zoom-in-75 duration-200"></span>
              )}

              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-br from-[#c87a3e]/20 to-[#8c4a1e]/10 text-[#a85a22] border border-[#c87a3e]/40 shadow-xs'
                    : tab.highlight
                    ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-[#a85a22] border border-[#c87a3e]/20'
                    : 'group-hover:bg-[#fbf7f4] text-[#78716c]'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                {tab.aiBadge && !isActive && (
                  <span className="absolute -top-1 -right-1 text-[7.5px] bg-[#c87a3e] text-white px-1 py-0.2 rounded-full font-bold shadow-xs">
                    {tab.aiBadge}
                  </span>
                )}
              </div>

              <span className="text-[9.5px] sm:text-[11px] tracking-tight leading-tight whitespace-nowrap text-center">
                {tab.label}
              </span>

              {tab.badge && !isActive && (
                <span className="absolute top-0 left-0.5 text-[7px] sm:text-[8px] bg-[#fdf8f4] text-[#a85a22] border border-[#c87a3e]/30 px-1 rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
