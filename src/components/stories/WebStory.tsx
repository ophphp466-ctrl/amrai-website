import type { StoryDef } from "./types";

/* ═══ قصة تطوير الويب: موقع حقيقي يُكتب ثم يعمل داخل المتصفح ═══ */

const code = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>بُنّ النخبة — قهوة مختصة</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI',Tahoma,sans-serif; }
  body { background:#0d0906; color:#f5ead9; overflow-x:hidden; }
  nav { display:flex; justify-content:space-between; align-items:center;
        padding:22px 6%; position:fixed; inset-inline:0; top:0; z-index:9;
        background:linear-gradient(#0d0906ee,transparent); }
  .logo { font-size:22px; font-weight:800; color:#d4a95c; }
  nav a { color:#cbb; text-decoration:none; margin-inline:14px; font-size:14px; transition:.3s; }
  nav a:hover { color:#d4a95c; }
  header { min-height:100vh; display:flex; flex-direction:column; justify-content:center;
           align-items:center; text-align:center; padding:0 6%; position:relative; }
  .beam { position:absolute; width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle,#d4a95c22,transparent 65%);
          animation:float 7s ease-in-out infinite; }
  @keyframes float { 50% { transform:translateY(-40px) scale(1.15); } }
  h1 { font-size:clamp(42px,8vw,86px); font-weight:900; line-height:1.15;
       animation:rise 1.2s cubic-bezier(.16,1,.3,1) both .2s; }
  h1 b { color:#d4a95c; }
  p.sub { max-width:520px; margin:22px 0 34px; line-height:2; color:#c9b696;
          animation:rise 1.2s cubic-bezier(.16,1,.3,1) both .45s; }
  @keyframes rise { from { opacity:0; transform:translateY(50px); } }
  .cta { padding:16px 44px; border-radius:99px; border:none; cursor:pointer;
         font-size:16px; font-weight:800; color:#1a1005; background:linear-gradient(135deg,#e8c583,#d4a95c);
         box-shadow:0 10px 40px #d4a95c55; transition:.35s;
         animation:rise 1.2s cubic-bezier(.16,1,.3,1) both .7s; }
  .cta:hover { transform:translateY(-4px) scale(1.04); box-shadow:0 18px 60px #d4a95c88; }
  .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
           gap:18px; padding:70px 6% 90px; }
  .card { background:#17100a; border:1px solid #d4a95c22; border-radius:20px;
          padding:34px 26px; transition:.4s; }
  .card:hover { transform:translateY(-10px); border-color:#d4a95c; box-shadow:0 24px 50px #000; }
  .card .ic { font-size:34px; }
  .card h3 { margin:14px 0 8px; color:#e8c583; }
  .card p { font-size:14px; line-height:1.9; color:#b7a483; }
  footer { text-align:center; padding:26px; color:#7a6a52; font-size:13px; border-top:1px solid #d4a95c18; }
</style>
</head>
<body>
  <nav>
    <div class="logo">☕ بُنّ النخبة</div>
    <div><a href="#">القائمة</a><a href="#">قصتنا</a><a href="#">اطلب الآن</a></div>
  </nav>
  <header>
    <div class="beam"></div>
    <h1>قهوة تُروى كـ<b>حكاية</b></h1>
    <p class="sub">محاصيل نادرة من مرتفعات اليمن وإثيوبيا، تُحمَّص بشغف وتصلك خلال ٤٨ ساعة من التحميص.</p>
    <button class="cta" onclick="this.textContent='☕ وصل الطلب!'">اطلب تجربتك الأولى</button>
  </header>
  <section class="cards">
    <div class="card"><div class="ic">🌄</div><h3>محصول يمني</h3><p>بن خولاني عتيق من terraces حراز — نكهات التمر والكاكاو.</p></div>
    <div class="card"><div class="ic">🔥</div><h3>تحميص يومي</h3><p>دفعات صغيرة كل صباح لضمان ذروة الطزاجة في كوبك.</p></div>
    <div class="card"><div class="ic">🚚</div><h3>توصيل سريع</h3><p>من المحمصة إلى بابك خلال ٤٨ ساعة، بتغليف يحفظ النكهة.</p></div>
  </section>
  <footer>صُنع بحب في محمصة النخبة © 2026</footer>
</body>
</html>`;

const Demo = () => (
  <div className="browser-frame h-full flex flex-col">
    <div className="browser-bar">
      <span className="editor-dot bg-[#ff5f57]" /><span className="editor-dot bg-[#febc2e]" /><span className="editor-dot bg-[#28c840]" />
      <div className="browser-url">https://bunn-elite.amr-ai.demo</div>
      <span className="text-[10px] mono text-[#28c840]">● LIVE</span>
    </div>
    <iframe title="موقع بُنّ النخبة" srcDoc={code} className="w-full flex-1 min-h-[380px] bg-[#0d0906]" sandbox="allow-scripts" />
  </div>
);

export const webStory: StoryDef = {
  lang: "html",
  file: "index.html",
  code,
  Demo,
  narrative: {
    code: "نكتب موقعًا حقيقيًا من الصفر — HTML وCSS خالص، سطرًا بسطر، أمام عينيك مباشرة.",
    build: "انتهى الكود. لحظة التشغيل…",
    live: "هذا ليس تصميمًا وهميًا — الموقع الذي كتبناه للتو يعمل الآن فعلًا. مرّر داخله، جرّب الزر، كل شيء حي.",
  },
};
