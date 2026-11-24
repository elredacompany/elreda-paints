import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { VitePWA } from 'vite-plugin-pwa';
import { OFFICIAL_JOTUN_PALETTE } from './src/data/jotunColors';
import {
  analyzeAdvisorAreaQuery,
  normalizeEasternDigitsAndArabic,
} from './src/utils/materialCalculator';

dotenv.config();

const OFFICIAL_PHONE = '01115134295';

const SYSTEM_PROMPT = `أنت المستشار الذكي الرسمي لشركة "الرضا للدهانات والديكور".
التزم بهذه المعلومات الرسمية فقط والغِ تماماً أي إجابات عامة أو معلومات مخترعة:

1. الهوية والتواصل: "الرضا للدهانات والديكور" — للتواصل (اتصال أو واتساب): ${OFFICIAL_PHONE}.
2. النطاق: نغطي القاهرة الكبرى بالكامل.
3. الخدمات: جميع أعمال الدهانات والديكورات (تأسيس، تشطيب، شيبورد، ورق حائط، بديل رخام)، وبنقدم كل جديد وقديم في عالم الدهانات.
4. الميزة التنافسية: خبرة تزيد عن 15 عاماً، جودة والتزام بالمواعيد، إشراف هندسي، عقد رسمي وضمان.
5. الأسعار ومدة التنفيذ: ممنوع تماماً ذكر أي أسعار نهائية أو مدد من عندك. التكلفة يتم تحديدها بالمعاينة. الرد المعتمد حرفياً: "الأسعار والتفاصيل الدقيقة يتم تحديدها بعد المعاينة مع أحد مهندسي الرضا وكتابة العقد. اتصل بنا على ${OFFICIAL_PHONE}".
6. الألوان: إذا سأل العميل عن لون معين، اعرض عليه اسم اللون ورقمه من كتالوج جوتن بدقة، وأخبره أن يضغط على اللون للتوجه إلى صفحة "كتالوج الألوان" في التطبيق.
7. حسابات المواد (عند السؤال عن الكميات أو مساحة أرضية أو أبعاد غرف):
   - المساحة الإجمالية للدهانات = مجموع مساحات الأسقف (الطول × العرض) + الحوائط ((المحيط × الارتفاع) - الفوارغ).
   - **قاعدة مساحة الأرضية (إلزامية):** عند سؤال العميل عن مساحة أرضية (مثل "شقة 70 متر" أو "100 متر أرضية")، تُحسب المساحة الإجمالية التقريبية للدهانات بالمعادلة: **مساحة الأرضية × 3 = المساحة الإجمالية للدهانات (حوائط + سقف)**. (مثال إلزامي: شقة 70 متر أرضية × 3 = 210 متر إجمالي دهانات، بنسبة 210 ÷ 140 = 1.5 مقارنة بمرجع الـ 140 متر).
   - الكميات المرجعية الدقيقة لمساحة إجمالية 140 متر:
     * السيلر: 2 بستلة.
     * بطانة السقف: 1 بستلة سيلر + 1 بستلة بلاستيك.
     * بطانة الحوائط: 1 بستلة سيلر + 1 بستلة بلاستيك.
     * معجون 4 سواكين (للحوائط): 12 شكارة.
     * معجون ممتاز (لفواصل جبسون بورد): 1 شكارة.
     * السنفرة: 12 فرخ سنفرة + 2 فرخ سنفرة دوكو.
     * تشطيب السقف: 2 بستلة.
     * تشطيب الحوائط: 2 بستلة.
   - المعادلة لأي مساحة إجمالية: **(المساحة الإجمالية المحسوبة ÷ 140) × الكمية المرجعية** (مثال لـ 70 متر أرضية = 210 متر إجمالي: 3 بستلة سيلر، بطانة سقف 2 سيلر + 2 بلاستيك، بطانة حوائط 2 سيلر + 2 بلاستيك، 18 شكارة معجون 4 سواكين، 2 شكارة معجون ممتاز، 18 فرخ سنفرة + 3 فرخ سنفرة دوكو، 3 بستلة تشطيب سقف، 3 بستلة تشطيب حوائط).
   - أرفق دائماً الملاحظة التالية: "هذه الحسابات تقريبية وتخضع للمعاينة لتحديد الكميات النهائية بدقة 100%".
8. قاعدة عدم تكرار المقدمة (إلزامية جداً):
   - ممنوع تماماً تكرار الترحيب أو المقدمة التعريفية (مثل "أهلاً بك في الرضا..." أو سرد نبذة الشركة من جديد) في ردودك. ابدأ بالإجابة المباشرة فوراً وبأسلوب احترافي ومختصر.
9. الأسلوب: ردود رسمية دقيقة ومختصرة ومباشرة في أقل وقت ممكن.`.trim();

