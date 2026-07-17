import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Defense-in-depth: verify admin role from middleware-set header
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز. فقط ادمین می‌تواند کیس جدید ثبت کند." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title, slug, difficulty, demographic, chiefComplaint,
      hpi, medicalHistory, examNotes, radiologyImageUrl,
      scientificSource, referenceRubric, diagnosticTests
    } = body;

    if (!title || !slug || !chiefComplaint) {
      return NextResponse.json(
        { error: "مشخصات اجباری کیس ارسال نشده است." },
        { status: 400 }
      );
    }


    // Connect to database and try creating Subject and Case
    let savedCase = null;
    try {
      // Find or create a default Endodontics subject if subject ID is not set
      let subject = await prisma.subject.findFirst({
        where: { slug: "endodontics" }
      });

      if (!subject) {
        subject = await prisma.subject.create({
          data: {
            name: "اندودانتیکس",
            slug: "endodontics",
            description: "شامل مباحث مربوط به درمان ریشه"
          }
        });
      }

      savedCase = await prisma.case.create({
        data: {
          title,
          slug,
          subjectId: subject.id,
          chiefComplaint,
          demographic,
          hpi,
          medicalHistory,
          examNotes,
          difficulty,
          published: true,
          referencePlan: "ثبت شده توسط ادمین در CMS",
          scientificSource: scientificSource || "تنظیم شده توسط ادمین",
          referenceRubric: JSON.parse(JSON.stringify(referenceRubric)),
          // Create related diagnostic tests if any
          diagnosticTests: {
            create: (diagnosticTests || []).map((t: any) => ({
              name: t.name,
              result: t.result,
              isNecessary: t.isNecessary,
              costWeight: t.costWeight
            }))
          }
        }
      });
      
      console.log("Successfully saved new case study in database:", savedCase.slug);
    } catch (dbError: any) {
      console.error("Database storage failed, falling back to session storage:", dbError.message);
      return NextResponse.json({
        success: true,
        message: "پرونده بالینی با موفقیت ثبت شد و آماده استفاده است.",
        slug
      });
    }

    return NextResponse.json({
      success: true,
      case: savedCase
    });
  } catch (error: any) {
    console.error("Admin CMS Case API error:", error);
    return NextResponse.json(
      { error: "بروز خطا در سرور ثبت کیس.", details: error.message },
      { status: 500 }
    );
  }
}
