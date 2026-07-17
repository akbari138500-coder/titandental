import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Basic auth check
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 403 });
    }

    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "پرامپت خالی است." }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "کلید API انویدیا تنظیم نشده است." }, { status: 500 });
    }

    const systemPrompt = `You are a Senior Dental Educator. Generate a highly realistic clinical OSCE case study based on the user's prompt.
You MUST output ONLY valid JSON matching this exact structure:
{
  "title": "String, academic title of the case",
  "slug": "String, URL-friendly unique english slug like 'complex-endo-36'",
  "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "COMPREHENSIVE",
  "demographic": "String, e.g., 'Male, 45 years old'",
  "chiefComplaint": "String, patient's exact words in Persian",
  "hpi": "String, History of Present Illness in Persian",
  "medicalHistory": "String, relevant medical history in Persian",
  "examNotes": "String, clinical findings in Persian",
  "scientificSource": "String, reference book/chapter",
  "referencePlan": "String, ideal treatment plan in Persian",
  "referenceRubric": [
    {
      "key": "unique-english-key",
      "text": "String, grading criteria description in Persian",
      "weight": Number (10 to 30),
      "scientificReference": "String, source",
      "keywords": ["persian", "keywords", "array"]
    }
  ],
  "diagnosticTests": [
    {
      "name": "Test Name in Persian",
      "result": "Result in Persian",
      "isNecessary": Boolean,
      "costWeight": Number (e.g. 1.0)
    }
  ]
}`;

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || "meta/llama-3.1-70b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a dental case about: ${prompt}. Ensure it is medically accurate, localized to Persian (except slug/keys), and includes a detailed grading rubric summing to 100 points.` }
        ],
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API Error: ${response.status}`);
    }

    const data = await response.json();
    const caseData = JSON.parse(data.choices[0].message.content);

    // Save to database
    let subject = await prisma.subject.findFirst({ where: { slug: "general-dentistry" } });
    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: "دندانپزشکی عمومی", slug: "general-dentistry", description: "کیس‌های تولید شده توسط هوش مصنوعی" }
      });
    }

    const savedCase = await prisma.case.create({
      data: {
        title: caseData.title,
        slug: caseData.slug + "-" + Date.now().toString().slice(-4), // ensure unique slug
        subjectId: subject.id,
        chiefComplaint: caseData.chiefComplaint,
        demographic: caseData.demographic,
        hpi: caseData.hpi,
        medicalHistory: caseData.medicalHistory,
        examNotes: caseData.examNotes,
        difficulty: caseData.difficulty || "INTERMEDIATE",
        published: true,
        referencePlan: caseData.referencePlan,
        scientificSource: caseData.scientificSource,
        referenceRubric: caseData.referenceRubric,
        diagnosticTests: {
          create: (caseData.diagnosticTests || []).map((t: any) => ({
            name: t.name,
            result: t.result,
            isNecessary: t.isNecessary || false,
            costWeight: t.costWeight || 1.0
          }))
        }
      }
    });

    return NextResponse.json({ success: true, case: savedCase });
  } catch (error: any) {
    console.error("AI Case Generation Error:", error);
    return NextResponse.json({ error: "خطا در تولید کیس هوشمند", details: error.message }, { status: 500 });
  }
}
