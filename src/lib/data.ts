/* ═══════════════════════════════════════════════════════════
   AMR AI — المحتوى المركزي (من مستندات الشركة الرسمية)
   ═══════════════════════════════════════════════════════════ */

export const COMPANY = {
  name: "Amr AI",
  nameAr: "عمر AI",
  slogan: "نحوّل الأفكار إلى واقعٍ رقميٍ ذكي",
  whatsapp: "201090991769",
  whatsappDisplay: "+20 109 099 1769",
  email: "contact@amr-ai.com",
  hq: "القاهرة، مصر — نخدم العالم عن بُعد",
  hours: "السبت – الخميس · 9 صباحًا – 9 مساءً",
};

export const waLink = (msg: string) =>
  `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`;

export const STATS = [
  { value: 500, suffix: "+", label: "مشروع ناجح" },
  { value: 98, suffix: "%", label: "رضا العملاء" },
  { value: 12, suffix: "+", label: "سنة خبرة" },
  { value: 350, suffix: "%", label: "أعلى نمو مبيعات لعميل" },
];

export interface Service {
  id: string;
  index: string;
  title: string;
  latin: string;
  desc: string;
  features: string[];
  tech: string[];
  icon: string; // svg path
  accent: string;
  storyTitle: string;
  storySub: string;
}

export const SERVICES: Service[] = [
  {
    id: "web",
    index: "01",
    title: "تطوير الويب",
    latin: "Web Development",
    desc: "مواقع ومنصات Full-Stack بأحدث التقنيات وأعلى معايير الأداء — تصميم سينمائي، سرعة 100/100، وSEO متقدم.",
    features: ["أداء 100/100 في Lighthouse", "React · Next.js · Vue · Svelte", "PWA + SEO متقدم", "تجربة مستخدم سينمائية"],
    tech: ["React", "Next.js", "TypeScript", "GSAP"],
    icon: "M8 3l-5 9 5 9M16 3l5 9-5 9M13 2l-2 20",
    accent: "#5fd4ff",
    storyTitle: "شاهد موقعًا يُولد من الكود",
    storySub: "سنكتب موقعًا حقيقيًا سطرًا بسطر… ثم يشتغل أمامك فورًا.",
  },
  {
    id: "ai",
    index: "02",
    title: "الذكاء الاصطناعي",
    latin: "AI Solutions",
    desc: "أنظمة Deep Learning مخصصة، رؤية حاسوبية، معالجة لغات طبيعية، وبوتات شات ذكية تتعلم وتتطور.",
    features: ["تحليل تنبؤي بدقة +95%", "دمج OpenAI · Claude · Gemini", "تشخيص طبي وتحليل سلوك عملاء", "وكلاء أذكياء AI Agents"],
    tech: ["Python", "TensorFlow", "PyTorch", "LLMs"],
    icon: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8M12 8a4 4 0 100 8 4 4 0 000-8z",
    accent: "#7b6cff",
    storyTitle: "شاهد عقلًا اصطناعيًا يُبنى",
    storySub: "من الشبكة العصبية… إلى مساعد ذكي يجيبك فعلًا — جرّبه بنفسك.",
  },
  {
    id: "mobile",
    index: "03",
    title: "تطبيقات الموبايل",
    latin: "Mobile Apps",
    desc: "تطبيقات أصيلة وعابرة للمنصات iOS وAndroid بتصميم بديع وأداء فائق — من الفكرة إلى المتاجر العالمية.",
    features: ["iOS · Android · Flutter · React Native", "UX/UI من الدرجة الأولى", "نشر على المتاجر العالمية", "تطبيقات +500K تحميل"],
    tech: ["Flutter", "React Native", "Swift", "Kotlin"],
    icon: "M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zM11 18h2",
    accent: "#8ef0c9",
    storyTitle: "شاهد تطبيقًا يعمل داخل المتصفح",
    storySub: "سنبني تطبيق توصيل حقيقي — اطلب منه بنفسك بعد اكتماله.",
  },
  {
    id: "automation",
    index: "04",
    title: "الأتمتة الذكية",
    latin: "Smart Automation",
    desc: "أتمتة العمليات بالـ RPA + AI لتوفير 80% من زمن العمليات وزيادة الإنتاجية — أنظمة تعمل 24/7.",
    features: ["توفير 80% من زمن العمليات", "n8n · Zapier · UiPath", "تكامل مع أنظمتك الحالية", "لوحات مراقبة لحظية"],
    tech: ["n8n", "UiPath", "Python", "Zapier"],
    icon: "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19",
    accent: "#ffd166",
    storyTitle: "شاهد خط إنتاج رقميًا يعمل",
    storySub: "تدفق عمل حقيقي: فواتير تُعالج أمامك — والعداد يحسب ما وفّرته.",
  },
  {
    id: "cloud",
    index: "05",
    title: "الحلول السحابية",
    latin: "Cloud Solutions",
    desc: "بنية تحتية سحابية قوية ومرنة على AWS وAzure وGCP مع DevOps وCI/CD وأمان وامتثال عالمي.",
    features: ["AWS · Azure · GCP", "Kubernetes + Docker", "CI/CD احترافي", "خفض فاتورة السحابة حتى 60%"],
    tech: ["AWS", "Docker", "Kubernetes", "Terraform"],
    icon: "M6 18a4 4 0 01-.9-7.9A5.5 5.5 0 0116 7.6 4.5 4.5 0 0117.5 18H6z",
    accent: "#ff9de2",
    storyTitle: "شاهد نشرًا حيًا على السحابة",
    storySub: "من الحاوية إلى الإنتاج — تيرمنال حقيقي ولوحة مؤشرات لحظية.",
  },
  {
    id: "consulting",
    index: "06",
    title: "الاستشارات التقنية",
    latin: "Tech Consulting",
    desc: "خارطة طريق رقمية واستراتيجيات تحول مخصصة لعملك — تحليل وضع تقني شامل ومتابعة تنفيذ مستمرة.",
    features: ["تحليل وضع تقني شامل", "استراتيجية تحول رقمي", "خارطة طريق 1–3 سنوات", "متابعة تنفيذ مستمرة"],
    tech: ["Strategy", "Audit", "Roadmap", "KPIs"],
    icon: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
    accent: "#5fd4ff",
    storyTitle: "شاهد استراتيجية تتشكل",
    storySub: "من تحليل البيانات… إلى خارطة طريق تفاعلية بعائد واضح.",
  },
];