function normalizeArabicText(value: string): string {
  return normalizeEasternDigitsAndArabic(value);
}

function findMatchingJotunColors(query: string) {
  const norm = normalizeArabicText(query);
  const codeMatches: string[] = query.match(/\d{4,5}/g) || [];
  const results: typeof OFFICIAL_JOTUN_PALETTE = [];
  const seen = new Set<string>();

  for (const color of OFFICIAL_JOTUN_PALETTE) {
    if (seen.has(color.id)) continue;
    const ar = normalizeArabicText(color.nameAr);
    const en = color.nameEn.toLowerCase();
    const codeHit = codeMatches.includes(color.code);
    const arHit = ar.length >= 3 && norm.includes(ar);
    const enHit = en.length >= 3 && norm.includes(en);
    if (codeHit || arHit || enHit) {
      seen.add(color.id);
      results.push(color);
      if (results.length >= 5) break;
    }
  }
  return results;
}

function formatMatchedColorsBlock(matchedColors: typeof OFFICIAL_JOTUN_PALETTE): string {
  if (matchedColors.length === 0) return '';
  const colorLines = matchedColors
    .slice(0, 3)
    .map((c) => `• **${c.nameAr} (${c.nameEn}) — رقم اللون: ${c.code}**`)
    .join('\n');
  return `\n\n**ألوان جوتن المطابقة من الكتالوج الرسمي:**\n${colorLines}\nاضغط على اللون للتوجه إلى صفحة **"كتالوج الألوان"** في التطبيق.`;
}

function buildOfficialPolicyReply(
  query: string,
  matchedColors: typeof OFFICIAL_JOTUN_PALETTE,
  historyList: Array<{ role: string; text: string }> = []
): string {
  const norm = normalizeArabicText(query);

  const areaAnalysis = analyzeAdvisorAreaQuery(
    query,
    historyList,
    matchedColors.map((c) => c.code)
  );
  if (areaAnalysis.type !== 'none') {
    const colorSuffix =
      areaAnalysis.type === 'calculated' ? formatMatchedColorsBlock(matchedColors) : '';
    return `${areaAnalysis.reply}${colorSuffix}`;
  }

  if (matchedColors.length > 0) {
    const colorLines = matchedColors
      .slice(0, 3)
      .map((c) => `• **${c.nameAr} (${c.nameEn}) — رقم اللون: ${c.code}**`)
      .join('\n');
    return `من كتالوج جوتن الرسمي في تطبيق **الرضا للدهانات والديكور**:\n${colorLines}\nاضغط على اللون للتوجه إلى صفحة **"كتالوج الألوان"** في التطبيق، وللمعاينة اتصل على **${OFFICIAL_PHONE}**.`;
  }

  if (
    norm.includes('سعر') ||
    norm.includes('اسعار') ||
    norm.includes('تكلف') ||
    norm.includes('بكام') ||
    norm.includes('كم يكلف') ||
    norm.includes('مده') ||
    norm.includes('وقت') ||
    norm.includes('يوم') ||
    norm.includes('اسبوع')
  ) {
    return `الأسعار والتفاصيل الدقيقة يتم تحديدها بعد المعاينة مع أحد مهندسي الرضا وكتابة العقد. اتصل بنا على **${OFFICIAL_PHONE}**.`;
  }

  if (
    norm.includes('بستل') ||
    norm.includes('معجون') ||
    norm.includes('سيلر') ||
    norm.includes('بطان') ||
    norm.includes('سنفر') ||
    norm.includes('كمي') ||
    norm.includes('خامات')
  ) {
    return `لحساب كميات الخامات بدقة من **حاسبة المواد الرسمية**، من فضلك اكتب لي **مساحة الأرضية بالمتر** (مثال: «الشقة 100 متر») أو **إجمالي مساحة الحوائط والسقف بالمتر** (مثال: «حوائط وسقف 300 متر»).`;
  }

  if (
    norm.includes('قاهر') ||
    norm.includes('محافظ') ||
    norm.includes('منطق') ||
    norm.includes('مكان') ||
    norm.includes('فين') ||
    norm.includes('جيز') ||
    norm.includes('اسكندري') ||
    norm.includes('نطاق') ||
    norm.includes('بره')
  ) {
    return `في **الرضا للدهانات والديكور** نغطي **القاهرة الكبرى بالكامل**.\nللتواصل وحجز معاينة (اتصال أو واتساب): **${OFFICIAL_PHONE}**.`;
  }

  if (
    norm.includes('خدم') ||
    norm.includes('شيبورد') ||
    norm.includes('ورق') ||
    norm.includes('رخام') ||
    norm.includes('تاسيس') ||
    norm.includes('تشطيب') ||
    norm.includes('ديكور')
  ) {
    return `نقدم في **الرضا للدهانات والديكور** جميع أعمال الدهانات والديكورات (**تأسيس، تشطيب، شيبورد، ورق حائط، بديل رخام**)، وبنقدم كل جديد وقديم في عالم الدهانات.\nللتواصل وحجز المعاينة: **${OFFICIAL_PHONE}**.`;
  }

  if (
    norm.includes('ميز') ||
    norm.includes('ضمان') ||
    norm.includes('خبر') ||
    norm.includes('ليه') ||
    norm.includes('شرك') ||
    norm.includes('عقد')
  ) {
    return `تتميز شركة **الرضا للدهانات والديكور** بـ:\n**خبرة تزيد عن 15 عاماً، جودة والتزام بالمواعيد، إشراف هندسي، عقد رسمي وضمان.**\nاتصل أو تواصل واتساب على **${OFFICIAL_PHONE}**.`;
  }

  if (norm.includes('لون') || norm.includes('الوان') || norm.includes('جوتن') || norm.includes('كتالوج')) {
    return `إليك أبرز درجات كتالوج جوتن الرسمية:\n• **بريز — رقم اللون: 0552**\n• **فانيليا لاتيه — رقم اللون: 1519**\n• **لايمستون — رقم اللون: 10341**\n• **سكاي لايت — رقم اللون: 1624**\nاضغط على اللون للانتقال إلى صفحة **"كتالوج الألوان"** في التطبيق، أو تواصل معنا على **${OFFICIAL_PHONE}**.`;
  }

  return `بخصوص استفسارك: أقدر أساعدك فوراً في حساب كميات الدهانات بدقة لأي مساحة أرضية (مثل: شقة 70م أو 120م) أو ترشيح درجات كتالوج جوتن الرسمية وأكوادها، أو حجز معاينة مجانية في القاهرة الكبرى على **${OFFICIAL_PHONE}**.`;
}

