export interface RubricItemData {
  key: string;
  text: string;
  weight: number;
  scientificReference: string;
  keywords: string[];
}

export interface DiagnosticTestData {
  id: string;
  name: string;
  result: string;
  isNecessary: boolean;
  costWeight: number;
}

export interface CaseData {
  id: string;
  title: string;
  slug: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "COMPREHENSIVE";
  demographic: string;
  chiefComplaint: string;
  hpi: string;
  medicalHistory: string;
  examNotes: string;
  radiologyImageUrl: string;
  clinicalImageUrl?: string;
  referencePlan: string;
  referenceRubric: RubricItemData[];
  scientificSource: string;
  diagnosticTests: DiagnosticTestData[];
}

export const mockCases: CaseData[] = [
  {
    id: "case-endo-1",
    title: "درد شدید دندان مولر اول پایین چپ با سابقه درد شبانه",
    slug: "irreversible-pulpitis-36",
    difficulty: "INTERMEDIATE",
    demographic: "خانم ۳۲ ساله، معلم دبستان، فاقد بیماری سیستمیک",
    chiefComplaint: "«درد شدید دندان آسیاب بزرگ پایین سمت چپ هنگام خوردن بستنی یا آب سرد که حدود ۱ دقیقه باقی می‌ماند و دیشب هم مرا از خواب بیدار کرد.»",
    hpi: "بیمار گزارش می‌دهد که دندان آسیاب شماره ۶ سمت چپ او از دو هفته پیش به سرما حساس شده بود، اما از سه روز پیش شدت درد افزایش یافته و درد خودبه‌خودی، به خصوص در حالت درازکشیده رخ می‌دهد که با مسکن موقتاً آرام می‌شود.",
    medicalHistory: "در تاریخچه پزشکی بیمار بیماری قلبی، فشار خون، دیابت، بارداری و حساسیت دارویی ثبت نشده است. سابقه دندانپزشکی شامل درمان‌های ترمیمی ساده است.",
    examNotes: "در معاینه داخل دهانی، پوسیدگی عمیق کلاس II (اکلوزو-دیستال) روی دندان شماره ۳۶ مشاهده شد. لثه اطراف سالم است. تست دق (Percussion) حساسیت خفیفی را نشان می‌دهد. تست لمس (Palpation) بدون حساسیت است. تست سرما (Cold test) با اسپری کلرواتیل باعث ایجاد درد تیز و بسیار شدید شد که پس از برداشتن محرک، حدود ۵۰ ثانیه طول کشید. تست الکتریکی پالپ (EPT) در عدد ۱۸ پاسخ داد (دندان کنترل ۲۸ پاسخ داد).",
    radiologyImageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600&auto=format&fit=crop", // Simulated gray dental image
    referencePlan: "تشخیص نهایی: پالپیت برگشت‌ناپذیر علامت‌دار همراه با پری‌ودنتیت اپیکال علامت‌دار دندان ۳۶.\n\nطرح درمان:\n۱. بی‌حسی موضعی با بلاک عصب مندیبولار (IANB) لیدوکائین ۲٪ با اپینفرین ۱:۸۰۰۰۰.\n۲. ایزولاسیون دندان با رابر دم جهت پیشگیری از آلودگی بزاق و ورود ابزار به حلق.\n۳. اکسس کویتی (حفره دسترسی) ذوزنقه‌ای برای دسترسی به کانال‌های مزیوبوکال، مزیولینگوال و دیستال.\n۴. تعیین طول کارکرد با اپکس لوکیتور و تایید با رادیوگرافی کارکرد.\n۵. آماده‌سازی و شکل‌دهی کانال‌ها با فایل‌های چرخشی روتاری نیکل-تیتانیوم و شستشوی مداوم با محلول سدیم هیپوکلریت (NaOCl) ۵.۲۵٪.\n۶. پر کردن کانال‌ها با گوتاپرکا و سیلر رزینی (مانند AH-Plus) به روش متراکم کردن جانبی یا عمودی.\n۷. ترمیم تاج دندان با بیلدآپ کامپوزیت یا آملگام و توصیه به روکش کردن دندان به دلیل از دست رفتن وسیع ساختار دیواره‌ها.",
    scientificSource: "Cohen's Pathways of the Pulp, 12th Edition - Pulp & Periapical Pathoses",
    diagnosticTests: [
      { id: "test-1", name: "تست سرما (Cold Test)", result: "درد تیرکشنده و بسیار شدید که پس از ۵۰ ثانیه باقی ماند (مثبت کاذب طولانی).", isNecessary: true, costWeight: 0 },
      { id: "test-2", name: "تست دق (Percussion)", result: "حساسیت خفیف تا متوسط (نشان‌دهنده درگیری اولیه لیگامان پریودنتال).", isNecessary: true, costWeight: 0 },
      { id: "test-3", name: "تست لمس (Palpation)", result: "منفی و فاقد تورم یا حساسیت در ناحیه اپکس.", isNecessary: true, costWeight: 0 },
      { id: "test-4", name: "تست الکتریکی پالپ (EPT)", result: "پاسخ سریع در جریان پایین (تایید زنده بودن پالپ).", isNecessary: false, costWeight: 5 },
      { id: "test-5", name: "اندازه‌گیری پروبینگ پریودنتال (Probing)", result: "عمق شیار لثه نرمال (۱ تا ۲ میلی‌متر در تمام جهات).", isNecessary: true, costWeight: 0 },
      { id: "test-6", name: "تست لقاح/حرکت دندان (Mobility)", result: "حرکت کلاس صفر (لقی فیزیولوژیک و نرمال).", isNecessary: false, costWeight: 5 },
      { id: "test-7", name: "تست خونریزی پالپ (Pulp exposure check)", result: "در این مرحله بدون بی حسی کانترااندیکه است.", isNecessary: false, costWeight: 15 }
    ],
    referenceRubric: [
      {
        key: "diagnosis",
        text: "تشخیص دقیق پالپیت برگشت‌ناپذیر علامت‌دار (Symptomatic Irreversible Pulpitis) و پریودنتیت اپیکال علامت‌دار خفیف",
        weight: 25,
        scientificReference: "Cohen's Pathways of the Pulp - Chapter 1",
        keywords: ["برگشت", "پالپیت", "برگشت ناپذیر", "irreversible", "pulpitis", "پریودنتیت"]
      },
      {
        key: "anesthesia",
        text: "تجویز بی‌حسی بلاک مندیبولار (IANB) به همراه بی‌حسی تکمیلی در صورت لزوم",
        weight: 15,
        scientificReference: "Handbook of Local Anesthesia - Malamed",
        keywords: ["بی حسی", "بلاک", "ianb", "تزریق", "لیدوکائین", "anesthesia"]
      },
      {
        key: "isolation",
        text: "استفاده الزامی از رابر دم (Rubber Dam) جهت حفظ ایزولاسیون فیلد درمانی",
        weight: 15,
        scientificReference: "Cohen's Pathways of the Pulp - Chapter 4",
        keywords: ["رابر", "ایزوله", "rubber", "dam", "ایزولاسیون"]
      },
      {
        key: "access_cavity",
        text: "طراحی اکسس کویتی ذوزنقه‌ای/مثلثی و برداشت کامل سقف پالپ چمبر و پوسیدگی",
        weight: 15,
        scientificReference: "Cohen's Pathways of the Pulp - Chapter 7",
        keywords: ["اکسس", "حفره دسترسی", "سقف", "access", "دیواره"]
      },
      {
        key: "irrigation",
        text: "شستشوی کانال با محلول سدیم هیپوکلریت (NaOCl) با غلظت بالای ۲.۵٪",
        weight: 15,
        scientificReference: "Cohen's Pathways of the Pulp - Chapter 9",
        keywords: ["سدیم", "هیپوکلریت", "شستشو", "naocl", "sodium"]
      },
      {
        key: "obturation",
        text: "پر کردن سه بعدی کانال‌ها با گوتاپرکا و سیلر مناسب و بیلدآپ تاج",
        weight: 15,
        scientificReference: "Cohen's Pathways of the Pulp - Chapter 10",
        keywords: ["گوتا", "سیلر", "پر کردن", "ترمیم", "روکش", "gutta"]
      }
    ]
  },
  {
    id: "case-endo-2",
    title: "آبسه حاد پری‌آپیکال دندان پرمولر اول بالا دارای عصب‌کشی ناقص",
    slug: "acute-apical-abscess-24",
    difficulty: "ADVANCED",
    demographic: "آقای ۴۸ ساله، کارمند بانک، دارای فشار خون تحت کنترل",
    chiefComplaint: "«تورم ناگهانی لثه بالای سمت چپ که با درد شدید و لقی دندان همراه است؛ نمی‌توانم دندان‌هایم را روی هم بگذارم.»",
    hpi: "بیمار ۳ سال پیش روی دندان ۲۴ درمان ریشه داشته است. از ۲ روز پیش درد مبهمی شروع شده که به تدریج شدید شده و از دیشب تورم در ناحیه لثه و گونه چپ ظاهر شده است. بیمار احساس تب و لرز خفیف دارد.",
    medicalHistory: "فشار خون بیمار با قرص لوزارتان ۵۰ میلی‌گرم روزانه کنترل می‌شود (۱۲۰/۸۰). حساسیت دارویی ندارد.",
    examNotes: "تورم لوکالیزه، نرم و نوسان‌دار در سالکوس باکال دندان ۲۴ مشهود است. دندان ۲۴ به شدت به دق (Vertical Percussion) و لمس حساس است. لقی درجه ۲ دارد. دندان فاقد واکنش به تست سرما است. غدد لنفاوی زیر فکی چپ لمس می‌شوند و حساس هستند.",
    radiologyImageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?q=80&w=600&auto=format&fit=crop",
    referencePlan: "تشخیص نهایی: درمان ریشه قبلی ناقص همراه با آبسه حاد اپیکال دندان ۲۴.\n\nطرح درمان:\n۱. بی‌حسی موضعی با تزریق اینفیلتراسیون باکال و پالاتال به آرامی (تزریق مستقیم درون تورم کانترااندیکه است).\n۲. تخلیه اورژانسی آبسه: باز کردن دندان از مسیر درمان ریشه قبلی و برقراری درین (Drainage) از طریق کانال. در صورت لزوم برش جراحی روی لثه (Incision & Drainage).\n۳. خروج گوتاپرکاهای قبلی با حلال (مانند کلروفرم یا اوکالیپتول) و فایل‌های دستی.\n۴. شستشوی بسیار وسیع با سدیم هیپوکلریت و قرار دادن پانسمان کلسیم هیدروکساید در کانال.\n۵. تجویز آنتی‌بیوتیک سیستمیک (مانند آموکسی‌سیلین ۵۰۰mg هر ۸ ساعت و مترونیدازول ۲۵۰mg هر ۸ ساعت) به دلیل وجود علائم منتشر (تورم و لنفادنوپاتی).\n۶. ارجاع برای تکمیل درمان ریشه مجدد (Retreatment) پس از فروکش کردن علائم حاد.",
    scientificSource: "Cohen's Pathways of the Pulp - Chapter 8 (Endodontic Retreatment)",
    diagnosticTests: [
      { id: "test-2-1", name: "تست سرما (Cold Test)", result: "عدم پاسخ (منفی). تایید نکروز پالپ/فاقد حیات بودن دندان.", isNecessary: true, costWeight: 0 },
      { id: "test-2-2", name: "تست دق (Percussion)", result: "درد فوق‌العاده شدید و جهنده (نشان‌دهنده درگیری شدید پری‌آپیکال و آبسه).", isNecessary: true, costWeight: 0 },
      { id: "test-2-3", name: "تست لمس (Palpation)", result: "درد بسیار شدید در لمس ناحیه آپیکال و احساس نوسان در تورم بافت نرم.", isNecessary: true, costWeight: 0 },
      { id: "test-2-4", name: "سنجش حرارت بدن (تایم تب)", result: "دمای ۳۷.۸ درجه سانتی‌گراد (تب خفیف، نشان‌دهنده درگیری سیستمیک).", isNecessary: true, costWeight: 0 },
      { id: "test-2-5", name: "تست حساسیت به گرما (Heat test)", result: "تولید درد شدید که با آب سرد تسکین می‌یابد.", isNecessary: false, costWeight: 5 }
    ],
    referenceRubric: [
      {
        key: "diagnosis",
        text: "تشخیص آبسه حاد اپیکال (Acute Apical Abscess) روی دندان درمان ریشه شده قبلی",
        weight: 25,
        scientificReference: "Cohen's Pathways of the Pulp",
        keywords: ["آبسه", "حاد", "اپیکال", "abscess", "عصب کشی ناقص", "ریشه مجدد"]
      },
      {
        key: "drainage",
        text: "برقراری درین (تخلیه چرک) از طریق کانال دندان یا ایجاد برش روی تورم لثه (I&D)",
        weight: 20,
        scientificReference: "Peterson's Principles of Oral and Maxillofacial Surgery",
        keywords: ["تخلیه", "درین", "برش", "چرک", "drain", "incision"]
      },
      {
        key: "retreatment",
        text: "تخلیه گوتاپرکا و درمان مجدد ریشه دندان (Endodontic Retreatment)",
        weight: 20,
        scientificReference: "Cohen's Pathways of the Pulp",
        keywords: ["درمان مجدد", "تخلیه گوتا", "حلال", "کلروفرم", "retreatment", "مجدد"]
      },
      {
        key: "medication",
        text: "تجویز آنتی‌بیوتیک سیستمیک مناسب (آموکسی‌سیلین/مترونیدازول) به علت تورم منتشر و تب",
        weight: 20,
        scientificReference: "Dental Pharmacology - Chapters 4 & 5",
        keywords: ["آنتی بیوتیک", "آموکسی", "مترونیدازول", "نسخه", "دارو", "antibiotic"]
      },
      {
        key: "calcium_hydroxide",
        text: "پانسمان داخل کانال با کلسیم هیدروکساید (Calcium Hydroxide) بین جلسات",
        weight: 15,
        scientificReference: "Cohen's Pathways of the Pulp",
        keywords: ["کلسیم", "هیدروکساید", "پانسمان", "calcium", "hydroxide"]
      }
    ]
  }
];
