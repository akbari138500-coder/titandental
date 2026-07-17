import { NextRequest, NextResponse } from "next/server";
import { evaluateTreatmentPlan } from "@/lib/ai/provider";
import { mockCases } from "@/lib/data/mockCases";
import { prisma } from "@/lib/db";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, treatmentPlan, userId } = body;

    if (!caseId || !treatmentPlan) {
      return NextResponse.json(
        { error: "مشخصات کیس یا طرح درمان ارسال نشده است." },
        { status: 400 }
      );
    }

    // 1. Fetch Case (from DB or mock fallback)
    let selectedCase = null;
    try {
      selectedCase = await prisma.case.findUnique({
        where: { id: caseId },
        include: { subject: true }
      });
    } catch (dbError) {
      console.log("Database connection not ready yet, reading case from static seed data.");
    }

    if (!selectedCase) {
      selectedCase = mockCases.find((c) => c.id === caseId || c.slug === caseId);
    }

    if (!selectedCase) {
      return NextResponse.json(
        { error: "کیس مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    // 2. Perform AI evaluation
    const rubricItems = Array.isArray(selectedCase.referenceRubric) 
      ? selectedCase.referenceRubric 
      : JSON.parse(JSON.stringify(selectedCase.referenceRubric));

    const evaluation = await evaluateTreatmentPlan(
      selectedCase.title,
      selectedCase.chiefComplaint,
      selectedCase.demographic,
      selectedCase.examNotes,
      rubricItems,
      treatmentPlan
    );

    // 3. Save attempt to DB if connection is successful
    let savedAttempt = null;
    if (userId) {
      try {
        savedAttempt = await prisma.attempt.create({
          data: {
            userId,
            caseId: selectedCase.id,
            finalScore: evaluation.score,
            matchedItems: JSON.stringify(evaluation.matched_items),
            missedItems: JSON.stringify(evaluation.missed_items),
            incorrectItems: JSON.stringify(evaluation.incorrect_items),
            feedback: evaluation.feedback_fa,
            safetyFlag: evaluation.critical_safety_flag,
            treatmentPlanSubmitted: treatmentPlan
          }
        });
      } catch (dbSaveError) {
        console.warn("Could not save attempt in database (likely DB is local or offline):", dbSaveError);
      }
    }

    return NextResponse.json({
      success: true,
      evaluation,
      savedAttemptId: savedAttempt ? savedAttempt.id : null
    });
  } catch (error: any) {
    console.error("Internal grading API error:", error);
    return NextResponse.json(
      { error: "بروز خطا در سرور ارزیابی هوش مصنوعی.", details: error.message },
      { status: 500 }
    );
  }
}
