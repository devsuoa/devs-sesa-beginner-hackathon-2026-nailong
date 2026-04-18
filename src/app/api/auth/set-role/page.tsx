// app/api/auth/set-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { role } = await req.json();
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.profile.update({
    where: { id: session.user.id },
    data: {
      role: role === "driver" ? "DRIVER" : "RIDER",
      ...(role === "rider"
        ? { rider: { create: {} } }
        : {
            driver: {
              create: {
                vesselName: "Unnamed Vessel",
                vesselType: "SHUTTLE",
              },
            },
          }),
    },
  });

  return NextResponse.json({ ok: true });
}