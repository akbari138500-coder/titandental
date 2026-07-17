import { NextRequest, NextResponse } from "next/server";
import { mockCases } from "@/lib/data/mockCases";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "پیام‌ها به درستی ارسال نشده‌اند." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || "";
    const normalizedMsg = lastMessage.toLowerCase();

    // 1. Simple Keyword RAG Context Retrieval
    let context = "";
    const matchedCases = mockCases.filter(
      (c) =>
        normalizedMsg.includes(c.title.toLowerCase()) ||
        normalizedMsg.includes("پالپ") ||
        normalizedMsg.includes("آبسه") ||
        normalizedMsg.includes("اندو") ||
        normalizedMsg.includes("درمان")
    );

    if (matchedCases.length > 0) {
      context = "داده‌های پرونده‌های بالینی مرتبط جهت استناد:\n" + 
        matchedCases.map(c => `- کیس "${c.title}" با تشخیص مرجع: ${c.referencePlan}`).join("\n");
    }

    const systemPrompt = `You are a Senior Clinical Dental Professor in Iran. Your name is "استاد هوشمند بالینی".
You must help dental students with their queries. Be precise, strict, academic and direct.
Only talk about clinical dentistry, endodontics, restorative, periodontics, radiology, pathology and pharmacology.
If a user asks about anything unrelated to dentistry, politely refuse.
Use the following context if helpful:
${context}

Always reply in fluent Persian (Farsi). Reference dental textbook guidelines (e.g. Cohen's Pathways of the Pulp, Malamed Local Anesthesia, Carranza Periodontology).`;

    const apiKey = process.env.NVIDIA_API_KEY;

    if (apiKey) {
      // Connect to NVIDIA NIM API
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m: any) => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        return NextResponse.json({ success: true, text: aiResponse });
      }
      console.warn("NVIDIA NIM API chat completions returned error status:", response.status);
    }

    // 2. High-fidelity Offline fallback responses
    let fallbackText = "به عنوان استاد بالینی شما، توصیه می‌کنم سرفصل‌های مربوط به پاتولوژی پالپ و پری‌آپیکال در کتاب مسیرهای پالپ کوهن (Cohen's Pathways of the Pulp) را مجدداً مرور کنید. در کار بالینی، دقت در تست‌های سرما و کوبش الکتریکی کلید موفقیت درمان است. چه سوال مشخصی درباره پرونده‌های موجود دارید؟";

    if (normalizedMsg.includes("سلام")) {
      fallbackText = "سلام همکار آینده. چطور می‌توانم در مرور کیس‌های بالینی دندانپزشکی یا آزمون‌های صلاحیت علمی به شما کمک کنم؟";
    } else if (normalizedMsg.includes("پالپیت") || normalizedMsg.includes("پالپ")) {
      fallbackText = "در پالپیت برگشت‌ناپذیر علامت‌دار، التهاب به سطحی رسیده که پالپ توانایی بهبودی ندارد. تفاوت کلیدی آن با نوع برگشت‌پذیر، درد ماندگار به محرک‌های حرارتی (بیش از ۳۰ ثانیه) و دردهای خودبه‌خودی و شبانه است. درمان انتخابی عصب‌کشی کامل (پالپکتومی) است، در حالی که در پالپیت برگشت‌پذیر حذف عامل اتیولوژیک و حفاظت از پالپ کافی است.";
    } else if (normalizedMsg.includes("آبسه") || normalizedMsg.includes("چرک")) {
      fallbackText = "در درمان آبسه حاد پری‌آپیکال، هدف اول باز کردن درین و تخلیه چرک (از طریق کانال یا جراحی لثه) برای کاهش فشار و درد بیمار است. تجویز آنتی‌بیوتیک سیستمیک (مانند آموکسی‌سیلین به همراه مترونیدازول) در صورت وجود تورم منتشر یا تب الزامی است. درمان نهایی شامل پاکسازی کامل روتاری و پانسمان کلسیم هیدروکساید بین جلسات است.";
    } else if (normalizedMsg.includes("بی‌حسی") || normalizedMsg.includes("ianb")) {
      fallbackText = "برای بی‌حسی دندان‌های مولر فک پایین، بلاک عصب مندیبولار (IANB) استاندارد طلایی است. در موارد التهاب شدید (پالپیت شدید)، به علت PH اسیدی بافت، اثر بی‌حسی کاهش می‌یابد. در این شرایط تزریق تکمیلی پاراتال، لیگامانی (PDL injection) یا درون‌پالپی (Intrapulpal) پس از اکسس اولیه توصیه می‌شود.";
    }

    return NextResponse.json({ success: true, text: fallbackText });
  } catch (error: any) {
    console.error("General Chat API route error:", error);
    return NextResponse.json(
      { error: "خطا در برقراری ارتباط با چت‌بات.", details: error.message },
      { status: 500 }
    );
  }
}
