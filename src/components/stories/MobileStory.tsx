import { useMemo, useState } from "react";
import type { StoryDef } from "./types";

/* ═══ قصة تطبيق الموبايل: كود React Native ثم تطبيق يعمل فعلًا ═══ */

const code = `// توصيلة — تطبيق توصيل ذكي (React Native)
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const MENU = [
  { id: '1', name: 'برجر تروفل',  price: 185, cat: 'برجر' },
  { id: '2', name: 'بيتزا نابولي', price: 240, cat: 'بيتزا' },
  { id: '3', name: 'سوشي سالمون', price: 320, cat: 'سوشي' },
];

export default function WaslaApp() {
  const [cart, setCart] = useState({});

  const add = (item) =>
    setCart(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));

  const total = MENU.reduce(
    (sum, m) => sum + (cart[m.id] || 0) * m.price, 0);

  return (
    <View style={styles.app}>
      <Text style={styles.logo}>توصيلة 🛵</Text>
      <FlatList
        data={MENU}
        keyExtractor={m => m.id}
        renderItem={({ item }) => (
          <DishCard dish={item} onAdd={() => add(item)} />
        )}
      />
      <CartBar total={total} eta="25 دقيقة" />
    </View>
  );
}

const styles = StyleSheet.create({
  app:  { flex: 1, backgroundColor: '#0b0f1d' },
  logo: { fontSize: 28, fontWeight: '900', color: '#8ef0c9' },
});`;

/* ── التطبيق الحقيقي داخل إطار الهاتف ── */
interface Dish { id: string; name: string; desc: string; price: number; cat: string; emoji: string; }
const MENU: Dish[] = [
  { id: "1", name: "برجر تروفل أنغوس", desc: "لحم أنغوس + جبنة مدخنة + صوص تروفل", price: 185, cat: "برجر", emoji: "🍔" },
  { id: "2", name: "برجر دجاج مقرمش", desc: "دجاج مقرمش + كول سلو + صوص خاص", price: 145, cat: "برجر", emoji: "🍗" },
  { id: "3", name: "بيتزا نابولي", desc: "عجينة 48 ساعة + موتزاريلا طازجة", price: 240, cat: "بيتزا", emoji: "🍕" },
  { id: "4", name: "بيتزا خضار الحديقة", desc: "خضار موسمية + زيت زيتون بكر", price: 195, cat: "بيتزا", emoji: "🥗" },
  { id: "5", name: "سوشي سالمون رول", desc: "سلمون نرويجي + أفوكادو — 8 قطع", price: 320, cat: "سوشي", emoji: "🍣" },
  { id: "6", name: "بودانج لوتس", desc: "كريمة لوتس + بسكويت كراميل", price: 95, cat: "حلويات", emoji: "🍮" },
  { id: "7", name: "كنافة نوتيلا", desc: "كنافة ناعمة + نوتيلا + فستق", price: 110, cat: "حلويات", emoji: "🍰" },
];
const CATS = ["الكل", "برجر", "بيتزا", "سوشي", "حلويات"];

