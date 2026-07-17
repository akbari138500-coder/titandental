import React from "react";
import Navbar from "@/components/Navbar";
import CaseViewer from "@/components/CaseViewer";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

interface CasePageProps {
  params: {
    caseId: string;
  };
}

export default async function CaseDetailsPage({ params }: CasePageProps) {
  const { caseId } = params;

  // Search case from database by id or slug
  const caseData = await prisma.case.findFirst({
    where: {
      OR: [
        { id: caseId },
        { slug: caseId }
      ]
    },
    include: {
      images: true,
      diagnosticTests: true,
      questions: true
    }
  });

  if (!caseData) {
    // If case not found, redirect to cases list
    redirect("/cases");
  }

  // Format caseData to match what CaseViewer expects
  // CaseViewer expects diagnosticTests array, we already include it.
  const formattedCase = {
    ...caseData,
    radiologyImageUrl: caseData.images?.find(img => img.type === "RADIOGRAPH")?.url || "",
  };

  return (
    <div className="min-h-screen bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light">
      <Navbar />
      
      {/* Page Subheader */}
      <div className="bg-white dark:bg-clinical-darker border-b border-clinical-navy/10 dark:border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] bg-clinical-clay/10 text-clinical-clay font-bold px-2 py-0.5 rounded-full">پرونده فعال</span>
            <h1 className="text-md font-bold mt-1 text-clinical-navy dark:text-clinical-light">پرونده بالینی: {caseData.title}</h1>
          </div>
          <span className="text-xs text-clinical-navy/50 dark:text-clinical-light/50 font-mono">ID: {caseData.id}</span>
        </div>
      </div>

      {/* Main Case OSCE workspace */}
      <CaseViewer caseData={formattedCase as any} />
    </div>
  );
}