export interface CaseStudy {
  id: string;
  title: string;
  field: string;
  desc: string;
  metrics: { value: string; label: string }[];
  accent: string;
}

export const CASES: CaseStudy[] = [
  {
    id: "ecommerce",
    title: "منصة تجارة إلكترونية متكاملة",
    field: "تجارة إلكترونية",
    desc: "من متجر تقليدي بطيء إلى منصة سينمائية سريعة — تجربة شراء ترفع التحويل من أول زيارة.",
    metrics: [
      { value: "+350%", label: "نمو المبيعات" },
      { value: "3×", label: "سرعة تحميل أعلى" },
      { value: "+120K", label: "مستخدم نشط" },
    ],
    accent: "#5fd4ff",
  },
  {
    id: "medical",
    title: "نظام تشخيص طبي بالذكاء الاصطناعي",
    field: "رعاية صحية",
    desc: "نموذج رؤية حاسوبية يحلل الصور الطبية ويساعد الأطباء على قرارات أسرع وأدق.",
    metrics: [
      { value: "+95%", label: "دقة التشخيص" },
      { value: "ثوانٍ", label: "بدلًا من دقائق" },
      { value: "24/7", label: "عمل مستمر" },
    ],
    accent: "#7b6cff",
  },
  {
    id: "finance",
    title: "أتمتة العمليات المالية",
    field: "خدمات مالية",
    desc: "RPA + AI حوّل معالجة الفواتير والمطابقات من عبء يدوي إلى تدفق لحظي بلا أخطاء تقريبًا.",
    metrics: [
      { value: "4 ساعات", label: "بدلًا من 3 أيام" },
      { value: "-80%", label: "أخطاء أقل" },
      { value: "+200%", label: "إنتاجية" },
    ],
    accent: "#ffd166",
  },
  {
    id: "delivery",
    title: "تطبيق توصيل ذكي",
    field: "تطبيقات موبايل",
    desc: "تطبيق توصيل بمسارات ذكية وتجربة طلب سلسة — من فكرة على ورقة إلى نصف مليون تحميل.",
    metrics: [
      { value: "+500K", label: "تحميل" },
      { value: "4.8★", label: "تقييم المتاجر" },
      { value: "-35%", label: "زمن التوصيل" },
    ],
    accent: "#8ef0c9",
  },
];

export const PRICING = [
  { service: "الذكاء الاصطناعي", tech: "TensorFlow · PyTorch · OpenAI", duration: "4–14 أسبوعًا", from: 3000 },
  { service: "تطوير الويب", tech: "React · Next.js · Node", duration: "2–12 أسبوعًا", from: 1500 },
  { service: "تطبيقات الموبايل", tech: "Flutter · React Native", duration: "6–20 أسبوعًا", from: 2500 },
  { service: "الأتمتة الذكية", tech: "n8n · UiPath · Python", duration: "3–10 أسابيع", from: 2000 },
  { service: "الحلول السحابية", tech: "AWS · Azure · Docker", duration: "2–8 أسابيع", from: 1800 },
  { service: "الاستشارات التقنية", tech: "استراتيجية وتحليل", duration: "1–4 أسابيع", from: 500 },
];

