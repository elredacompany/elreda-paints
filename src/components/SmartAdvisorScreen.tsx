import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Phone,
  MessageCircle,
  RotateCcw,
  Palette,
  ArrowRight
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { OFFICIAL_JOTUN_PALETTE } from '../data/jotunColors';
import { JotunColor, Screen } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface SmartAdvisorScreenProps {
  onNavigate: (screen: Screen) => void;
  onOpenColorInCatalog?: (color: JotunColor) => void;
}

function normalizeArabicForMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .trim();
}

function extractMentionedJotunColors(text: string): JotunColor[] {
  if (!text) return [];
  const norm = normalizeArabicForMatch(text);
  const found: JotunColor[] = [];
  const seen = new Set<string>();

  for (const color of OFFICIAL_JOTUN_PALETTE) {
    if (seen.has(color.id)) continue;
    const codeRegex = new RegExp(`(?:^|\\D)${color.code}(?:\\D|$)`);
    const ar = normalizeArabicForMatch(color.nameAr);
    const en = color.nameEn.toLowerCase();
    const matchesCode = codeRegex.test(text);
    const matchesName =
      (ar.length >= 4 && norm.includes(ar)) || (en.length >= 4 && norm.includes(en));

    if (matchesCode || matchesName) {
      seen.add(color.id);
      found.push(color);
      if (found.length >= 6) break;
    }
  }
  return found;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    text: `أهلاً بك في **الرضا للدهانات والديكور**!\nنغطي **القاهرة الكبرى بالكامل**، وأقدر أساعدك فوراً في:\n• **الخدمات:** تأسيس، تشطيب، شيبورد، ورق حائط، بديل رخام (كل جديد وقديم في عالم الدهانات).\n• **حسابات الكميات التقريبية** حسب مساحة الأرضية وألوان جوتن الرسمية مع الانتقال المباشر لكتالوج الألوان.\n• **التواصل والمعاينة:** **${COMPANY_INFO.phone}** (اتصال أو واتساب).`,
    timestamp: 'الآن',
  },
];

const SUGGESTED_QUESTIONS = [
  'شقة 70 متر أرضية محتاجة خامات إيه؟',
  'عايز تفاصيل لون لايمستون 10341',
  'إيه هو لون البريز 0552؟',
  'إيه أسعاركم ومدة التنفيذ؟',
  'إيه الخدمات اللي بتقدموها؟',
  'بتغطوا مناطق إيه؟',
  'ليه أختار الرضا للدهانات؟',
];

