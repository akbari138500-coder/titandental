import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Create Subjects
  const endodontics = await prisma.subject.upsert({
    where: { slug: "endodontics" },
    update: {},
    create: {
      name: "اندودانتیکس (درمان ریشه)",
      slug: "endodontics",
      description: "شامل تشخیص بیماری‌های پالپ و پری‌آپیکال، ایزولاسیون و فایلینگ روتاری کانال ریشه.",
      published: true,
    },
  });

  console.log(`Subject created: ${endodontics.name}`);

  // 2. Create Cases
  const casesData = [
    {
      title: "درد شدید دندان مولر اول پایین چپ با سابقه درد شبانه",
      slug: "irreversible-pulpitis-36",
      subjectId: endodontics.id,
      chiefComplaint: "«درد شدید دندان آسیاب بزرگ پایین سمت چپ هنگام خوردن بستنی یا آب سرد که حدود ۱ دقیقه باقی می‌ماند و دیشب هم مرا از خواب بیدار کرد.»",
      demographic: "خانم ۳۲ ساله، معلم دبستان، فاقد بیماری سیستمیک",
      hpi: "بیمار گزارش می‌دهد که دندان آسیاب شماره ۶ سمت چپ او از دو هفته پیش به سرما حساس شده بود، اما از سه روز پیش شدت درد افزایش یافته و درد خودبه‌خودی، به خصوص در حالت درازکشیده رخ می‌دهد که با مسکن موقتاً آرام می‌شود.",
      medicalHistory: "در تاریخچه پزشکی بیمار بیماری قلبی، فشار خون، دیابت، بارداری و حساسیت دارویی ثبت نشده است.",
      examNotes: "در معاینه داخل دهانی، پوسیدگی عمیق کلاس II (اکلوزو-دیستال) روی دندان شماره ۳۶ مشاهده شد. تست دق (Percussion) حساسیت خفیفی را نشان می‌دهد. تست لمس (Palpation) بدون حساسیت است. تست سرما (Cold test) با اسپری کلرواتیل باعث ایجاد درد تیز و بسیار شدید شد که پس از برداشتن محرک، حدود ۵۰ ثانیه طول کشید.",
      difficulty: "INTERMEDIATE" as const,
      published: true,
      referencePlan: "تشخیص نهایی: پالپیت برگشت‌ناپذیر علامت‌دار همراه با پری‌ودنتیت اپیکال علامت‌دار دندان ۳۶. طرح درمان شامل بی‌حسی (IANB)، ایزولاسیون رابر دم، اکسس کویتی، شکل‌دهی روتاری با NaOCl 5.25٪، آبچوریشن با گوتا و سیلر رزینی و در نهایت بیلدآپ دیواره‌هاست.",
      scientificSource: "Cohen's Pathways of the Pulp, 12th Edition",
      referenceRubric: [
        {
          key: "diagnosis",
          text: "تشخیص دقیق پالپیت برگشت‌ناپذیر علامت‌دار و پریودنتیت اپیکال علامت‌دار خفیف",
          weight: 25,
          scientificReference: "Cohen's Pathways of the Pulp - Chapter 1",
          keywords: ["برگشت", "پالپیت", "برگشت ناپذیر", "irreversible", "pulpitis"]
        },
        {
          key: "anesthesia",
          text: "تجویز بی‌حسی بلاک مندیبولار (IANB) به همراه بی‌حسی تکمیلی در صورت لزوم",
          weight: 15,
          scientificReference: "Handbook of Local Anesthesia - Malamed",
          keywords: ["بی حسی", "بلاک", "ianb", "لیدوکائین"]
        },
        {
          key: "isolation",
          text: "استفاده الزامی از رابر دم (Rubber Dam) جهت حفظ ایزولاسیون فیلد درمانی",
          weight: 15,
          scientificReference: "Cohen's Pathways of the Pulp - Chapter 4",
          keywords: ["رابر", "ایزوله", "rubber", "dam"]
        },
        {
          key: "access_cavity",
          text: "طراحی اکسس کویتی ذوزنقه‌ای/مثلثی و برداشت کامل سقف پالپ چمبر و پوسیدگی",
          weight: 15,
          scientificReference: "Cohen's Pathways of the Pulp - Chapter 7",
          keywords: ["اکسس", "حفره دسترسی", "access"]
        },
        {
          key: "irrigation",
          text: "شستشوی کانال با محلول سدیم هیپوکلریت (NaOCl) با غلظت بالای ۲.۵٪",
          weight: 15,
          scientificReference: "Cohen's Pathways of the Pulp - Chapter 9",
          keywords: ["سدیم", "هیپوکلریت", "شستشو", "naocl"]
        },
        {
          key: "obturation",
          text: "پر کردن سه بعدی کانال‌ها با گوتاپرکا و سیلر مناسب و بیلدآپ تاج",
          weight: 15,
          scientificReference: "Cohen's Pathways of the Pulp - Chapter 10",
          keywords: ["گوتا", "سیلر", "پر کردن", "restoration"]
        }
      ]
    },
    {
      title: "آبسه حاد پری‌آپیکال دندان پرمولر اول بالا دارای عصب‌کشی ناقص",
      slug: "acute-apical-abscess-24",
      subjectId: endodontics.id,
      chiefComplaint: "«تورم ناگهانی لثه بالای سمت چپ که با درد شدید و لقی دندان همراه است؛ نمی‌توانم دندان‌هایم را روی هم بگذارم.»",
      demographic: "آقای ۴۸ ساله، کارمند بانک، دارای فشار خون تحت کنترل",
      hpi: "بیمار ۳ سال پیش روی دندان ۲۴ درمان ریشه داشته است. از ۲ روز پیش درد مبهمی شروع شده که به تدریج شدید شده و از دیشب تورم در ناحیه لثه و گونه چپ ظاهر شده است.",
      medicalHistory: "فشار خون بیمار با قرص لوزارتان ۵۰ میلی‌گرم روزانه کنترل می‌شود (۱۲۰/۸۰). حساسیت دارویی ندارد.",
      examNotes: "تورم لوکالیزه، نرم و نوسان‌دار در سالکوس باکال دندان ۲۴ مشهود است. دندان ۲۴ به شدت به دق (Vertical Percussion) و لمس حساس است. لقی درجه ۲ دارد. دندان فاقد واکنش به تست سرما است.",
      difficulty: "ADVANCED" as const,
      published: true,
      referencePlan: "تشخیص نهایی: درمان ریشه قبلی ناقص همراه با آبسه حاد اپیکال دندان ۲۴. طرح درمان شامل تخلیه چرک و درین، خارج کردن گوتاپرکاهای قبلی با حلال، شستشویNaOCl، پانسمان کلسیم هیدروکساید، تجویز آنتی‌بیوتیک سیستمیک و ارجاع برای تکمیل درمان ریشه مجدد (Retreatment).",
      scientificSource: "Cohen's Pathways of the Pulp, 12th Edition",
      referenceRubric: [
        {
          key: "diagnosis",
          text: "تشخیص آبسه حاد اپیکال روی دندان درمان ریشه شده قبلی دندان ۲۴",
          weight: 25,
          scientificReference: "Cohen's Pathways of the Pulp",
          keywords: ["آبسه", "حاد", "اپیکال", "abscess"]
        },
        {
          key: "drainage",
          text: "برقراری درین (تخلیه چرک) از طریق کانال دندان یا ایجاد برش روی تورم لثه (I&D)",
          weight: 20,
          scientificReference: "Peterson's Principles of Oral and Maxillofacial Surgery",
          keywords: ["تخلیه", "درین", "برش", "چرک", "drain"]
        },
        {
          key: "retreatment",
          text: "تخلیه گوتاپرکا و درمان مجدد ریشه دندان (Endodontic Retreatment)",
          weight: 20,
          scientificReference: "Cohen's Pathways of the Pulp",
          keywords: ["درمان مجدد", "تخلیه گوتا", "retreatment"]
        },
        {
          key: "medication",
          text: "تجویز آنتی‌بیوتیک سیستمیک مناسب (آموکسی‌سیلین/مترونیدازول) به علت تورم منتشر و تب",
          weight: 20,
          scientificReference: "Dental Pharmacology - Chapters 4 & 5",
          keywords: ["آنتی بیوتیک", "آموکسی", "مترونیدازول", "نسخه", "دارو"]
        },
        {
          key: "calcium_hydroxide",
          text: "پانسمان داخل کانال با کلسیم هیدروکساید (Calcium Hydroxide) بین جلسات",
          weight: 15,
          scientificReference: "Cohen's Pathways of the Pulp",
          keywords: ["کلسیم", "هیدروکساید", "calcium", "hydroxide"]
        }
      ]
    }
  ];

  for (const c of casesData) {
    const createdCase = await prisma.case.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        title: c.title,
        slug: c.slug,
        subjectId: c.subjectId,
        chiefComplaint: c.chiefComplaint,
        demographic: c.demographic,
        hpi: c.hpi,
        medicalHistory: c.medicalHistory,
        examNotes: c.examNotes,
        difficulty: c.difficulty,
        published: c.published,
        referencePlan: c.referencePlan,
        scientificSource: c.scientificSource,
        referenceRubric: JSON.parse(JSON.stringify(c.referenceRubric))
      }
    });

    console.log(`Case created: ${createdCase.title}`);
  }

  // 3. Create Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@caseclinic.ir" },
    update: {},
    create: {
      name: "دکتر محمدی",
      email: "demo@caseclinic.ir",
      passwordHash: "$2b$10$Wp/26qF/2b7g0K12.fJ7vOBf.DdfK62z.GpH2v07w8.Gf2BvLgS2", // mock hash for "password123"
      role: "STUDENT"
    }
  });

  console.log(`Demo User seeded: ${demoUser.name} (${demoUser.email})`);
  console.log("Database seed successfully completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