/* ── حاسبة التكلفة ── */
export const CALC = {
  services: [
    { id: "web", label: "موقع / منصة ويب", base: 1500 },
    { id: "ai", label: "حل ذكاء اصطناعي", base: 3000 },
    { id: "mobile", label: "تطبيق موبايل", base: 2500 },
    { id: "automation", label: "أتمتة عمليات", base: 2000 },
    { id: "cloud", label: "بنية سحابية", base: 1800 },
    { id: "store", label: "متجر إلكتروني", base: 2200 },
  ],
  complexity: [
    { id: 1, label: "بسيط — صفحات تعريفية", mult: 1 },
    { id: 2, label: "متوسط — لوحة تحكم وتكاملات", mult: 1.8 },
    { id: 3, label: "متقدم — منصة كاملة مخصصة", mult: 3.2 },
  ],
  extras: [
    { id: "seo", label: "SEO متقدم", price: 300 },
    { id: "pwa", label: "تطبيق PWA", price: 400 },
    { id: "dashboard", label: "لوحة تحكم تحليلية", price: 800 },
    { id: "api", label: "تكامل API خارجي", price: 600 },
    { id: "support", label: "دعم فني لمدة سنة", price: 500 },
  ],
  rushMult: 1.25,
};

/* ── اختبار الجاهزية الرقمية ── */
export const READINESS = {
  questions: [
    {
      q: "كيف تدير عملياتك اليومية حاليًا؟",
      options: [
        { t: "ورقيًا أو بجداول متفرقة", s: 0 },
        { t: "برامج منفصلة غير مترابطة", s: 1 },
        { t: "نظام متكامل ومؤتمت جزئيًا", s: 2 },
      ],
    },
    {
      q: "هل تستخدم بياناتك في اتخاذ القرار؟",
      options: [
        { t: "نادرًا — القرارات بالخبرة فقط", s: 0 },
        { t: "تقارير دورية يدوية", s: 1 },
        { t: "لوحات مؤشرات لحظية", s: 2 },
      ],
    },
    {
      q: "ما حاضرك الرقمي أمام العملاء؟",
      options: [
        { t: "صفحات تواصل فقط", s: 0 },
        { t: "موقع تعريفي", s: 1 },
        { t: "منصة / تطبيق يبيع فعلًا", s: 2 },
      ],
    },
    {
      q: "كم يستغرق إنجاز مهمة متكررة (فاتورة، رد عميل، تقرير)؟",
      options: [
        { t: "ساعات أو أيام", s: 0 },
        { t: "دقائق بتدخل يدوي", s: 1 },
        { t: "تلقائيًا دون تدخل", s: 2 },
      ],
    },
  ],
  tiers: [
    {
      max: 2,
      title: "المرحلة الأولى: التأسيس",
      text: "عملك يعتمد على جهود يدوية تستنزف الوقت. الخطوة الأذكى الآن: حضور رقمي قوي + أتمتة أول عملية متكررة — عادةً توفر وحدها 30–40% من زمن الفريق خلال أول شهر.",
      cta: "ابدأ بموقع + أتمتة واحدة",
    },
    {
      max: 5,
      title: "المرحلة الثانية: الربط والنمو",
      text: "لديك أدوات رقمية لكنها لا تتحدث مع بعضها. الأولوية: ربط الأنظمة ببعضها (تكاملات + أتمتة ذكية) ثم لوحة مؤشرات لحظية تجعل القرار مبنيًا على بيانات لا تخمين.",
      cta: "اربط أنظمتك الآن",
    },
    {
      max: 8,
      title: "المرحلة الثالثة: الذكاء الاصطناعي",
      text: "بنيتك الرقمية جاهزة للقفزة الكبرى: ذكاء اصطناعي يتنبأ بالمبيعات، يرد على العملاء، ويكتشف الفرص قبل منافسيك. 88% من المؤسسات عالميًا دخلت هذه المرحلة بالفعل (McKinsey 2025).",
      cta: "أطلق مشروع AI",
    },
  ],
};

export const NAV_LINKS = [
  { id: "services", label: "الخدمات" },
  { id: "work", label: "قصص النجاح" },
  { id: "tools", label: "أدوات مجانية" },
  { id: "blog", label: "المدونة" },
  { id: "pricing", label: "الأسعار" },
  { id: "contact", label: "تواصل معنا" },
];
