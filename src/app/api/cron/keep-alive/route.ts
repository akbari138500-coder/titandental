import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  
  // Optional cron security: can verify CRON_SECRET if configured in env
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    // Perform simple fast database ping
    const result = await prisma.$queryRaw`SELECT 1 as ping`;
    
    return NextResponse.json({
      success: true,
      message: "پایگاه داده با موفقیت پینگ و فعال نگه‌داشته شد (Warmup).",
      timestamp: new Date().toISOString(),
      result
    });
  } catch (error: any) {
    console.error("Database keep-alive warmup failed:", error);
    return NextResponse.json(
      { success: false, error: "Warmup query failed", details: error.message },
      { status: 500 }
    );
  }
}
