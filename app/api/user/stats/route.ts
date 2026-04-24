import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || !adminDb) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Fetch AI Usage Stats
    const usageSnapshot = await adminDb
      .collection("ai_usage")
      .where("user_id", "==", userId)
      .get();

    let totalToolsUsed = 0;
    const activityFeed: any[] = [];
    const toolCounts: Record<string, number> = {};

    usageSnapshot.forEach((doc) => {
      const data = doc.data();
      totalToolsUsed += data.count || 0;
      
      const toolName = data.tool;
      toolCounts[toolName] = (toolCounts[toolName] || 0) + (data.count || 0);

      activityFeed.push({
        tool: toolName,
        count: data.count,
        last_used: data.last_used,
        action: `Used ${data.tool} ${data.count} time${data.count > 1 ? 's' : ''}`
      });
    });

    // Sort activity feed by last_used descending
    activityFeed.sort((a, b) => new Date(b.last_used).getTime() - new Date(a.last_used).getTime());

    // Security Level (Mock logic for now, but could be based on account age or features used)
    const securityLevel = usageSnapshot.size > 10 ? "Alpha-09" : "Alpha-04";

    return NextResponse.json({
      stats: {
        securityLevel,
        totalToolsUsed,
        activeTools: Object.keys(toolCounts).length,
        lastActivity: activityFeed[0]?.last_used || null,
      },
      activity: activityFeed.slice(0, 5), // Return last 5 activities
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