function PhoneApp() {
  const [cat, setCat] = useState("الكل");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<"menu" | "cart" | "done">("menu");

  const items = useMemo(() => (cat === "الكل" ? MENU : MENU.filter((m) => m.cat === cat)), [cat]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = MENU.reduce((s, m) => s + (cart[m.id] || 0) * m.price, 0);
  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  return (
    <div className="h-full flex flex-col bg-[#0b0f1d] text-right" dir="rtl">
      {/* رأس التطبيق */}
      <div className="px-4 pt-9 pb-3 bg-gradient-to-b from-[#0e1526] to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#8ef0c9] font-bold">توصيل إلى · القاهرة ▾</div>
            <div className="text-xl font-black text-white">توصيلة 🛵</div>
          </div>
          <button onClick={() => count > 0 && setStage("cart")} className="relative w-10 h-10 rounded-full bg-[#131a2e] flex items-center justify-center text-lg">
            🛒
            {count > 0 && <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#8ef0c9] text-[#02121e] text-[11px] font-black flex items-center justify-center num-latin">{count}</span>}
          </button>
        </div>
      </div>

      {stage === "done" ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#8ef0c9]/15 border-2 border-[#8ef0c9] flex items-center justify-center text-4xl" style={{ animation: "float-y 2.4s ease-in-out infinite" }}>🛵</div>
          <div className="text-xl font-black text-white">طلبك في الطريق!</div>
          <p className="text-[13px] text-[#9aa5bc] leading-6">يصلك خلال <b className="text-[#8ef0c9]">25 دقيقة</b> — يمكنك تتبع السائق لحظة بلحظة على الخريطة.</p>
          <button onClick={() => { setStage("menu"); setCart({}); }} className="mt-2 px-6 py-2.5 rounded-full bg-[#8ef0c9] text-[#02121e] font-black text-sm">اطلب مرة أخرى</button>
        </div>
      ) : stage === "cart" ? (
        <div className="flex-1 flex flex-col px-4">
          <button onClick={() => setStage("menu")} className="text-[#8ef0c9] text-sm font-bold text-right mb-3">← متابعة التسوق</button>
          <div className="flex-1 overflow-y-auto space-y-2.5">
            {MENU.filter((m) => cart[m.id]).map((m) => (
              <div key={m.id} className="flex items-center gap-3 bg-[#111830] rounded-2xl p-3">
                <span className="text-2xl">{m.emoji}</span>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-white">{m.name}</div>
                  <div className="text-[11px] text-[#8ef0c9] num-latin">{m.price} ج.م × {cart[m.id]}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCart((c) => { const n = { ...c }; n[m.id] = Math.max(0, (n[m.id] || 0) - 1); if (!n[m.id]) delete n[m.id]; return n; })} className="w-7 h-7 rounded-full bg-[#1b2440] text-white font-black">−</button>
                  <button onClick={() => add(m.id)} className="w-7 h-7 rounded-full bg-[#8ef0c9] text-[#02121e] font-black">+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="py-3">
            <div className="flex justify-between text-sm text-[#9aa5bc] mb-2"><span>الإجمالي (شامل التوصيل)</span><b className="text-white num-latin">{total + 15} ج.م</b></div>
            <button onClick={() => setStage("done")} className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-[#8ef0c9] to-[#4ecb9b] text-[#02121e] font-black">تأكيد الطلب ⚡</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-full text-[12px] font-bold shrink-0 transition-all ${cat === c ? "bg-[#8ef0c9] text-[#02121e]" : "bg-[#131a2e] text-[#9aa5bc]"}`}>{c}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-2.5 pb-3">
            {items.map((m) => (
              <div key={m.id} className="flex items-center gap-3 bg-[#111830] rounded-2xl p-3 hover:bg-[#151d38] transition-colors">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1b2440] to-[#0e1526] flex items-center justify-center text-3xl shrink-0">{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-white truncate">{m.name}</div>
                  <div className="text-[10.5px] text-[#7c8db0] leading-4 line-clamp-1">{m.desc}</div>
                  <div className="text-[12px] font-black text-[#8ef0c9] num-latin mt-0.5">{m.price} ج.م</div>
                </div>
                <button onClick={() => add(m.id)} className="w-9 h-9 rounded-xl bg-[#8ef0c9]/15 border border-[#8ef0c9]/50 text-[#8ef0c9] font-black text-lg hover:bg-[#8ef0c9] hover:text-[#02121e] transition-colors">+</button>
              </div>
            ))}
          </div>
          {count > 0 && (
            <button onClick={() => setStage("cart")} className="mx-4 mb-3 py-3 rounded-2xl bg-[#8ef0c9] text-[#02121e] font-black text-sm flex items-center justify-center gap-2">
              عرض السلة · <span className="num-latin">{total} ج.م</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

const Demo = () => (
  <div className="h-full flex items-center justify-center py-2">
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <PhoneApp />
      </div>
    </div>
  </div>
);

export const mobileStory: StoryDef = {
  lang: "tsx",
  file: "WaslaApp.tsx",
  code,
  Demo,
  narrative: {
    code: "كود React Native حقيقي لتطبيق توصيل — الحالة، السلة، والإجمالي يُحسب برمجيًا.",
    build: "تم البناء بنجاح. جاري تثبيت التطبيق على الجهاز…",
    live: "التطبيق يعمل الآن أمامك: تصفّح القائمة، أضف للسلة، وأكّد الطلب — كل شيء بحالة حقيقية، وليس فيديو مسجل.",
  },
};