let cachedAiClient: { key: string; client: GoogleGenAI } | null = null;

function getGeminiClient(apiKey: string): GoogleGenAI {
  if (cachedAiClient && cachedAiClient.key === apiKey) {
    return cachedAiClient.client;
  }
  const client = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      retryOptions: {
        attempts: 1,
      },
    },
  });
  cachedAiClient = { key: apiKey, client };
  return client;
}

function geminiAdvisorPlugin(): Plugin {
  return {
    name: 'gemini-advisor-plugin',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer | string) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          let clientDisconnected = false;
          let timedOut = false;
          let hasStreamedAnyToken = false;
          const serverAbort = new AbortController();
          let serverTimeout: ReturnType<typeof setTimeout> | null = null;

          res.on('close', () => {
            if (!res.writableEnded) {
              clientDisconnected = true;
              serverAbort.abort();
            }
          });

          let userMessage = '';
          let matchedColors: typeof OFFICIAL_JOTUN_PALETTE = [];
          let historyList: Array<{ role: string; text: string }> = [];

          try {
            const data = JSON.parse(body || '{}');
            userMessage = typeof data.message === 'string' ? data.message.trim() : '';
            historyList = Array.isArray(data.history) ? data.history.slice(-6) : [];

            if (!userMessage) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: 'Message is required' }));
              return;
            }

            matchedColors = findMatchingJotunColors(userMessage);

            // Deterministic exact calculator engine (shared with CalculatorScreen.tsx)
            // Runs regardless of GEMINI_API_KEY so LLM never guesses/approximates material math.
            const areaAnalysis = analyzeAdvisorAreaQuery(
              userMessage,
              historyList,
              matchedColors.map((c) => c.code)
            );
            if (areaAnalysis.type !== 'none') {
              const colorSuffix =
                areaAnalysis.type === 'calculated' ? formatMatchedColorsBlock(matchedColors) : '';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(
                JSON.stringify({
                  reply: `${areaAnalysis.reply}${colorSuffix}`,
                  calculation:
                    areaAnalysis.type === 'calculated'
                      ? {
                          areaKind: areaAnalysis.areaKind,
                          floorArea: areaAnalysis.floorArea,
                          totalPaintArea: areaAnalysis.totalPaintArea,
                          materials: areaAnalysis.materials,
                        }
                      : null,
                })
              );
              return;
            }

            const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
            if (!apiKey) {
              console.warn('GEMINI_API_KEY is not set in environment.');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(
                JSON.stringify({
                  reply: buildOfficialPolicyReply(userMessage, matchedColors, historyList),
                })
              );
              return;
            }

            const ai = getGeminiClient(apiKey);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-transform');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no');
            res.flushHeaders?.();

            const colorContext =
              matchedColors.length > 0
                ? `\n[ألوان جوتن المطابقة من الكتالوج الرسمي: ${matchedColors
                    .map((c) => `${c.nameAr} (${c.nameEn}) رقم ${c.code}`)
                    .join(' | ')}]`
                : '';
            const historyContext =
              historyList.length > 0
                ? `سياق المحادثة السابقة (لا تكرر المقدمة والترحيب):\n${historyList
                    .map((h) => `${h.role === 'user' ? 'العميل' : 'المستشار'}: ${String(h.text || '').slice(0, 300)}`)
                    .join('\n')}\n\nسؤال العميل الحالي: `
                : '';
            const promptPayload = `${historyContext}${userMessage}${colorContext}`;

            // Strict Max 5s ceiling (4600ms upstream budget so response finishes cleanly <= 5s)
            const timeoutPromise = new Promise<never>((_, reject) => {
              serverTimeout = setTimeout(() => {
                timedOut = true;
                serverAbort.abort();
                reject(new Error('__CHAT_TIMEOUT__'));
              }, 4600);
            });

            const runStream = async () => {
              const stream = await ai.models.generateContentStream({
                model: 'gemini-3.1-flash-lite',
                contents: promptPayload,
                config: {
                  systemInstruction: SYSTEM_PROMPT,
                  thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
                  abortSignal: serverAbort.signal,
                },
              });

              for await (const chunk of stream) {
                if (clientDisconnected || timedOut || serverAbort.signal.aborted) break;
                const text = chunk.text;
                if (text && !res.writableEnded) {
                  hasStreamedAnyToken = true;
                  res.write(`data: ${JSON.stringify({ text })}\n\n`);
                }
              }
            };

            await Promise.race([runStream(), timeoutPromise]);

            if (!clientDisconnected && !timedOut && !res.writableEnded) {
              res.write('data: [DONE]\n\n');
              res.end();
            }
          } catch (err: any) {
            const isTimeoutAbort =
              timedOut || err?.message === '__CHAT_TIMEOUT__' || err?.name === 'AbortError';
            if (!isTimeoutAbort && !clientDisconnected) {
              console.error('Gemini API Error:', err);
            }

            if (!clientDisconnected && !res.writableEnded) {
              // If upstream timed out or failed (e.g. 503 demand spike) before streaming tokens,
              // immediately serve the verified official policy response within the 5s window without hanging.
              if (!hasStreamedAnyToken && userMessage) {
                const officialText = buildOfficialPolicyReply(userMessage, matchedColors, historyList);
                if (!res.headersSent) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                  res.end(JSON.stringify({ reply: officialText }));
                } else {
                  res.write(`data: ${JSON.stringify({ text: officialText })}\n\n`);
                  res.write('data: [DONE]\n\n');
                  res.end();
                }
              } else {
                res.write('data: [DONE]\n\n');
                res.end();
              }
            }
          } finally {
            if (serverTimeout) {
              clearTimeout(serverTimeout);
            }
            if (!res.writableEnded) {
              res.end();
            }
          }
        });
      });
    },
  };
}