export function SmartAdvisorScreen({ onNavigate, onOpenColorInCatalog }: SmartAdvisorScreenProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Keyboard and Visual Viewport Handling
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
        setTimeout(scrollToBottom, 100);
      }
    };

    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    const botMsgId = `bot-${Date.now()}`;
    const botTimestamp = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    let hasCreatedBotMsg = false;
    let accumulatedText = '';

    const appendBotText = (chunkText: string) => {
      if (!chunkText) return;
      accumulatedText += chunkText;
      if (!hasCreatedBotMsg) {
        hasCreatedBotMsg = true;
        setIsTyping(false);
        setStreamingMsgId(botMsgId);
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            role: 'assistant',
            text: accumulatedText,
            timestamp: botTimestamp,
          },
        ]);
      } else {
        const snapshot = accumulatedText;
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, text: snapshot } : m))
        );
      }
    };

    const controller = new AbortController();
    
    // تم تعديل الوقت هنا إلى 30000 (30 ثانية)
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          history: messages
            .filter((m) => m.id !== 'welcome-msg')
            .slice(-6)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) {
        if (res.status === 504) {
          throw new DOMException('Request timeout', 'AbortError');
        }
        throw new Error(`Server returned ${res.status}`);
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === '[DONE]') continue;

            try {
              const parsed = JSON.parse(payload);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                appendBotText(parsed.text);
              }
            } catch (parseErr) {
              if (parseErr instanceof SyntaxError) continue;
              throw parseErr;
            }
          }
        }
      } else {
        const data = await res.json();
        appendBotText(
          data.reply ||
            `أقدر أساعدك فوراً في حساب كميات الدهانات أو ترشيح ألوان جوتن الرسمية. للتواصل المباشر: ${COMPANY_INFO.phone}`
        );
      }

      if (!hasCreatedBotMsg) {
        appendBotText(
          `أقدر أساعدك فوراً في حساب كميات الدهانات أو ترشيح ألوان جوتن الرسمية. للتواصل المباشر: ${COMPANY_INFO.phone}`
        );
      }
    } catch (err: any) {
      const timeoutMsg = `عذراً، الاتصال بطيء حالياً. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة على ${COMPANY_INFO.phone} (اتصال أو واتساب).`;
      const isTimeoutAbort =
        err?.name === 'AbortError' ||
        controller.signal.aborted ||
        err?.message === timeoutMsg;
      if (!isTimeoutAbort) {
        console.error('Chat error:', err);
      }
      const fallbackText = isTimeoutAbort
        ? timeoutMsg
        : `يمكنك سؤالي مباشرة عن حساب خامات أي مساحة أرضية (مثل 70م أو 120م) أو أكواد ألوان جوتن الرسمية، أو التواصل معنا فوراً على **${COMPANY_INFO.phone}**.`;

      if (!hasCreatedBotMsg) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-fallback-${Date.now()}`,
            role: 'assistant',
            text: fallbackText,
            timestamp: botTimestamp,
          },
        ]);
      } else if (isTimeoutAbort) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? { ...m, text: `${m.text}\n\n${timeoutMsg}` }
              : m
          )
        );
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsTyping(false);
      setIsLoading(false);
      setStreamingMsgId(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputText('');
  };

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-extrabold text-[#9b4916]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <p key={idx} className="leading-relaxed my-0.5">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div
      style={viewportHeight ? { height: `${viewportHeight - 64}px` } : undefined}
      className="flex flex-col h-full max-h-full w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-[#c87a3e]/20 overflow-hidden relative transition-all duration-150"
    >
      {/* 1. Ultra-Slim Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white px-3 sm:px-4 py-2 flex items-center justify-between border-b border-[#c87a3e]/30 shrink-0">
        <div className="flex items-center gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="رجوع للرئيسية"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mini Bot Avatar */}
          <div className="relative w-8 h-8 rounded-xl copper-btn-gradient flex items-center justify-center text-white shadow-xs shrink-0">
            <Bot className="w-4 h-4 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -left-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-neutral-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs sm:text-sm text-white">المستشار الذكي</span>
              <span className="text-[9px] bg-[#c87a3e]/25 text-[#e49b64] border border-[#c87a3e]/40 px-1.5 py-0.2 rounded-md font-mono">
                AI
              </span>
            </div>
          </div>
        </div>

        {/* Compact Action Icons / Buttons */}
        <div className="flex items-center gap-1.5">
          {/* WhatsApp Mini Button */}
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-xs"
            title="واتساب مباشر لحجز معاينة"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>

          {/* Direct Call Mini Button */}
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="w-7 h-7 rounded-lg copper-btn-gradient text-white flex items-center justify-center transition-all shadow-xs"
            title="اتصال هاتفي مباشر"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>

          {/* Jotun Catalog Shortcut */}
          <button
            type="button"
            onClick={() => onNavigate('jotun_colors')}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 flex items-center justify-center transition-colors cursor-pointer"
            title="كتالوج ألوان جوتن"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {/* Reset Chat */}
          <button
            type="button"
            onClick={handleResetChat}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="إعادة بدء المحادثة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Messages Scroll Area (Maximized) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gradient-to-b from-neutral-50/70 to-white">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          const mentionedColors = isBot ? extractMentionedJotunColors(msg.text) : [];
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} animate-in fade-in duration-200`}
            >
              <div className="flex items-start gap-1.5 max-w-[94%] sm:max-w-[85%]">
                {isBot && (
                  <div className="w-6 h-6 rounded-lg copper-btn-gradient text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-2xs leading-relaxed ${
                      isBot
                        ? 'bg-white text-neutral-800 border border-neutral-200/90 rounded-tr-xs'
                        : 'copper-btn-gradient text-white font-medium rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {isBot ? formatMessageText(msg.text) : msg.text}
                    {isBot && streamingMsgId === msg.id && (
                      <span className="inline-flex items-center gap-0.5 mr-1.5 align-middle">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c87a3e] animate-pulse" />
                      </span>
                    )}

                    {/* Clickable Jotun Colors -> Direct Redirect to Color Catalog */}
                    {isBot && mentionedColors.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
                        {mentionedColors.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() =>
                              onOpenColorInCatalog
                                ? onOpenColorInCatalog(color)
                                : onNavigate('jotun_colors')
                            }
                            className="flex items-center gap-2 bg-[#faf5f0] hover:bg-[#c87a3e]/15 border border-[#c87a3e]/35 rounded-xl px-2.5 py-1.5 text-right transition-all cursor-pointer active:scale-95 shadow-2xs"
                            title={`اضغط لعرض لون ${color.nameAr} (${color.code}) في كتالوج الألوان`}
                          >
                            <span
                              className="w-4 h-4 rounded-md border border-black/15 shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-[11px] font-bold text-[#1c1917]">
                              {color.nameAr} <span className="font-mono text-[#9b4916]">{color.code}</span>
                            </span>
                            <span className="text-[10px] font-bold text-[#9b4916] flex items-center gap-0.5">
                              <Palette className="w-3 h-3" />
                              <span>كتالوج الألوان</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-0.5 px-1 block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Immediate Typing Indicator */}
        {isTyping && (
          <div className="flex flex-col items-start animate-in fade-in duration-100">
            <div className="flex items-start gap-1.5 max-w-[90%] sm:max-w-[80%]">
              <div className="w-6 h-6 rounded-lg copper-btn-gradient text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white border border-[#c87a3e]/30 rounded-2xl rounded-tr-xs px-3.5 py-2.5 flex items-center gap-2 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#c87a3e] animate-pulse" />
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#c87a3e] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-[#c87a3e] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#c87a3e] animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Sleek Quick Questions Chips (Pills) */}
      <div className="px-3 py-1.5 bg-neutral-50/90 border-t border-neutral-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <button
            key={i}
            type="button"
            disabled={isLoading}
            onClick={() => handleSendMessage(q)}
            className="shrink-0 text-[10px] sm:text-[11px] bg-white hover:bg-[#c87a3e]/10 text-neutral-700 hover:text-[#9b4916] border border-neutral-200 hover:border-[#c87a3e]/40 rounded-full px-2.5 py-1 transition-all text-right active:scale-95 disabled:opacity-50 font-medium shadow-2xs cursor-pointer whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 4. Docked Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2 sm:p-2.5 bg-white border-t border-neutral-200 flex items-center gap-2 shrink-0 shadow-sm"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={() => {
            setTimeout(scrollToBottom, 200);
          }}
          placeholder="اسأل المستشار الذكي عن الألوان والديكور..."
          disabled={isLoading}
          className="flex-1 bg-neutral-100/90 border border-neutral-300 focus:border-[#c87a3e] rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#c87a3e]/20 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="h-9 sm:h-10 px-3.5 rounded-xl copper-btn-gradient text-white flex items-center justify-center gap-1 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 active:scale-95 transition-all shadow-sm font-bold text-xs sm:text-sm cursor-pointer"
          title="إرسال"
        >
          <span className="hidden xs:inline">إرسال</span>
          <Send className="w-3.5 h-3.5 -scale-x-100" />
        </button>
      </form>
    </div>
  );
}