const PWA_MANIFEST = {
  id: '/',
  name: 'شركة الرضا للدهانات والديكور',
  short_name: 'الرضا للدهانات',
  description: 'شركة الرضا - تطبيق احترافي لحساب مقاولات الدهانات والديكورات بدقة متناهية',
  theme_color: '#667eea',
  background_color: '#ffffff',
  display: 'standalone' as const,
  orientation: 'portrait' as const,
  start_url: '/',
  scope: '/',
  icons: [
    {
      src: '/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-maskable-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

function devManifestPlugin(): Plugin {
  return {
    name: 'dev-manifest-fallback-plugin',
    apply: 'serve',
    configureServer(server) {
      if (process.env.DISABLE_HMR !== 'true') return;
      server.middlewares.use((req, res, next) => {
        if (req.url === '/manifest.json' || req.url === '/manifest.webmanifest') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
          res.end(JSON.stringify(PWA_MANIFEST, null, 2));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  const isHmrDisabled = process.env.DISABLE_HMR === 'true';

  return {
    plugins: [
      react(),
      tailwindcss(),
      geminiAdvisorPlugin(),
      devManifestPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        includeAssets: [
          'manifest.json',
          'offline.html',
          'assets/aistudio/logo_alreda.webp',
          'favicon.ico',
          'favicon.png',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
        ],
        manifest: PWA_MANIFEST,
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              urlPattern: ({ request }) =>
                request.mode === 'navigate' ||
                request.destination === 'document' ||
                request.destination === 'script' ||
                request.destination === 'style',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'alreda-core-network-first',
                networkTimeoutSeconds: 4,
              },
            },
            {
              urlPattern: ({ request }) =>
                request.destination === 'image' || request.destination === 'font',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'alreda-media-swr',
              },
            },
          ],
        },
        devOptions: {
          enabled: !isHmrDisabled,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: !isHmrDisabled,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: isHmrDisabled ? null : {},
    },
  };
});
